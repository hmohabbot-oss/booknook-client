# BookNook

BookNook is a community library for discovering books, sharing personal copies, borrowing, and returning books.

- Live website: add the deployed URL after deployment.
- Client repository: https://github.com/hmohabbot-oss/booknook-client
- Server repository: https://github.com/hmohabbot-oss/booknook-server

## Features

- Email/password accounts with BetterAuth and Google sign-in when OAuth credentials are configured.
- A Swiper home banner, latest arrivals, and responsive book catalogue.
- Book creation, editing, and deletion with owner checks on the API.
- Borrow and return tracking with atomic copy counts and duplicate-loan protection.
- ImgBB cover uploads, clear toast feedback, and custom empty, loading, and not-found states.
- A responsive reader profile and consistent vintage library theme.

## Local setup

1. Install dependencies in both `booknook-client` and `booknook-server` with `npm install`.
2. Copy each `.env.example` to `.env.local` in the client and `.env` in the server.
3. Set the same `JWT_SECRET` in both files. Set a separate `BETTER_AUTH_SECRET` in the client, a valid MongoDB URI in both, and an ImgBB API key in the client environment.
4. For Google sign-in, configure a Google OAuth web client and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the client environment. Add the BetterAuth callback URL shown by the configured deployment to the Google OAuth client.
5. Start the API with `npm run dev` in `booknook-server`, then start Next.js with `npm run dev` in `booknook-client`.

Keep `.env`, `.env.local`, and all real credentials out of Git. Before publishing, rotate any MongoDB credential that has ever been committed or pasted into source code, set the production app/API origins in both environments, and replace the live-site line above with the deployed URL.
