import { z } from "zod";

/**
 * The contact schema — PRD section 20's field table, shared by the client and
 * the route handler.
 *
 * This is one module imported by both sides, so client and server validation
 * cannot drift. The server re-validates everything regardless: the client copy
 * exists to give fast, specific feedback, not to be trusted.
 *
 * Two rules from section 20 shape the design here:
 *
 *   - Names accept 1-100 *Unicode* characters. A Latin-only regex would reject
 *     a large share of real names, so length is measured in code points and no
 *     character-class restriction is applied.
 *   - Every required field that a prospect may genuinely not know offers an
 *     explicit escape: "Not sure", "Need guidance", "Flexible", "Pre-launch",
 *     "No website yet". Section 20: "Do not silently turn every unknown into a
 *     guessed value."
 */

/** Bumped when the form's fields or wording change materially. */
export const FORM_VERSION = "contact.v1";

/** Recorded against each submission so a later notice change is traceable. */
export const PRIVACY_NOTICE_VERSION = "2026-10-06.1";

/* Section 20: "published service ID or 'Not sure'". These ids map to the
   published service slugs, with the last entry as the explicit unknown. */
export const SERVICE_OPTIONS = [
  { id: "custom-software-development", label: "Custom software" },
  { id: "web-development", label: "Web application" },
  { id: "mobile-app-development", label: "Mobile app" },
  { id: "saas-development", label: "SaaS product" },
  { id: "mvp-development", label: "MVP" },
  { id: "api-development-integration", label: "API & integration" },
  { id: "ui-ux-design", label: "UI/UX design" },
  { id: "qa-testing", label: "QA & testing" },
  { id: "software-maintenance", label: "Maintenance" },
  { id: "dedicated-teams", label: "Dedicated team" },
  { id: "not-sure", label: "Not sure" },
] as const;

export const SERVICE_IDS = SERVICE_OPTIONS.map((option) => option.id);
export const MAX_SERVICES = 5;

/* Section 20: "Include currency; ranges editable without code." Codes are
   stored; labels are display only, so a label change is not a data migration. */
export const BUDGET_OPTIONS = [
  { code: "under-25k", label: "Under USD 25,000" },
  { code: "25k-75k", label: "USD 25,000 – 75,000" },
  { code: "75k-150k", label: "USD 75,000 – 150,000" },
  { code: "over-150k", label: "Over USD 150,000" },
  { code: "need-guidance", label: "Need guidance" },
] as const;

export const TIMELINE_OPTIONS = [
  { code: "within-month", label: "Start within a month" },
  { code: "1-3-months", label: "Start in 1–3 months" },
  { code: "3-6-months", label: "Start in 3–6 months" },
  { code: "flexible", label: "Flexible" },
] as const;

/* Section 20: "Do not infer citizenship or eligibility." This is where the
   business operates from for contracting purposes, nothing more. */
export const COUNTRY_OPTIONS = [
  "Australia",
  "Canada",
  "France",
  "Germany",
  "India",
  "Ireland",
  "Netherlands",
  "Singapore",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Other",
] as const;

export const BUDGET_CODES = BUDGET_OPTIONS.map((option) => option.code);
export const TIMELINE_CODES = TIMELINE_OPTIONS.map((option) => option.code);

/** Count in code points so an emoji or a combining mark is not over-counted. */
export function codePointLength(value: string): number {
  return [...value].length;
}

const unicodeName = (field: string) =>
  z
    .string()
    .trim()
    .refine((value) => codePointLength(value) >= 1, {
      message: `Enter your ${field} name`,
    })
    .refine((value) => codePointLength(value) <= 100, {
      message: `${field === "first" ? "First" : "Last"} name must be 100 characters or fewer`,
    });

/** An https URL. http is rejected: a submitted address is a link we publish
 *  back to staff, and the server never fetches it (section 43's SSRF rule). */
const httpsUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => {
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter an address starting with https://" },
  );

export const contactSchema = z
  .object({
    /* --- Project details ---------------------------------------------- */
    services: z
      .array(z.enum(SERVICE_IDS as unknown as [string, ...string[]]))
      .min(1, "Choose at least one service, or “Not sure”")
      .max(MAX_SERVICES, `Choose no more than ${MAX_SERVICES} services`),
    budgetCode: z.enum(BUDGET_CODES as unknown as [string, ...string[]], {
      message: "Choose a budget range, or “Need guidance”",
    }),
    timelineCode: z.enum(TIMELINE_CODES as unknown as [string, ...string[]], {
      message: "Choose a timeline, or “Flexible”",
    }),
    /* Section 20: preserve line breaks as plain text. No HTML is accepted
       and none is rendered — the value is stored and displayed as text. */
    summary: z
      .string()
      .refine((value) => codePointLength(value.trim()) >= 30, {
        message: "Project summary needs at least 30 characters",
      })
      .refine((value) => codePointLength(value) <= 5000, {
        message: "Project summary must be 5,000 characters or fewer",
      }),
    productUrl: httpsUrl.optional().or(z.literal("")),

    /* --- Contact details ----------------------------------------------- */
    firstName: unicodeName("first"),
    lastName: unicodeName("last"),
    email: z
      .string()
      .trim()
      .max(254, "Email address must be 254 characters or fewer")
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Enter a valid email address, like name@example.com",
      ),
    /* Section 20: optional, max 32, "no phone required for email contact". */
    phone: z.string().trim().max(32).optional().or(z.literal("")),
    company: z
      .string()
      .trim()
      .min(1, "Enter your company name, or “Pre-launch”")
      .max(160, "Company name must be 160 characters or fewer"),
    country: z.enum(COUNTRY_OPTIONS as unknown as [string, ...string[]], {
      message: "Choose your country",
    }),
    website: httpsUrl.optional().or(z.literal("")),
    /* Section 20: "Separate checkbox makes absence valid." */
    noWebsite: z.boolean(),
    preferredContact: z.enum(["email", "phone"]),

    /* --- Consent and provenance ---------------------------------------- */
    privacyAcknowledged: z.literal(true, {
      message: "Confirm you have read the Privacy Policy",
    }),
    noticeVersion: z.string().max(40),
    formVersion: z.string().max(40),
    /* Section 38: allowlisted UTM values and a clean landing path only.
       Arbitrary query strings are stripped before they reach here. */
    source: z
      .object({
        utmSource: z.string().max(64).optional(),
        utmMedium: z.string().max(64).optional(),
        utmCampaign: z.string().max(64).optional(),
        landingPath: z.string().max(512).optional(),
      })
      .optional(),
  })
  .refine((data) => data.noWebsite || Boolean(data.website), {
    message: "Enter an https:// website, or tick “No website yet”",
    path: ["website"],
  })
  .refine(
    (data) => data.preferredContact !== "phone" || Boolean(data.phone?.trim()),
    {
      message: "Add a phone number to be contacted by phone",
      path: ["preferredContact"],
    },
  );

export type ContactInput = z.infer<typeof contactSchema>;

/** Field order used by the error summary, so it matches the visual order. */
export const FIELD_ORDER: Array<keyof ContactInput> = [
  "services",
  "budgetCode",
  "timelineCode",
  "summary",
  "productUrl",
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "country",
  "website",
  "preferredContact",
  "privacyAcknowledged",
];

/** The DOM id each field's control carries, for error-summary links. */
export const FIELD_IDS: Record<string, string> = {
  services: "f-services",
  budgetCode: "f-budget",
  timelineCode: "f-timeline",
  summary: "f-summary",
  productUrl: "f-product",
  firstName: "f-first",
  lastName: "f-last",
  email: "f-email",
  phone: "f-phone",
  company: "f-company",
  country: "f-country",
  website: "f-website",
  preferredContact: "f-preferred",
  privacyAcknowledged: "f-privacy",
};

export type FieldErrors = Partial<Record<string, string>>;

/** Flatten a parse failure into one message per field, in display order. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
