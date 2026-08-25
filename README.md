# Edutainer

Edutainer is an educational video library built with Next.js, TypeScript, and Tailwind CSS. Users can browse and search lessons, control playback, add video links, and discuss lessons.

## Local setup

Install dependencies:

```bash
bun install
```

Replace .env values as needed.

```env
NEXT_PUBLIC_SCOPE_API_BASE_URL=https://take-home-assessment-423502.uc.r.appspot.com
SCOPE_USER_ID=firstname_lastname
```

Start the development server:

```bash
bun dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Architecture

- Server Components fetch videos and comments directly from the configured API.
- Client Components post video and comment mutations directly to the supplied API.
- Client Components also manage interactive playback, library navigation, and searching.
- Shared UI primitives provide consistent buttons, cards, and form controls.

## Checks

```bash
bun run lint
bun run typecheck
bun run build
```
