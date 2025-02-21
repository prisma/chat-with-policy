# Chat With Policy

## 0. Setup

1. Clone this repository

1. Run `pnpm install`

## 1. Setup Prisma

1. As usual, you need to get Prisma configured.

1. Get your PPg URL and put it in `.env`.

1. Migrate your database against the schema.

## 2. Define your rules

Go to `policy.ts` and define your rules.

## 3. Deploy your rules

Run `pnpm prisma platform policy deploy ...` to deploy your rules.

To make things simpler, we've created an npm script to deploy the rules.

```sh
pnpm policy:deploy
```

> Check out your `package.json` to see how it's done.

> On the first run it may take a bit of time, because the CLI is downloaded and cached.<br>
> Subsequent runs will be faster, and will only redownload if a new version is available.

## 4. Access your client

The previous step will return a JWT token, that we'll call `<publicKey>`.

Go to `App.tsx` and replace `<publicKey>` with the token you received.

## 5. Execute queries

Run `pnpm dev` to execute your app and start sending queries.
