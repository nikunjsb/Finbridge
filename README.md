# FinBridge

**Your guide to life in Germany** — practical information about arriving, working, managing money, residence/citizenship, healthcare-profession recognition, and decisions between Germany and India.

**Live public beta:** https://nikunjsb.github.io/Finbridge/

## Current status
FinBridge is a publicly accessible beta, hosted on GitHub Pages. It includes an interactive home page, guide search, arrival/departure journeys, salary and tax class calculators, budget and expense planning, healthcare recognition, immigration guidance and contextual FinBridge AI powered by a separate Cloudflare Worker. These are educational tools, not individualized legal, tax or medical advice.

## Run locally
Serve the repository as a static HTTP site (e.g. `python -m http.server 8000`), then open the local URL. JavaScript module imports may not work properly when `index.html` is opened with `file://`. No application build command is required.

## Privacy and integrations
- Finance and planning entries are stored in your browser using localStorage; export a backup before switching devices, browsers or domains. They are not automatically uploaded to FinBridge.
- The contextual AI assistant sends the question, selected topic and a small number of previous chat turns to Cloudflare Workers AI **only when submitted**; avoid submitting private or sensitive information. FinBridge does not save AI transcripts to D1.
- Other separate services include feedback and a limited location trial. The website also loads Cloudflare Web Analytics. See the in-app Privacy page for details and limitations.
- `insights-worker/` is an **inactive**, opt-in-only anonymous category analytics pilot. Its endpoint is blank by default; no new search/chat analytics is collected while disabled. See `insights-worker/README.md`.
- Public code must never contain API credentials, secret tokens or personally identifiable visitor data.

## Product planning and tracking
- [P0–P10 roadmap](ROADMAP.md)
- [Issues and improvement backlog](https://github.com/nikunjsb/Finbridge/issues)
- Scheduled public-site release QA and content-gap reviews help identify issues; they do not replace live interactive browser testing.

## Hosting and deployment
The production beta runs on **GitHub Pages**, not Cloudflare Pages. It is a static site; the AI, location, feedback and future insights endpoints are independent Cloudflare Workers. A later custom domain or hosting move requires updating allowed origins in Workers and warning users that localStorage does not migrate across domains.

Before creating or pushing a release commit, read the current `main` head and its Pages workflow. Proceed only after the previous head has a successful deployment and no Pages deployment is queued or in progress. Combine related edits into one tested release; wait for its deployment before another commit. Recheck the branch head immediately before writing so concurrent work is preserved.

## Money and paperwork review
The money check offers sixteen locally saved document checks and the next three actions. It links the payslip explainer, tax preparation, family support, second-household evidence, insurance and departure guides. Checklist answers and evidence flags use the existing browser-only backup and clear-data controls; documents are not uploaded.

Run the focused checks with `node --test tests/money-guidance.test.mjs`. Editorial decisions and primary sources for this addition are recorded in [the 12 November content review](REVIEWS/2026-11-12-money-guidance.md).

## Disclaimer
FinBridge provides general educational information and estimated calculations, not personal tax, immigration, legal, financial or medical advice. Verify current official rules and sources before acting. No tax filing or investment transactions are performed.

## Contributing
Open a GitHub issue to report a bug or missing content. Share relevant source links and reproduction steps, not personal details, salary records, passwords, account identifiers or private AI transcripts.
