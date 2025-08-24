# Next Finance Record - AI Agent Instructions

# GitHub Copilot Commit Message Instructions

- Gunakan format **Conventional Commits**:
  - feat: untuk fitur baru
  - fix: untuk perbaikan bug
  - refactor: untuk perubahan struktur kode tanpa mengubah perilaku
  - style: untuk perubahan tampilan atau format kode
  - docs: untuk perubahan dokumentasi
- Tulis dalam bahasa Inggris singkat dan jelas.
- Maksimal 72 karakter di baris pertama.
- Tambahkan deskripsi detail di baris berikutnya jika perlu.
- Hindari kata-kata umum seperti "update" atau "change" tanpa konteks.

## Project Overview

Next Finance Record is a full-stack Next.js application for personal finance management. It uses App Router, Supabase for authentication/database, and follows a feature-based architecture.

## Key Architecture Patterns

### 1. Directory Structure

- `src/app/` - Next.js App Router pages using the new file-system based routing
  - `(auth)/` - Authentication routes (login, register, password reset)
  - `(dashboard)/` - Protected dashboard routes
- `src/components/` - React components organized by feature
  - `auth-component/` - Authentication UI components
  - `dashboard/` - Dashboard feature components
  - `ui/` - Reusable UI components using shadcn/ui
- `src/services/` - API service layer for data operations
- `src/validation/schemas/` - Zod validation schemas
- `src/utils/supabase/` - Supabase client configuration and middleware

### 2. Authentication Flow

- Uses Supabase Auth with email/password
- Authentication state managed via `useAuth` hook (`src/hooks/use-auth.ts`)
- Protected routes handled by auth middleware (`src/utils/supabase/middleware.ts`)
- Public paths: '/', '/login', '/register', '/forgot-password', '/update-password', '/confirm'

### 3. Form Handling Pattern

Example in `src/components/auth-component/update-password/update-password-form.tsx`:

```typescript
const form = useForm<z.infer<typeof updatePasswordSchema>>({
  resolver: zodResolver(updatePasswordSchema),
  defaultValues: { ... }
})
```

- Uses React Hook Form with Zod validation
- Separate validation schemas in `src/validation/schemas/`
- Split form components into field-level components for reusability

### 4. State Management

- Authentication state: Supabase + `useAuth` hook
- Form state: React Hook Form
- UI state: React state + context where needed
- Persistent state: LocalStorage for user preferences

### 5. Component Organization

- Feature-based structure (auth, dashboard, etc.)
- Shared UI components in `src/components/ui/`
- Page-specific components co-located with routes
- Common layouts in `src/app/**/layout.tsx`

## Development Workflows

### Environment Setup

1. Create `.env.local` with Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Running the Project

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

### Working with Supabase

- Authentication handled through `@supabase/auth-helpers-nextjs`
- Database types in `src/types/databases/database.types.ts`
- Update types after schema changes: `supabase gen types typescript --project-id your-project-id`

## Common Patterns

### Error Handling

- Form errors: React Hook Form + Zod validation
- API errors: Toast notifications via Sonner
- Auth errors: Redirect to error page with message

### Navigation & Routes

- Use App Router conventions
- Protected routes under `(dashboard)`
- Auth routes under `(auth)`
- Client-side navigation with `useRouter`

### Component Props

- Use TypeScript interfaces for props
- Follow naming convention: `ComponentNameProps`
- Use `React.ComponentPropsWithoutRef` for HTML element props

### Styling

- Tailwind CSS for styling
- shadcn/ui components as base
- Custom components extend shadcn/ui patterns
- Use `cn()` utility for class merging

## Key Files

- `src/utils/supabase/middleware.ts` - Auth protection logic
- `src/hooks/use-auth.ts` - Authentication state management
- `src/app/layout.tsx` - Root layout and providers
- `src/components/ui/` - Base UI component library
