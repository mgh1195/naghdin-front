# Project Details Page — Routing & Skeleton (Step 1)

## Goal

Add a new `/projects/:id` route that navigates from the landing page's project cards to a Project Details page, passing the project ID via URL params.

## Changes

### 1. `src/main.tsx`
- Wrap `<App />` with `<BrowserRouter>` from `react-router-dom`.

### 2. `src/App.tsx`
- Replace flat rendering of landing page sections with route definitions using `<Routes>`.
- Route `/` → landing page (Hero, SummaryStats, Opportunities, Footer).
- Route `/projects/:id` → new `<ProjectDetails />` component.
- `<Navbar />` stays above `<Routes>` so it's shared across all routes.
- `<CartProvider>` stays as outermost wrapper.

### 3. `src/components/ProjectDetails.tsx` (new)
- Reads `id` param via `useParams()`.
- Looks up project data via `getOpportunityById(id)` from `@/data/opportunities`.
- If project not found, renders a 404-style fallback.
- For now (Step 1): shows the project title, a back link to `/`, and placeholder text. Uses existing theme classes (text-foreground, text-muted-foreground, bg-background, etc.).

### 4. `src/components/OpportunityCard.tsx`
- Replace `<a href="#">` with `<Link to={/projects/${item.id}}>` from `react-router-dom`.
- Button text and styling remain unchanged.
- `<ArrowLeft>` icon stays.

## Non-Changes

- No existing component is refactored or restyled beyond the Link substitution.
- `OpportunityCard`'s props, data flow, and inner layout are untouched.
- No new styles are introduced — everything uses existing theme tokens.
