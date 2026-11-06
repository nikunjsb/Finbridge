# FinBridge private feedback backend

This directory contains a **Cloudflare Worker**. Its source can be public, but feedback is stored as issues in a **separate private GitHub repository**.

## One-time setup (repository owner)

1. Create a **private** repository named `finbridge-feedback` under `nikunjsb` and enable GitHub Issues. Do not create it as public.
2. Create a fine-grained GitHub personal access token scoped **only** to `finbridge-feedback`, with **Issues: Read and write** permission. This token is a secret — do not paste it into chats, web source, commits or GitHub Pages.
3. Sign in to Cloudflare and create a Worker using the files in this directory (with [Wrangler](https://developers.cloudflare.com/workers/wrangler/) or the Cloudflare dashboard). Set `GITHUB_REPO=nikunjsb/finbridge-feedback` and `ALLOWED_ORIGIN=https://nikunjsb.github.io`.
4. Set Worker secrets using `npx wrangler secret put GITHUB_TOKEN` and `npx wrangler secret put TURNSTILE_SECRET`.
5. Create a Cloudflare Turnstile widget for `nikunjsb.github.io`; store the **secret key** as `TURNSTILE_SECRET`. The **site key** is public and belongs in the FinBridge frontend. The backend validates every submission server-side.
6. Deploy with `npx wrangler deploy` and note your actual `https://...workers.dev` URL. The endpoint must never be guessed.
7. Configure the FinBridge feedback page with that exact Worker URL and Turnstile **site key** only after testing. Never expose `GITHUB_TOKEN` in frontend code.
8. Submit a test item; confirm a new **private** issue appears in the feedback repository. Test spam check, invalid fields, failures and mobile before enabling the form for visitors.

The Worker accepts JSON POST with `kind`, `area`, `title`, `details`, `benefit`, `consent:true`, and `turnstileToken`. Rate-limiting is set as an additional safeguard; verify availability and quota on your Cloudflare plan. The browser's `Origin` is checked for CORS, but it is not authentication; Turnstile, rate-limiting and scoped GitHub credentials provide abuse controls.

No sensitive user documents or reply email addresses should be collected in GitHub issues. The frontend must disclose that submissions are handled by Cloudflare and GitHub, and explain data retention and deletion before launch. Existing public GitHub Issues review automation **will not** automatically include this private repository; update the review task only after granting access to the private repo.

**Deployment status:** This source code alone does not deploy a Worker, create a private repo or make feedback operational.
