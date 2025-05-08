<h1>Nexable</h1>
Next.js site with client-side editable content.<br><br>

![Login screen](public/login.png)

## Getting Started

1. Clone the repo
2. Create a local env file with your API keys `.env.local`
3. Install the project's dependencies `npm install`
4. Run the dev server `npm run dev`

Your site will be running at <http://localhost:3000>

## Tech Stack

- Next.js v15 app router
- Tailwind v3
- Neon db
- Vercel Blob

## Future Ideas

- [ ] Add database table with fields for page creation (e.g. title, slug, content)
- [ ] Create API Route to handle page creation, editing, and deletion
- [ ] Add UI components to admin dashboard for users to create, edit, and delete pages
- [ ] Dynamic Page Routing for New Pages `/[slug]`
- [ ] Fetch created pages from the database and render them dynamically
- [ ] Add Rich Text Editor for Page Content
