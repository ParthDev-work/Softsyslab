"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import {
  Checkbox,
  Field,
  FieldError,
  FieldGroup,
  RadioCard,
  Select,
  TextArea,
  TextInput,
  ChipToggle,
} from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { track } from "@/lib/analytics";
import {
  BUDGET_OPTIONS,
  COUNTRY_OPTIONS,
  FIELD_IDS,
  FIELD_ORDER,
  FORM_VERSION,
  MAX_SERVICES,
  PRIVACY_NOTICE_VERSION,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  codePointLength,
  contactSchema,
  toFieldErrors,
  type FieldErrors,
} from "@/lib/validation/contact";

/**
 * PRD section 20 and the section 54 contact wireframe.
 *
 * State flow is idle → validating → submitting → success or recoverable error.
 * Repeat submission is disabled while pending, values are preserved on error,
 * and an error summary above the form receives focus after an invalid submit
 * with each entry linking to its field (AC07).
 *
 * The success screen replaces the form and appears only after the server
 * confirms a durable write (AC09) — a store failure returns 503 and the form
 * comes back with every answer intact and nothing claimed.
 *
 * Validation uses the same schema module the route handler imports, so the two
 * cannot disagree. The server revalidates regardless; this copy exists for
 * fast, specific feedback, not as a trust boundary.
 *
 * There is no file input anywhere. REQ-UPLOAD-01 says to remove the attachment
 * interface where scanning is not implemented, rather than offer one that
 * silently discards the file.
 */

type Status = "idle" | "submitting" | "success";

type Values = {
  services: string[];
  budgetCode: string;
  timelineCode: string;
  summary: string;
  productUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  website: string;
  noWebsite: boolean;
  preferredContact: "email" | "phone";
  privacyAcknowledged: boolean;
};

const blank: Values = {
  services: [],
  budgetCode: "",
  timelineCode: "",
  summary: "",
  productUrl: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  website: "",
  noWebsite: false,
  preferredContact: "email",
  privacyAcknowledged: false,
};

/** Section 38: allowlisted UTM values and a clean landing path only. */
function readSource() {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const allow = (key: string) => {
    const value = params.get(key);
    if (!value) return undefined;
    return /^[\w .\-]{1,64}$/.test(value) ? value : undefined;
  };
  return {
    utmSource: allow("utm_source"),
    utmMedium: allow("utm_medium"),
    utmCampaign: allow("utm_campaign"),
    landingPath: window.location.pathname,
  };
}

export function ContactForm({ storeIsDurable }: { storeIsDurable: boolean }) {
  const [values, setValues] = useState<Values>(blank);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  /* A fresh key per attempt sequence. Retrying the same enquiry reuses it, so
     a retry after an uncertain response replays rather than duplicating; a
     new enquiry gets a new one. */
  const idempotencyKey = useRef<string>(crypto.randomUUID());

  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const servicesLabelId = useId();

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function payloadFrom(current: Values) {
    return {
      ...current,
      productUrl: current.productUrl.trim(),
      website: current.noWebsite ? "" : current.website.trim(),
      phone: current.phone.trim(),
      noticeVersion: PRIVACY_NOTICE_VERSION,
      formVersion: FORM_VERSION,
      source: readSource(),
    };
  }

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => {
      const next = { ...current, [key]: value };
      // Re-validate live only once the visitor has tried to submit, so that
      // errors are not shown for fields they have not reached yet.
      if (attempted) {
        const parsed = contactSchema.safeParse(payloadFrom(next));
        setErrors(parsed.success ? {} : toFieldErrors(parsed.error));
      }
      return next;
    });
    setSubmitError(null);

    if (!started) {
      setStarted(true);
      track({ name: "contact_started", formVersion: FORM_VERSION });
    }
  }

  function toggleService(id: string) {
    const selected = values.services.includes(id);
    if (selected) {
      update(
        "services",
        values.services.filter((value) => value !== id),
      );
      return;
    }
    // "Not sure" is exclusive — it means the opposite of a specific choice.
    const next =
      id === "not-sure"
        ? ["not-sure"]
        : [...values.services.filter((value) => value !== "not-sure"), id];
    update("services", next.slice(0, MAX_SERVICES));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "submitting") return;

    const payload = payloadFrom(values);
    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      setAttempted(true);
      // AC07: focus moves to the summary, which links to each field.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setStatus("submitting");
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify(parsed.data),
      });

      const body: unknown = await response.json().catch(() => null);

      if (response.ok && isSuccessBody(body)) {
        setReference(body.data.reference);
        setStatus("success");
        track({
          name: "contact_submitted",
          eventId: crypto.randomUUID(),
          formVersion: FORM_VERSION,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setStatus("idle");

      if (isFailureBody(body)) {
        if (body.error.fields) {
          setErrors(body.error.fields);
          setAttempted(true);
          requestAnimationFrame(() => summaryRef.current?.focus());
          return;
        }
        setSubmitError(body.error.message);
        return;
      }

      setSubmitError(
        "We could not submit your enquiry yet. Your answers are still here. Please try again.",
      );
    } catch {
      setStatus("idle");
      setSubmitError(
        navigator.onLine
          ? "We could not submit your enquiry yet. Your answers are still here. Please try again."
          : "You appear to be offline. Reconnect to submit your enquiry.",
      );
    }
  }

  if (status === "success" && reference) {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-card border border-success-line bg-success-bg p-[clamp(1.5rem,4vw,2.5rem)]"
      >
        <p className="type-meta text-success">✓ Enquiry received</p>
        <h2 className="mt-3 text-[1.75rem]/9 font-semibold">
          Your enquiry has been received.
        </h2>
        <p className="mt-3 text-[1.0625rem]/7 text-nav">
          Reference:{" "}
          <span className="font-mono font-medium text-anchor">{reference}</span>
          . We will review the information and contact you using your preferred
          method.
        </p>

        <ol className="mt-7 grid list-none gap-0 border-t border-success-line p-0">
          {[
            "We review whether the project fits our services.",
            "We clarify requirements with any questions.",
            "We agree the next discussion together.",
          ].map((step, index) => (
            <li
              key={step}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-b border-success-line py-3.5 text-body"
            >
              <span aria-hidden="true" className="font-mono text-success">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {!storeIsDurable ? (
          <Notice tone="warning" role="note" className="mt-7">
            <p>
              This deployment has no durable database yet. Your enquiry was
              written to the running instance only and may not survive. Nothing
              has been emailed to anyone. Please do not rely on this reference
              until the backend is connected.
            </p>
          </Notice>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-3">
          <LinkButton href="/" variant="dark">
            Return to home
          </LinkButton>
          <Button
            variant="outline"
            onClick={() => {
              idempotencyKey.current = crypto.randomUUID();
              setValues(blank);
              setErrors({});
              setAttempted(false);
              setReference(null);
              setStatus("idle");
            }}
          >
            Send another enquiry
          </Button>
        </div>
      </div>
    );
  }

  const errorEntries = FIELD_ORDER.map((key) => ({
    key: String(key),
    message: errors[String(key)],
  })).filter((entry): entry is { key: string; message: string } =>
    Boolean(entry.message),
  );

  const summaryLength = codePointLength(values.summary);

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-12">
      {errorEntries.length > 0 ? (
        <div
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          className="rounded-card border border-danger-line bg-danger-bg p-5 text-danger lg:p-6"
        >
          <h2 className="text-body-lg font-semibold">
            <span aria-hidden="true">⚠ </span>
            Please fix{" "}
            {errorEntries.length === 1
              ? "1 field"
              : `${errorEntries.length} fields`}{" "}
            before sending
          </h2>
          <ul className="mt-2.5 grid list-disc gap-1 pl-5 text-small">
            {errorEntries.map((entry) => (
              <li key={entry.key}>
                <a
                  href={`#${FIELD_IDS[entry.key] ?? entry.key}`}
                  className="text-danger underline underline-offset-4"
                >
                  {entry.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {submitError ? (
        <Notice tone="error" role="alert">
          <p>{submitError}</p>
        </Notice>
      ) : null}

      <FieldGroup index="01" legend="Project details">
        <div className="grid gap-2">
          <span id={servicesLabelId} className="text-body font-medium">
            Service needed{" "}
            <span className="font-normal text-muted">
              — choose up to {MAX_SERVICES}
            </span>
          </span>
          <div
            id="f-services"
            role="group"
            aria-labelledby={servicesLabelId}
            aria-describedby={errors.services ? "f-services-error" : undefined}
            className="flex flex-wrap gap-2"
          >
            {SERVICE_OPTIONS.map((option) => {
              const pressed = values.services.includes(option.id);
              return (
                <ChipToggle
                  key={option.id}
                  pressed={pressed}
                  invalid={Boolean(errors.services)}
                  disabled={
                    !pressed && values.services.length >= MAX_SERVICES
                  }
                  onToggle={() => toggleService(option.id)}
                >
                  {option.label}
                </ChipToggle>
              );
            })}
          </div>
          {errors.services ? (
            <FieldError id="f-services-error">{errors.services}</FieldError>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="f-budget" label="Budget" error={errors.budgetCode}>
            {(describedBy, invalid) => (
              <Select
                id="f-budget"
                name="budget"
                value={values.budgetCode}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => update("budgetCode", event.target.value)}
              >
                <option value="">Select a range</option>
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            id="f-timeline"
            label="Expected timeline"
            error={errors.timelineCode}
          >
            {(describedBy, invalid) => (
              <Select
                id="f-timeline"
                name="timeline"
                value={values.timelineCode}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => update("timelineCode", event.target.value)}
              >
                <option value="">Select a timeline</option>
                {TIMELINE_OPTIONS.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <Field
          id="f-summary"
          label="Project summary"
          hint="Who will use it, what it should do first, and any systems it must connect to."
          counter={`${summaryLength} / 5000`}
          error={errors.summary}
        >
          {(describedBy, invalid) => (
            <TextArea
              id="f-summary"
              name="summary"
              rows={6}
              maxLength={5000}
              value={values.summary}
              invalid={invalid}
              aria-describedby={describedBy}
              placeholder="e.g. Our operations team tracks job requests in spreadsheets. We want a web app where customers submit requests and staff approve and assign them."
              onChange={(event) => update("summary", event.target.value)}
            />
          )}
        </Field>

        <Field
          id="f-product"
          label="Existing product URL"
          note="— optional"
          error={errors.productUrl}
        >
          {(describedBy, invalid) => (
            <TextInput
              id="f-product"
              name="productUrl"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={values.productUrl}
              invalid={invalid}
              aria-describedby={describedBy}
              onChange={(event) => update("productUrl", event.target.value)}
            />
          )}
        </Field>
      </FieldGroup>

      <FieldGroup index="02" legend="Your contact details" divider>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="f-first" label="First name" error={errors.firstName}>
            {(describedBy, invalid) => (
              <TextInput
                id="f-first"
                name="firstName"
                autoComplete="given-name"
                value={values.firstName}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => update("firstName", event.target.value)}
              />
            )}
          </Field>

          <Field id="f-last" label="Last name" error={errors.lastName}>
            {(describedBy, invalid) => (
              <TextInput
                id="f-last"
                name="lastName"
                autoComplete="family-name"
                value={values.lastName}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => update("lastName", event.target.value)}
              />
            )}
          </Field>

          <Field id="f-email" label="Business email" error={errors.email}>
            {(describedBy, invalid) => (
              <TextInput
                id="f-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => update("email", event.target.value)}
              />
            )}
          </Field>

          <Field
            id="f-phone"
            label="Phone"
            note="— optional"
            error={errors.phone}
          >
            {(describedBy, invalid) => (
              <TextInput
                id="f-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={32}
                placeholder="+1 555 000 0000"
                value={values.phone}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => update("phone", event.target.value)}
              />
            )}
          </Field>

          <Field
            id="f-company"
            label="Company"
            hint="Not formed yet? Write “Pre-launch”."
            error={errors.company}
          >
            {(describedBy, invalid) => (
              <TextInput
                id="f-company"
                name="company"
                autoComplete="organization"
                value={values.company}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => update("company", event.target.value)}
              />
            )}
          </Field>

          <Field id="f-country" label="Country" error={errors.country}>
            {(describedBy, invalid) => (
              <Select
                id="f-country"
                name="country"
                value={values.country}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => update("country", event.target.value)}
              >
                <option value="">Select a country</option>
                {COUNTRY_OPTIONS.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <div className="grid gap-2">
          <Field id="f-website" label="Company website" error={errors.website}>
            {(describedBy, invalid) => (
              <TextInput
                id="f-website"
                name="website"
                type="url"
                inputMode="url"
                placeholder="https://"
                disabled={values.noWebsite}
                value={values.noWebsite ? "" : values.website}
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => update("website", event.target.value)}
              />
            )}
          </Field>
          <label
            htmlFor="f-no-website"
            className="flex h-11 w-fit cursor-pointer items-center gap-2.5 text-small"
          >
            <input
              id="f-no-website"
              type="checkbox"
              checked={values.noWebsite}
              onChange={(event) => update("noWebsite", event.target.checked)}
              className="size-5 accent-brand"
            />
            No website yet
          </label>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="pref-label"
          aria-describedby={
            errors.preferredContact ? "f-preferred-error" : undefined
          }
          id="f-preferred"
          className="grid gap-2"
        >
          <span id="pref-label" className="text-body font-medium">
            Preferred contact method
          </span>
          <div className="flex flex-wrap gap-3">
            <RadioCard
              id="f-pref-email"
              name="preferredContact"
              value="email"
              checked={values.preferredContact === "email"}
              onChange={() => update("preferredContact", "email")}
            >
              Email
            </RadioCard>
            <RadioCard
              id="f-pref-phone"
              name="preferredContact"
              value="phone"
              checked={values.preferredContact === "phone"}
              onChange={() => update("preferredContact", "phone")}
            >
              Phone
            </RadioCard>
          </div>
          {errors.preferredContact ? (
            <FieldError id="f-preferred-error">
              {errors.preferredContact}
            </FieldError>
          ) : null}
        </div>
      </FieldGroup>

      <div className="grid gap-5 border-t border-hairline pt-8">
        <Checkbox
          id="f-privacy"
          checked={values.privacyAcknowledged}
          error={errors.privacyAcknowledged}
          onChange={(event) =>
            update("privacyAcknowledged", event.target.checked)
          }
          label={
            <>
              I have read the{" "}
              <Link
                href="/privacy/"
                className="text-brand underline underline-offset-4"
              >
                Privacy Policy
              </Link>{" "}
              and understand how my enquiry will be handled.
            </>
          }
        />

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" loading={status === "submitting"}>
            {status === "submitting"
              ? "Submitting enquiry…"
              : "Submit Project Inquiry"}
          </Button>
          <p className="max-w-[44ch] text-xs text-muted">
            Sending an enquiry does not create a contract or commitment on
            either side.
          </p>
        </div>
      </div>
    </form>
  );
}

function isSuccessBody(
  body: unknown,
): body is { ok: true; data: { reference: string } } {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as { ok?: unknown; data?: { reference?: unknown } };
  return candidate.ok === true && typeof candidate.data?.reference === "string";
}

function isFailureBody(body: unknown): body is {
  ok: false;
  error: { message: string; fields?: Record<string, string> };
} {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as { ok?: unknown; error?: { message?: unknown } };
  return candidate.ok === false && typeof candidate.error?.message === "string";
}
