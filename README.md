# Meridian — Study Abroad OS

Education agency management platform for managing students, applications, universities, courses, and countries.

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend (Admin)**: Next.js 16, React 19, Tailwind CSS v4
- **Frontend (Student)**: Next.js (placeholder)
- **API**: NestJS (placeholder)
- **Database**: PostgreSQL 16 (Docker)
- **Shared Packages**: `@meridian/types`, `@meridian/ui`, `@meridian/typescript-config`

## Project Structure

```
apps/
  admin/          → Admin dashboard (Next.js)
  student/        → Student portal (Next.js, placeholder)
  api/            → Backend API (NestJS, placeholder)
packages/
  types/          → Shared TypeScript types (Student, Application, University, etc.)
  ui/             → Shared UI utilities (cn helper, global styles, design tokens)
  typescript-config/ → Shared tsconfig presets
```

## Admin Dashboard Pages

| Route            | Description                                                        |
|------------------|--------------------------------------------------------------------|
| `/`              | Dashboard with KPI cards, charts, pipeline, activity, tasks        |
| `/students`      | Searchable/filterable student table with status chips               |
| `/applications`  | Kanban board + table view toggle with stage columns                |
| `/universities`  | Split layout — searchable list + tabbed detail (Overview, Courses, Requirements, Scholarships, Intakes) |
| `/courses`       | Spreadsheet-style course editor with university/field selectors    |
| `/countries`     | Card grid with gradient banners, stats per destination market      |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker compose up -d

# Run admin dashboard
pnpm dev --filter=@meridian/admin

# Build
pnpm build
```

## Design

- Custom design tokens defined in `packages/ui/src/globals.css`
- Geist font family
- UI follows a reference mockup with sidebar navigation, top search bar, and content area
- Icons via `lucide-react`
