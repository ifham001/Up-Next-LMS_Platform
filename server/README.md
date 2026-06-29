# Up-Next LMS — Server

Hono + Drizzle ORM (PostgreSQL) + Google Cloud Storage. JWT auth, bcrypt password
hashing, zod validation.

## Setup

```bash
npm install
```

Create a `.env` with:

```
DB_URL=postgres://user:pass@host:5432/dbname   # required
JWT_SECRET=<a-strong-secret>                    # required (validated at startup)
PORT=3029                                       # optional, defaults to 3029
GOOGLE_APPLICATION_CREDENTIALS_JSON=<json>      # GCS creds (or place google_keys.json)
```

Environment variables are validated at boot in `src/config/env.ts` — the server
**fails fast** with a clear message if anything required is missing. There is no
insecure hardcoded JWT fallback.

## Scripts

```bash
npm run dev               # tsx watch index.ts
npm start                 # tsx index.ts
npm run typecheck         # tsc --noEmit
npm run migrate:generate  # drizzle-kit generate (diff schema -> SQL migration)
npm run migrate:up        # drizzle-kit migrate (apply migrations)
```

## Architecture & conventions

Requests flow through four layers; each only talks to the one below it:

```
route/{admin|user}/*.ts        Hono router, attaches authMiddleware + validators
  → controller/{admin|user}/*  reads the request, calls a query, shapes the response
    → queries/{admin|user}/*   ALL Drizzle / dbDrizzle access lives here
      → schema/...             Drizzle table definitions (re-exported by schema/index.ts)
```

- **Responses** use the canonical envelope from `src/util/response.ts`:
  `{ success, message, data }` via `ok()`, `created()`, `fail()`.
- **Errors**: throw typed errors from `src/util/errors.ts`
  (`BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`,
  `ConflictError`). The central handler registered with `app.onError` in
  `index.ts` translates them to the right HTTP status — no per-handler try/catch.
- **Validation**: attach `validateBody` / `validateParams` / `validateQuery`
  (`src/util/validate.ts`) to a route, then read the typed value with
  `getValidated<T>(c, 'body' | 'params' | 'query')`.
- **Auth**: `authMiddleware` verifies the `Bearer` JWT and sets the decoded
  payload on the context; read the caller's id with `c.get('user').id`.

## Features

User-facing endpoints (mounted under `/user`):

- **Reviews & ratings** (`/user/reviews`) — enrollment-gated create/update,
  public listing + aggregate, own-review lookup, delete. Recomputes
  `course.rating` / `course.total_reviews` on every write.
- **Quiz submission & scoring** (`/user/quiz/submit`, `/user/quiz/:quizId/attempts`,
  `/user/quiz/attempt/:attemptId`) — grades answers against the correct options,
  stores the attempt + per-question answers, returns score/percentage/pass
  (pass threshold 60%).
- **Wishlist** (`/user/wishlist`) — add / list / remove; blocks already-owned
  courses.
- **Course search** (`/user/search-courses`) — query params: `search` (title),
  `domain`, `sort` (`newest|price_asc|price_desc|rating|enrollments`),
  `page`, `limit`. Backward compatible — the original `/user/get-all-courses`
  is unchanged.
- **Certificates** (`/user/certificates`) — issue (gated on 100% course
  progress, idempotent), list own, **public** verify by number
  (`/certificates/verify/:certificateNumber`), owner-only PDF download
  (`/certificates/:certificateNumber/download`, base64 via puppeteer).
- **Notifications** (`/user/notifications`) — paginated feed, unread count,
  mark-one-read, mark-all-read. Fed by admin announcements and certificate events.
- **Coupons (apply)** (`/user/coupons/apply`) — preview a discount against the
  current cart. Redemption happens atomically at checkout when `couponCode` is
  passed to `/user/purchase-items`.
- **Profile** (`/user/profile`) — get/update profile, change password
  (`/user/profile/password`, verifies current password).
- **Video notes** (`/user/notes`) — timestamped per-video notes, owner-scoped CRUD.
- **Password reset (OTP)** (`/user/password/request-reset`, `/verify-otp`,
  `/reset`) — public, enumeration-safe, single-use hashed OTP (10-min expiry),
  serves both `user` and `admin` roles via the `role` field. OTP delivered via
  Twilio when configured (`TWILIO_*` env), else logged to the server console.

Admin endpoints (mounted under `/admin`, JWT-protected):

- **Coupons** (`/admin/coupons`) — create, list, activate/deactivate. Coupons
  are percent or fixed, with optional expiry, total/per-user redemption limits,
  and optional course scope.
- **Announcements** (`/admin/announce`) — broadcast a title+body to every user
  enrolled in a course (fans out to per-user notifications).

## Applying the new tables

Round 1 added: `review`, `wishlist_items`, `quiz_attempt`, `quiz_answer`
(migration `0001`). Round 2 added: `certificate`, `coupon`, `coupon_redemption`,
`note`, `notification`, `password_reset_token` (migration `0002`). All migrations
are already generated and only **add** tables/enums (no destructive changes).
Apply them with:

```bash
npm run migrate:up
```

(If you change schemas, regenerate with `npm run migrate:generate` first.)

### Optional env for password-reset SMS

```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1...
```

When unset, reset OTPs are logged to the server console instead of sent by SMS.
