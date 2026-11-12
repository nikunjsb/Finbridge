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
- `insights-worker/` is configured as a separate, opt-in-only category analytics pilot. Its endpoint is set; each visitor's analytics choice remains off by default. Events contain only allowlisted source/topic/outcome values. See `insights-worker/README.md` for verification limits.
- Public code must never contain API credentials, secret tokens or personally identifiable visitor data.

## Product planning and tracking
- [P0–P11 roadmap](ROADMAP.md)
- [Issues and improvement backlog](https://github.com/nikunjsb/Finbridge/issues)
- Scheduled public-site release QA and content-gap reviews help identify issues; they do not replace live interactive browser testing.
- The daily Release QA report also reviews the separate private feedback repository through 19 December 2026. The older standalone feedback task stays paused to fit the five-active-task limit. Private feedback must not be copied into public issues or commits.

## Hosting and deployment
The production beta runs on **GitHub Pages**. It is a static site; the AI, location, feedback and insights endpoints are independent Cloudflare Workers. Domain/hosting work is deferred until **22 November 2026**, with the existing tester link preserved. A later custom-domain move requires reviewing Worker origins and providing a way for users to export their browser-only records.

Before creating or pushing a release commit, read the current `main` head and its Pages workflow. Proceed only after the previous head has a successful deployment and no Pages deployment is queued or in progress. Combine related edits into one tested release; wait for its deployment before another commit. Recheck the branch head immediately before writing so concurrent work is preserved.

## Money and paperwork review
The money check offers sixteen locally saved document checks and the next three actions. It links the payslip explainer, tax preparation, family support, second-household evidence, insurance and departure guides. Checklist answers and evidence flags use the existing browser-only backup and clear-data controls; documents are not uploaded.

Run the focused checks with `node --test tests/money-guidance.test.mjs`. Editorial decisions and primary sources for this addition are recorded in [the 12 November content review](REVIEWS/2026-11-12-money-guidance.md).

## Service and privacy checks
Run all checks with `node --test tests/*.test.mjs` using Node with built-in `node:sqlite` support (verified with Node 24.22.1). The suite uses in-memory SQLite and mocked external calls; it does not submit real feedback or modify Cloudflare data. It covers consent, accepted payloads, aggregation, retention boundaries, deletion and failed feedback storage.

Read-only owner SQL reports are available at [Insights reports](insights-worker/report.sql) and [location reports](location-worker/report.sql). Run them in the appropriate authenticated D1 console. The private dashboard remains planned. See [operations verification](REVIEWS/2026-11-12-operations.md) for what was checked and what still needs live verification.

## Disclaimer
FinBridge provides general educational information and estimated calculations, not personal tax, immigration, legal, financial or medical advice. Verify current official rules and sources before acting. No tax filing or investment transactions are performed.

## Contributing
Open a GitHub issue to report a bug or missing content. Share relevant source links and reproduction steps, not personal details, salary records, passwords, account identifiers or private AI transcripts.
