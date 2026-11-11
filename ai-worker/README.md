# FinBridge contextual AI assistant (optional deployment)

This is a separate Worker named `finbridge-ai`. It must not replace `finbridge-location-trial` or the feedback Worker.

## Configure and deploy

1. In Cloudflare **Workers & Pages**, create a **new Worker** named `finbridge-ai`.
2. Copy `ai-worker/src/index.js` into the Worker's code editor and deploy.
3. Open the new Worker's **Bindings** tab and add **Workers AI** with binding name exactly `AI`.
4. Add a **Rate Limiting** binding named `RATE_LIMITER`. Set 10 requests per 60 seconds and a free namespace ID not used elsewhere (the Wrangler file uses `3127`; if the UI requires a different available namespace ID, use that).
5. Deploy again after adding both bindings, and check the Worker logs for configuration errors.
6. Copy the new Worker public URL (typically `https://finbridge-ai.<your-subdomain>.workers.dev/`) to `ai-config.js` as the `finbridgeAiEndpoint` string. Never paste API keys or service tokens into public website files.
7. Refresh GitHub Pages with Ctrl+Shift+R. Open `#immigration`, `#salary` or `#budget`, expand **Ask FinBridge AI**, and submit a general test question.

**Only after you deploy the new Worker and add its real endpoint will AI answers work.** Until then the frontend intentionally shows “AI assistant setup pending”, not a fake answer.

## Privacy and usage

- The browser sends only the manually entered question, topic tag and up to 4 recent chat messages to the new Worker.
- It does **not** automatically upload your local salary inputs, expense records, savings, personal location or local backups.
- The Worker doesn't store chat questions, response history, IP addresses, names or cookies in D1/GitHub. Cloudflare may process request metadata and operate platform logs under its terms.
- Chat text is held temporarily in browser JavaScript memory and cleared on reload.
- The Worker uses the official-source guidance embedded by topic. Those sources are **verification links**, not proof that an AI answer was independently checked against live law.
- Use within the applicable Cloudflare Workers AI model usage quota. A rate-limit binding helps reduce abuse but isn't a strict global budget cap; monitor AI usage and set platform spending limits as available.

## Cost and model

Cloudflare Workers AI model: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`. See the Cloudflare official model catalog and billing pages for current availability and prices. Models and costs change. Do not use older deprecated 8B models without checking their support status.

## Troubleshooting

- HTTP 403: call must originate from `https://nikunjsb.github.io` (the published FinBridge site).
- HTTP 503 not_configured: verify both the `AI` and `RATE_LIMITER` bindings.
- HTTP 429: the rate limit was exceeded; retry later.
- A “setup pending” banner means the public frontend endpoint hasn't been filled in.

The app is informational, not a qualified immigration, financial or tax adviser. The assistant should not be allowed to make official eligibility decisions.
