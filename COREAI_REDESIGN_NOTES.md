# CoreAI UI redesign notes

## What changed
- Added a scoped `coreai-redesign-shell` visual layer to the authenticated chat workspace.
- Refined the sidebar, search, navigation, history rows and account area using scoped styles.
- Refined the top conversation toolbar.
- Improved the welcome/empty-state heading, quick actions and feature-card presentation.
- Improved the composer surface, suggestion chips, usage label and responsive spacing.
- Refined user and assistant message surfaces.
- Applied a shared visual treatment to the existing Image Studio, Explore AI and Settings surfaces.
- Added small-screen adjustments and reduced-motion support.

## Functionality preservation
The work is limited to presentation hooks (CSS classes and scoped CSS). Existing React handlers, routes, hooks, Supabase calls, authentication, message state, AI model logic, file upload logic, voice recorder, image gallery operations, settings persistence and chat data structures were not intentionally changed.

## Run locally
1. Copy `.env.example` to `.env`.
2. Fill in the same Supabase environment values used by your current deployment.
3. Run `npm ci`.
4. Run `npm run dev`.
5. Run `npm run build` and `npm run lint`.

The original `.env` file is intentionally excluded from the delivery archive to avoid sharing credentials.
