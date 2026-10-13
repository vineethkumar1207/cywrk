<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public content in distinct TanStack leaf routes and shared presentation in `src/components/cyber` so navigation, metadata and visual behavior remain consistent.
- Keep deterministic research data client-safe and isolated from waitlist storage so the public demo needs no authentication or paid APIs.
- Validate signup with the shared Zod schema on both sides and insert into the dedicated Neon database via the `postgres` package in a `.server.ts` helper using server-only `DATABASE_URL` and parameterized queries, so contact data never touches the client or the app's main backend.
- Build targets Vercel via `nitro: { preset: "vercel" }` only when `VERCEL` is set, so Lovable builds keep their pinned default target.
- The app does not use Supabase auth/client at runtime; keep `src/start.ts` free of Supabase middleware so deploys need only `DATABASE_URL`.
- `.npmrc` sets `legacy-peer-deps=true` because npm 10 crashes resolving optional peer dependencies in this tree; keep it until npm or the plugins fix it.