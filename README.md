# Interview-ready Next.js starter

This is a small Pages Router app with a complete, easy-to-explain vertical slice:

- TypeScript with strict checking
- `pages/api/tasks.ts`: a typed `GET`/`POST` API route
- Zod request validation
- SQLite via portable `sql.js` (database is created at `data/app.db`)
- Vitest repository test using an in-memory SQLite database

## Commands

```bash
npm install
npm run dev          # start the app
npm test             # run tests once
npm run test:watch   # run tests while editing
npm run typecheck    # strict TypeScript check
npm run build        # production build
```

The database file is intentionally local and should not be committed. For an
interview task, the next natural steps are adding `PATCH`/`DELETE`, a second
table, authentication, or moving the repository behind a service layer.
