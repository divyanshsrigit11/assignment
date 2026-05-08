# 🚀 Bulk Email Sender - Full Stack Migration

A modern, decoupled email campaign management system migrated from a monolithic architecture to a high-performance SvelteKit 5 and Hono (Bun) stack.

## 🛠️ Tech Stack
- **Frontend**: SvelteKit 5 (Runes), Tailwind CSS 4, Axios, Zod.
- **Backend**: Hono on Bun Runtime, SQLite (Drizzle-ready), Argon2.
- **Protocol**: SMTP via Nodemailer.

## ✅ Objectives Completed
1. **Decoupled Architecture**: Completely separated the frontend from the backend.
2. **Framework Migration**: Migrated legacy UI to SvelteKit 5 using modern Runes ($state, $props, $derived).
3. **Environment Fix**: Resolved dependency conflicts between Hono v3 and v4 to ensure Bun compatibility.
4. **Auth Implementation**: Secured routes with a Layout Guard and session-based authentication via `/auth/me`.
5. **UI/UX Enhancement**: Built a responsive, collapsible sidebar with hardware-accelerated transitions.

## 🏃 Getting Started

### Backend
1. `cd backend`
2. `bun install`
3. `bun src/app.ts` (Runs on Port 3000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on Port 5173)

## 📁 Project Structure
- `/frontend`: Modern Svelte 5 application.
- `/backend`: Decoupled Hono API.