import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import { fail } from "./response";

// Typed application errors. Throw these from controllers/services/queries and
// let the central handler (registered via app.onError in index.ts) turn them
// into the correct HTTP status + canonical response. This replaces the
// per-handler try/catch boilerplate and fixes the pervasive "401 for a server
// error" miscoding that existed throughout the old controllers.

export class AppError extends Error {
  readonly status: ContentfulStatusCode;
  readonly expose: boolean;

  constructor(message: string, status: ContentfulStatusCode = 500, expose = true) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.expose = expose;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

// Wrap an async Hono handler so any thrown error is forwarded to the central
// onError handler instead of crashing the request. Lets handlers be written as
// straight-line happy paths with no try/catch.
type Handler = (c: Context) => Promise<Response> | Response;

export const wrap =
  (handler: Handler): Handler =>
  async (c: Context) => {
    return await handler(c);
  };

// Safely extract a human-readable message from an unknown thrown value
// (catch clause bindings are typed `unknown` under strict mode).
export const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

// Central error -> HTTP translation. Registered once in index.ts.
export const onError = (err: Error, c: Context): Response => {
  if (err instanceof ZodError) {
    const message = err.issues
      .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
      .join("; ");
    return fail(c, message || "Validation failed", 400);
  }

  if (err instanceof AppError) {
    return fail(c, err.expose ? err.message : "Internal server error", err.status);
  }

  // Unknown error: log it server-side, never leak details to the client.
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  return fail(c, "Internal server error", 500);
};
