import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Form primitives — PRD sections 29 and 32, in the design's treatment: 52px
 * controls, visible labels above, a hint line beneath the label, and the error
 * directly under the control.
 *
 * Inputs define empty, filled, focus, invalid, disabled and read-only. Error
 * text sits next to its field and is linked by aria-describedby. An invalid
 * field is marked by an icon and a message as well as by colour, because
 * section 29 forbids state carried by colour alone.
 */

const control =
  "w-full rounded-control border bg-canvas px-3.5 text-body text-text " +
  "placeholder:text-faint " +
  "border-field aria-[invalid=true]:border-danger " +
  "disabled:bg-tint disabled:text-dim disabled:cursor-not-allowed " +
  "read-only:bg-tint read-only:text-muted";

function WarningGlyph() {
  return (
    <span aria-hidden="true" className="flex-none font-medium">
      ⚠
    </span>
  );
}

export function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="flex gap-1.5 text-xs font-medium text-danger">
      <WarningGlyph />
      <span>{children}</span>
    </p>
  );
}

type FieldProps = {
  id: string;
  label: string;
  /** Appended to the label in muted weight, e.g. "— optional". */
  note?: string;
  hint?: string;
  error?: string;
  /** Right-aligned counter shown on the label row, e.g. "120 / 5000". */
  counter?: string;
  children: (describedBy: string | undefined, invalid: boolean) => ReactNode;
};

export function Field({
  id,
  label,
  note,
  hint,
  error,
  counter,
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-2">
      <div className="flex justify-between gap-3">
        <label htmlFor={id} className="text-body font-medium text-anchor">
          {label}
          {note ? (
            <span className="font-normal text-muted"> {note}</span>
          ) : null}
        </label>
        {counter ? (
          <span aria-hidden="true" className="font-mono text-xs text-muted">
            {counter}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {children(describedBy, Boolean(error))}
      {error && errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

export function TextInput({
  invalid,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(control, "h-13", className)}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(control, "min-h-40 resize-y py-3.5 leading-6.5", className)}
    />
  );
}

export function Select({
  invalid,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(control, "h-13 pr-10", className)}
    >
      {children}
    </select>
  );
}

/**
 * Section 20's two logical groups, numbered in the mono accent voice. A
 * fieldset with a visible legend is the correct grouping semantics; the number
 * is decorative and hidden from assistive technology.
 */
export function FieldGroup({
  index,
  legend,
  divider = false,
  children,
}: {
  index: string;
  legend: string;
  divider?: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset
      className={cn(
        "m-0 grid min-w-0 gap-6 border-0 p-0",
        divider && "border-t border-hairline pt-8",
      )}
    >
      <legend className="float-left mb-0 flex w-full items-baseline gap-3.5 p-0 text-[1.5rem]/8 font-semibold">
        <span aria-hidden="true" className="font-mono text-xs font-normal text-brand">
          {index}
        </span>
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: ReactNode;
  error?: string;
};

export function Checkbox({ id, label, error, ...rest }: CheckboxProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 text-body leading-6.5"
      >
        <input
          {...rest}
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className="mt-[3px] size-5 flex-none accent-brand"
        />
        <span>{label}</span>
      </label>
      {error && errorId ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

/** A radio rendered as a bordered 48px target, per the design. */
export function RadioCard({
  id,
  name,
  value,
  checked,
  onChange,
  children,
}: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex h-12 cursor-pointer items-center gap-2.5 rounded-control border px-4 text-small",
        checked ? "border-anchor bg-surface" : "border-line",
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="size-4.5 accent-brand"
      />
      {children}
    </label>
  );
}

/**
 * The multi-select chip group from the design. Toggle buttons with aria-pressed
 * rather than checkboxes styled as pills: the control is genuinely a toggle,
 * and the group is labelled so a screen reader announces what is being chosen.
 * Section 20 caps the selection at five.
 */
export function ChipToggle({
  pressed,
  disabled,
  invalid,
  onToggle,
  children,
}: {
  pressed: boolean;
  disabled?: boolean;
  invalid?: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "h-11 cursor-pointer rounded-control border px-4 text-small transition-colors duration-150 motion-reduce:transition-none",
        pressed
          ? "border-anchor bg-anchor text-white"
          : "bg-canvas text-anchor " + (invalid ? "border-danger" : "border-line"),
        !pressed && !disabled && "hover:border-field hover:bg-surface",
        disabled && "cursor-not-allowed opacity-45",
      )}
    >
      {children}
    </button>
  );
}
