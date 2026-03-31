##IMPORTANT : AFTER EVERY NEW ADDED FEATURE PUSH IT TO THE ONLINE GITHUB REPO
# Project Overview

This is a Next.js 14+ full-stack application focused on exceptional UI/UX and modern web standards.

**Primary Goal**: Build beautiful, performant web applications with distinctive design that avoids generic AI aesthetics.

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Context + Zustand for complex state
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes / Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js v5
- **File Upload**: Uploadthing
- **Email**: Resend

### DevOps
- **Hosting**: Vercel
- **Database**: Vercel Postgres / Supabase
- **Monitoring**: Vercel Analytics
- **CI/CD**: GitHub Actions

## Design Philosophy

**CRITICAL**: This project prioritizes distinctive, beautiful UI. Avoid all generic AI design patterns.

### Aesthetic Direction
- **Never use**: Inter, Roboto, Arial fonts
- **Never use**: Purple gradients on white backgrounds
- **Never use**: Generic card layouts with rounded corners everywhere

### Instead, embrace:
- **Bold typography**: Choose unexpected, characterful font pairings (e.g., Space Grotesk + Sentient, Clash Display + Inter Tight, Syne + DM Sans)
- **Distinctive colors**: Commit to a cohesive theme with dominant colors and sharp accents
- **Atmospheric backgrounds**: Layered gradients, geometric patterns, contextual effects - never plain white/gray
- **Intentional motion**: Staggered reveals on page load, scroll-triggered animations, delightful hover states
- **Asymmetric layouts**: Break the grid, use overlapping elements, create visual hierarchy

### Design Quality Checklist
Before completing any UI component, ensure:
- [ ] Uses distinctive, non-generic fonts
- [ ] Has cohesive color palette with CSS variables
- [ ] Includes meaningful animations (not just for decoration)
- [ ] Creates visual depth (shadows, gradients, layering)
- [ ] Breaks from predictable layouts
- [ ] Feels designed for THIS specific use case

## Project Structure
```
├── app/
│   ├── (auth)/              # Auth-related pages
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── forms/               # Form components
│   ├── layouts/             # Layout components
│   └── shared/              # Reusable components
├── lib/
│   ├── db.ts                # Prisma client
│   ├── auth.ts              # Auth config
│   ├── validations/         # Zod schemas
│   └── utils.ts             # Utility functions
├── hooks/                   # Custom React hooks
├── styles/
│   └── globals.css          # Global styles + Tailwind
├── public/                  # Static assets
└── prisma/
    └── schema.prisma        # Database schema
```

## Development Commands
```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run dev:turbo        # Start with Turbopack

# Building
npm run build            # Production build
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema changes
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format with Prettier
npm run type-check       # Run TypeScript checks

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:e2e         # E2E tests with Playwright
```

## Component Development Standards

### Server Components by Default
- Use Server Components unless you need client-side interactivity
- Only add `"use client"` when necessary (state, effects, event handlers)
- Fetch data directly in Server Components

### Client Components
- Always start with `"use client"` directive
- Use TypeScript interfaces for all props
- Keep components focused (single responsibility)

### Component Template
```typescript
"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface ComponentNameProps {
  title: string
  onAction?: () => void
}

export function ComponentName({ title, onAction }: ComponentNameProps) {
  const [state, setState] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="custom-styles"
    >
      {/* Component content */}
    </motion.div>
  )
}
```

## Styling Guidelines

### Tailwind Usage
- Use Tailwind utility classes for 90% of styling
- Extract repeated patterns into components
- Use @apply sparingly in CSS files
- Leverage CSS variables for theme colors

### Color System
```css
/* Define in globals.css */
:root {
  --primary: 210 100% 50%;
  --secondary: 280 90% 60%;
  --accent: 45 100% 55%;
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
}

.dark {
  --background: 222 47% 11%;
  --foreground: 0 0% 100%;
}
```

### shadcn/ui Integration
- Use shadcn/ui components as base
- Customize heavily - don't accept defaults
- Override styles to match unique aesthetic
- Example: `npx shadcn@latest add button dialog`

## API Route Patterns

### Using Server Actions (Preferred)
```typescript
"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string
  
  await db.post.create({
    data: { title }
  })
  
  revalidatePath("/posts")
}
```

### Using Route Handlers
```typescript
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const posts = await db.post.findMany()
  return NextResponse.json(posts)
}
```

## Performance Standards

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Lighthouse Score**: > 90

### Optimization Checklist
- [ ] Image optimization with next/image
- [ ] Dynamic imports for heavy components
- [ ] Route-based code splitting
- [ ] Lazy load below-fold content
- [ ] Minimize layout shift with placeholders
- [ ] Use Suspense boundaries strategically

## Database Conventions

### Prisma Schema Patterns
- Use `camelCase` for field names
- Use `PascalCase` for model names
- Always include `createdAt` and `updatedAt`
- Use relations properly with `@relation`

### Example Model
```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  content     String?
  published   Boolean  @default(false)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Authentication Patterns

- Use NextAuth.js v5 with credentials provider
- Implement proper session management
- Protected routes via middleware
- Server-side auth checks in Server Components

## Error Handling

- Use error.tsx for route-level error boundaries
- Use loading.tsx for loading states
- Show user-friendly error messages
- Log errors to monitoring service

## Accessibility Requirements

- Minimum WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- ARIA labels where semantic HTML insufficient
- Color contrast ratio ≥ 4.5:1
- Focus indicators on all interactive elements
- Screen reader tested for critical flows

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Refactoring
- `docs/description` - Documentation

### Commit Messages
- Use conventional commits format
- Examples: `feat: add user dashboard`, `fix: resolve login redirect`

## Testing Strategy

- Unit tests for utilities and hooks
- Component tests for UI components
- E2E tests for critical user flows
- Aim for 80%+ coverage on business logic

## Important Gotchas

1. **Server Components**: Can't use hooks or browser APIs
2. **Client Components**: Increase bundle size - use sparingly
3. **Dynamic Routes**: Use proper TypeScript typing for params
4. **Environment Variables**: Must prefix with `NEXT_PUBLIC_` for client access
5. **Image Optimization**: Always use next/image, never <img>
6. **Metadata**: Use generateMetadata for dynamic SEO
7. **Font Loading**: Use next/font to prevent layout shift

## When Building Features

1. **Plan the aesthetic** - Choose bold direction (brutalist? soft? editorial?)
2. **Server Component first** - Only add "use client" when needed
3. **TypeScript everything** - No implicit any
4. **Mobile first** - Design for mobile, enhance for desktop
5. **Animate intentionally** - Page loads, state changes, micro-interactions
6. **Test accessibility** - Keyboard nav, screen readers
7. **Optimize images** - WebP, proper sizing, lazy loading
8. **Performance check** - Run Lighthouse before marking complete

## AI Assistant Instructions

When I ask you to build a feature:
1. **Ask about aesthetic direction** if not specified
2. **Use the frontend-design skill** for all UI work
3. **Create Server Components by default**
4. **Use TypeScript strictly** - no shortcuts
5. **Implement animations** - make it feel alive
6. **Follow shadcn/ui patterns** but customize heavily
7. **Test the component** before considering it done
8. **Optimize for performance** from the start

When generating UI, avoid these patterns at all costs:
- Inter/Roboto/Arial fonts
- Purple gradients on white
- Generic rounded card layouts
- Centered everything
- No animations
- Plain backgrounds
- Cookie-cutter designs

Remember: We're building something that looks and feels professionally designed, not AI-generated.
```

## Step 3: Set Up Hooks (Auto-formatting)

After creating CLAUDE.md, tell Claude:
```
Add a post-edit hook that runs Prettier and ESLint --fix after every file modification
```

## Step 4: Create Useful Slash Commands

Tell Claude to create these commands:
```
# Create /page command
Create a slash command called /page that:
1. Takes a route name as argument
2. Scaffolds a new page in app/(routes)/[route]/page.tsx
3. Includes loading.tsx and error.tsx
4. Uses our design standards from CLAUDE.md

# Create /component command  
Create a slash command called /component that:
1. Takes component name and type (client/server) as arguments
2. Creates component file in components/ with proper structure
3. Includes TypeScript interface
4. Adds test file
5. Uses our aesthetic standards

# Create /api command
Create a slash command called /api that:
1. Takes endpoint name
2. Creates route handler in app/api/
3. Includes proper TypeScript types
4. Adds validation with Zod

##IMPORTANT : AFTER EVERY NEW ADDED FEATURE PUSH IT TO THE ONLINE GITHUB REPO