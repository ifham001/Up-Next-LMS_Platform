import type { Context, Next } from "hono";
import type { ZodType } from "zod";
import { BadRequestError } from "./errors";

// Zod validation middleware. zod was already a dependency but used
// inconsistently (some controllers parsed inline, most used hand-written
// `if (!x)` checks). These helpers centralise validation: attach one to a route
// and read the typed, validated value off the context inside the handler.
//
//   route.post('/x', validateBody(schema), handler)
//   const body = getValidated<MyType>(c, 'body')

const KEYS = {
  body: "validatedBody",
  params: "validatedParams",
  query: "validatedQuery",
} as const;

type Source = keyof typeof KEYS;

const make =
  (source: Source, schema: ZodType, read: (c: Context) => unknown | Promise<unknown>) =>
  async (c: Context, next: Next) => {
    const raw = await read(c);
    const result = schema.safeParse(raw);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".") || source}: ${i.message}`)
        .join("; ");
      throw new BadRequestError(message);
    }
    c.set(KEYS[source], result.data);
    await next();
  };

export const validateBody = (schema: ZodType) =>
  make("body", schema, async (c) => {
    try {
      return await c.req.json();
    } catch {
      throw new BadRequestError("Request body must be valid JSON");
    }
  });

export const validateParams = (schema: ZodType) =>
  make("params", schema, (c) => c.req.param());

export const validateQuery = (schema: ZodType) =>
  make("query", schema, (c) => c.req.query());

export const getValidated = <T>(c: Context, source: Source): T =>
  c.get(KEYS[source]) as T;
