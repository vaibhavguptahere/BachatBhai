# BaChatBhai

- Using NextJS as the main tool of building.
- Using Shadcn components for prebuilded components.
- Using Luicide icons to add the icons in the web app.
- USing Clerk for the authentication
- Using Optional App Routes to make own route for clerk authentication sign-in and sign-up.
- Using Postgress SQL as a database.
- Using Prisma (like mongoose for no sql) to create the schema and all.
- Using Supabase instead of firebase for sql database to create and view of the table.
- Using ArcJet for extra security in the web app.
- USing Inngest Cloud will be used to send the mails without creating any structure for backend and all.

# Working with Postgress SQL Using Prisma and Supabase

- Run this command to initialize the prisma
```bash
 npm i -D prisma
```

- Now this command to create the prisma/schema.prisma
```bash
npx prisma init
```

- Then after adding the prisma.js (creating table)
```bash
npx prisma migrate dev --name create_models
```