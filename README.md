# Timebook Monorepo

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This is a TurboRepo mono-repository. https://turbo.build/

We use `pnpm` for this repository instead of `npm`.

You need to install pnpm:

- `brew install pnpm` for MacOS
- `iwr https://get.pnpm.io/install.ps1 -useb | iex` for Windows

Windows users may have trouble with the default installation folder of pnpm:
`copy %LOCALAPPDATA%\pnpm\pnpm.exe %WINDIR%`

Documentation for installing pnpm https://pnpm.io/installation.

# apps & packages

- **apps/web**  
  main nextjs web app with backend routes

- **apps/web-e2e**  
  browser tests build with playwright

- **packages/backend**  
  the GraphQL backend with database build with prisma and pothos

- **packages/pulumi**  
  the infrastructure as code package build with pulumi

- **packages/ui**  
  re-usable UI components

- **packages/tsconfig**  
  central place to store all tsconfigs for all packages that use tsc

# Getting Started

The main application is located in the apps/web folder as next.js typescript application. It can be started from the root folder using:

```bash
pnpm run dev
```

Make sure the app runs on the right port your SSO is configured for, usually port 3000.

## Start the database server

The database server has to be started prior to make the backend work.

```bash
docker-compose up -d
```

This app is developed using prisma.io. You can start the prisma studio to view/modify data by using:

```bash
cd packages/backend
pnpx prisma studio
```

## Migrate the database

This is needed, if the database schema has changed since the last migration run.

```bash
pnpm run migrate-db
```

For more information see [prisma getting started](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## Starting the app

This nextjs app starts react frontend and graphql backend with a single command:

```bash
pnpm run dev
```

For more information how next.js apps are build see [NextJS basics](https://nextjs.org/learn/basics/navigate-between-pages)

# Running the app

- http://localhost:3000 frontend
  ...

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
