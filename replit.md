# HEGP — AI-Powered Educational Video Generator

An AI pipeline that converts NCERT/CBSE textbook chapter PDFs into educational video screenplays, featuring animated characters Shakuntala (teacher) and Sara (student). Teachers upload a PDF and get a structured scene-by-scene screenplay with chalkboard animations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/hegp run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` + `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — set by Replit AI integration

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind + shadcn/ui + wouter
- API: Express 5 + multer (PDF upload) + pdf-parse
- AI: Anthropic Claude (claude-sonnet-4-6) via Replit AI integration (no API key needed)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB schema: jobs.ts, job_logs.ts
- `artifacts/api-server/src/routes/jobs.ts` — all job CRUD routes + SSE stream
- `artifacts/api-server/src/lib/pipeline.ts` — full AI video generation pipeline
- `artifacts/hegp/src/pages/` — frontend pages (Home, JobDetail, History)

## Architecture decisions

- PDF upload via multer to disk storage; files cleaned up after processing
- Pipeline is async — job creation returns immediately, pipeline runs in background
- SSE stream at `/api/jobs/:id/stream` for real-time log updates (polls every 1s)
- Claude generates a JSON screenplay; if FFmpeg is available it renders real MP4s, otherwise creates an HTML preview
- AI integration via Replit proxy — no user API key required, billed to Replit credits

## Product

Teachers upload any NCERT/CBSE chapter PDF. The system:
1. Parses the PDF with pdf-parse
2. Sends to Claude to generate a structured scene-by-scene screenplay
3. Each scene has dialogue for Shakuntala/Sara, chalkboard text, visual description, and duration
4. If FFmpeg is present, renders a real MP4 video; otherwise generates an HTML screenplay preview
5. Live progress shown in the web UI with SSE log streaming

## User preferences

- Warm Indian identity: saffron/deep green palette
- No emojis in the UI

## Gotchas

- The pipeline is CPU-bound for video generation; FFmpeg must be installed for real MP4 output
- Claude model: claude-sonnet-4-6 (do not upgrade without testing)
- Always run codegen after changing openapi.yaml before touching route files
- `pnpm --filter @workspace/db run push` must be run before the API server starts if schema changed

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
