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
- Validate signup with the shared Zod schema on both sides and insert via server-only `@supabase/supabase-js` in a `.server.ts` helper reading `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY` inside the call, relying on insert-only RLS, so contact data never touches browser code.
- Build targets Vercel via `nitro: { preset: "vercel" }` only when `VERCEL` is set, so Lovable builds keep their pinned default target.
- The app uses Supabase only for server-side database inserts; keep `src/start.ts` free of Supabase auth middleware.
- `.npmrc` sets `legacy-peer-deps=true` because npm 10 crashes resolving optional peer dependencies in this tree; keep it until npm or the plugins fix it.