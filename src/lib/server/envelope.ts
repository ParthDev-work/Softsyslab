import "server-only";

/**
 * Response envelopes — PRD section 43.
 *
 * Every endpoint answers in one of exactly two shapes, so a client never has
 * to guess how a failure is reported:
 *
 *   {"ok":true, "data":{...}, "requestId":"<uuid>"}
 *   {"ok":false,"error":{"code","message","fields"?}, "requestId":"<uuid>"}
 *
 * Section 43 also requires that no stack trace or provider secret is exposed,
 * which is why `fail` takes a fixed code and a message written for a person
 * rather than an exception.
 */

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "MALFORMED_REQUEST"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "PAYLOAD_TOO_LARGE"
  | "FORBIDDEN_ORIGIN"
  | "RATE_LIMITED"
  | "IDEMPOTENCY_CONFLICT"
  | "STORAGE_UNAVAILABLE"
  | "UNAUTHORIZED"
  | "NOT_CONFIGURED";

export type ApiSuccess<T> = { ok: true; data: T; requestId: string };
export type ApiFailure = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    fields?: Record<string, string>;
  };
  requestId: string;
};

export function succeed<T>(
  data: T,
  requestId: string,
  status: number,
  headers?: HeadersInit,
): Response {
  return Response.json({ ok: true, data, requestId } satisfies ApiSuccess<T>, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export function fail(
  code: ApiErrorCode,
  message: string,
  requestId: string,
  status: number,
  options?: { fields?: Record<string, string>; headers?: HeadersInit },
): Response {
  return Response.json(
    {
      ok: false,
      error: { code, message, ...(options?.fields ? { fields: options.fields } : {}) },
      requestId,
    } satisfies ApiFailure,
    {
      status,
      headers: { "Cache-Control": "no-store", ...options?.headers },
    },
  );
}
