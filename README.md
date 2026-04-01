[README.md](https://github.com/user-attachments/files/26415407/README.md)
# IndoLegal Compliance AI

IndoLegal Compliance AI is a Next.js 14 application for uploading legal documents, reviewing compliance risk, and managing document records in a protected workspace.

## Features

- Public landing page at `/`
- Protected dashboard at `/dashboard`
- Document library at `/documents`
- Document upload flow at `/documents/upload`
- Document detail page at `/documents/[id]`
- Regulatory and settings pages
- Clerk authentication with sign-in and sign-up pages
- Prisma + PostgreSQL persistence
- Groq-powered legal analysis with structured JSON output
- Per-user document ownership and account isolation
- Delete actions on dashboard, documents list, and document detail views

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** Clerk
- **Database:** PostgreSQL + Prisma
- **AI provider:** Groq (OpenAI-compatible SDK)
- **Animations:** Framer Motion

## Project Structure

```text
app/
  api/
    analyze/
    documents/
    webhooks/
  dashboard/
  documents/
  regulatory/
  settings/
  sign-in/
  sign-up/
components/
lib/
prisma/
```

## Main Routes

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/dashboard` | Protected internal dashboard |
| `/documents` | Protected document registry |
| `/documents/upload` | Protected upload flow |
| `/documents/[id]` | Protected document detail page |
| `/regulatory` | Protected regulatory view |
| `/settings` | Protected settings view |
| `/sign-in` | Sign-in page |
| `/sign-up` | Sign-up page |
| `/api/analyze` | Analyze raw document text |
| `/api/documents/upload` | Upload and optionally analyze a document |
| `/api/documents/[id]` | Delete a document |
| `/api/webhooks/clerk` | Clerk webhook endpoint |

## Requirements

- Node.js 18+
- npm
- PostgreSQL database
- Clerk application
- Groq API key

## Installation

```bash
npm install
```

## Environment Variables

Create a local environment file such as `.env.local`.

### Required

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
GROQ_API_KEY=
```

### Optional / Recommended

```env
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_TIMEOUT_MS=60000
WEBHOOK_SECRET=
```

## Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Run local migrations:

```bash
npx prisma migrate dev
```

For production environments:

```bash
npx prisma migrate deploy
```

## Local Development

Start the development server:

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

If you are running in WSL or need network access from outside the local loopback interface:

```bash
npm run dev -- --hostname 0.0.0.0
```

## Production Preview

Build and start locally:

```bash
npm run build
npm run start
```

## Authentication Notes

- Public routes: `/`, `/sign-in`, `/sign-up`
- Internal application pages are protected by Clerk middleware
- Clerk webhook handling expects `WEBHOOK_SECRET` if webhook sync is enabled

## AI Analysis Notes

The active analysis flow uses Groq through the OpenAI-compatible SDK.

Current defaults:

- **Base URL:** `https://api.groq.com/openai/v1`
- **Model:** `llama-3.3-70b-versatile`

The analysis layer expects structured JSON in this shape:

```ts
type ComplianceIssue = {
  clauseText: string;
  riskLevel: "High Risk" | "Medium Risk" | "Compliant";
  reason: string;
  recommendation: string;
};
```

## Deployment Notes for Vercel

Before deploying to Vercel:

1. Use a **remote PostgreSQL** instance. Do not use `localhost` in `DATABASE_URL`.
2. Add all required environment variables in the Vercel project settings.
3. Configure Clerk keys in Vercel.
4. If using Clerk webhooks, set `WEBHOOK_SECRET` and update the webhook URL to:

```text
https://YOUR-DOMAIN/api/webhooks/clerk
```

Recommended Vercel build command:

```bash
npx prisma migrate deploy && next build
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Troubleshooting

### Missing Clerk publishable key
Add this variable in your environment:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

### Vercel cannot connect to the database
Your `DATABASE_URL` is likely pointing to a local database. Use a hosted PostgreSQL connection string.

### Groq analysis errors
Check:

- `GROQ_API_KEY`
- `GROQ_MODEL`
- Groq account quota / rate limits

## License

Add your preferred license here.
