# SafeNechExpert Portal — interactive prototype

Client portal prototype for a Kazakhstan consulting company that obtains licenses, permits and accreditations for businesses.
A visitor picks a service, answers yes/no questions about what they already have, and gets an instant price and timeline.
An AI agent then collects and checks documents over WhatsApp, and a human manager sends the final offer.

This repository is the **clickable prototype**: real UI on the target frontend stack, mock data, no backend.

## What's inside

| Route                       | Role    | What it shows                                                                                 |
| --------------------------- | ------- | --------------------------------------------------------------------------------------------- |
| `/`                         | Visitor | Landing: animated hero, how it works, service catalog (26 services), AI agent showcase        |
| `/services/[slug]`          | Visitor | Service page: issuer, government term and fee, key requirements                               |
| `/calculator/[slug]`        | Visitor | Step-by-step calculator with a live price range and the list of items the company will handle |
| `/demo/whatsapp`            | Visitor | Scripted WhatsApp dialogue with the AI agent, built from the calculator answers               |
| `/cabinet`                  | Client  | Application timeline, AI-checked documents, offer with Kaspi / card payment (mocked)          |
| `/manager`, `/manager/[id]` | Manager | Kanban board, AI report, extracted data, offer form                                           |
| `/admin`                    | Admin   | Calculator editor: base price, questions, surcharges, extra days                              |

Calculators are fully configured for two services: scrap metal permit and construction license (category III).
Prices are placeholders.

## Stack

Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS 4 · Motion · Lenis · Vitest · ESLint · Prettier

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Development server                        |
| `npm run build`     | Production build                          |
| `npm run lint`      | ESLint                                    |
| `npm run typecheck` | TypeScript check                          |
| `npm test`          | Unit tests (pricing engine, agent script) |
| `npm run format`    | Prettier                                  |

## Project structure

```
src/
  app/(site)/      public pages: landing, services, calculator, WhatsApp demo
  app/(portal)/    client cabinet, manager panel, admin
  components/      UI grouped by area (landing, calculator, chat, portal)
  data/            mock catalog, calculator configs, applications
  lib/             pricing engine, agent script builder, formatting
```

## Pricing model

`calculateQuote` in `src/lib/pricing.ts` is deterministic: base fee + government fee + a surcharge for every missing item.
While questions are unanswered, the quote is shown as a range. The AI agent never sets prices.

## Target architecture (next phase)

- **Backend:** Go (chi, pgx + sqlc, goose), PostgreSQL, Redis + asynq for background jobs
- **Files:** S3-compatible storage hosted in Kazakhstan, ClamAV scanning
- **AI agent:** LLM with tool use and PDF/image reading, structured JSON report for the manager
- **WhatsApp:** official WhatsApp Business Cloud API
- **CRM:** Bitrix24 via an adapter with the outbox pattern
- **Payments:** Kaspi Pay and bank cards
