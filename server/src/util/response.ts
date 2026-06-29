import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

// Canonical API response shape used across every controller.
// Historically responses were ad-hoc ({ success, course }, { success, items },
// raw objects, etc.). New and refactored code should always go through these
// helpers so clients can rely on a single { success, message, data } envelope.

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export const ok = <T>(
  c: Context,
  data?: T,
  message = "OK",
  status: ContentfulStatusCode = 200
) => c.json<ApiResponse<T>>({ success: true, message, data }, status);

export const created = <T>(
  c: Context,
  data?: T,
  message = "Created"
) => ok(c, data, message, 201);

export const fail = (
  c: Context,
  message = "Internal server error",
  status: ContentfulStatusCode = 500,
  data?: unknown
) => c.json<ApiResponse>({ success: false, message, data }, status);
