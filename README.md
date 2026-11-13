# AtlasEveryday

**Germany · Deutschland** — public website name. The existing `nikunjsb/Finbridge` repository, tester URL, browser-storage keys and service endpoints are retained for continuity.

**Your guide to life in Germany** — practical information about arriving, working, managing money, residence/citizenship, healthcare-profession recognition, and decisions between Germany and India.

**Live public beta:** https://nikunjsb.github.io/Finbridge/

## Current status
AtlasEveryday is a publicly accessible beta, hosted on GitHub Pages. It includes an interactive home page, guide search, arrival/departure journeys, salary and tax class calculators, budget and expense planning, healthcare recognition, immigration guidance and contextual AtlasEveryday AI powered by a separate Cloudflare Worker. These are educational tools, not individualized legal, tax or medical advice.

## Homepage and topic guides
The homepage brings a featured arrival guide, three reviewed news updates, four life stages, six topic hubs, practical tools and editorial guide recommendations together. The hubs cover moving, living, work and money, study and family, Germany–India decisions, and calculators/checklists. Each hub links existing explanations, suggested next steps, relevant tools and official starting points.

`portal.js` owns this presentation and navigation. The existing article library, calculators, checklist storage and separate services continue to supply the underlying features. News headlines use the existing reviewed news collection and link to the relevant item on the updates page. Search includes the topic hubs. Illustrations are inline SVG; no additional third-party scripts or tracking are needed for the portal.

## Investment and savings planner
`investment-core.js` models initial/monthly contributions, fixed year-end top-ups, annual changes to monthly deposits, beginning/end timing, ongoing balance fees, percentage charges on contributions, inflation, three growth assumptions and a savings-goal calculation. Optional EUR/INR conversion uses a visitor-entered goal-date quote. `investment-planner.js` provides the chart, yearly figures, CSV export, investment-type explainers and explicit browser-local saving for inputs and up to three comparisons.

The new model uses **effective annual growth**, converted to monthly factors, and separately compounded fee and inflation factors. It replaces the old four-input UI; the earlier `investmentProjection` helper and its historical nominal-rate checks remain available to existing consumers. The new planner is before tax and does not model varying market paths, withdrawals, pensions, property financing or cross-currency contributions. It has no live market/FX feed and does not assign product-specific returns. Its sources, assumptions and limits are visible in the page.

The current local suite has **91 passing checks**, including **27 investment checks** using independent closed-form/manual reference cases, input validation and safe CSV/rendering examples. Broader browser and operational audits retain their separate scope.

## Run locally
Serve the repository as a static HTTP site (e.g. `python -m http.server 8000`), then open the local URL. JavaScript module imports may not work properly when `index.html` is opened with `file://`. No application build command is required.

## Privacy and integrations
- Finance and planning entries are stored in your browser using localStorage; export a backup before switching devices, browsers or domains. They are not automatically uploaded to AtlasEveryday.
- The contextual AI assistant sends the question, selected topic and a small number of previous chat turns to Cloudflare Workers AI **only when submitted**; avoid submitting private or sensitive information. AtlasEveryday does not save AI transcripts to D1.
- Other separate services include feedback and a limited location trial. The website also loads Cloudflare Web Analytics. See the in-app Privacy page for details and limitations.
- `insights-worker/` is configured as a separate, opt-in-only category analytics pilot. Its endpoint is set; each visitor's analytics choice remains off by default. Events contain only allowlisted source/topic/outcome values. See `insights-worker/README.md` for verification limits.
- Public code must never contain API credentials, secret tokens or personally identifiable visitor data.

## Product planning and tracking
- [P0–P11 roadmap](ROADMAP.md)
- [Pending work and release plan](RELEASE_PLAN.md)
- [Selected-task checklist](PENDING_TASKS.md)
- [Issues and improvement backlog](https://github.com/nikunjsb/Finbridge/issues)
- Scheduled public-site release QA and content-gap reviews help identify issues; they do not replace live interactive browser testing.
- The daily Release QA report also reviews the separate private feedback repository through 19 December 2026. The older standalone feedback task stays paused to fit the five-active-task limit. Private feedback must not be copied into public issues or commits.

## Hosting and deployment
The production beta runs on **GitHub Pages**. It is a static site; the AI, location, feedback and insights endpoints are independent Cloudflare Workers. Domain/hosting work is deferred until **22 November 2026**, with the existing tester link preserved. A later custom-domain move requires reviewing Worker origins and providing a way for users to export their browser-only records.

Before creating or pushing a release commit, read the current `main` head and its Pages workflow. Proceed only after the previous head has a successful deployment and no Pages deployment is queued or in progress. Combine related edits into one tested release; wait for its deployment before another commit. Recheck the branch head immediately before writing so concurrent work is preserved.

## Tax preparation release
The tax preparation planner (`#taxplan/finder`) includes a guided opportunity screen, insurance/pension review, ordinary donation and childcare checks, family/student/part-year paths, Germany–India scenarios, a manually entered transfer-quote comparison, and an adviser TXT/CSV/print pack. The expanded residence screen uses Indian current/prior-year tests and distinguishes the 1961/2025 Acts. Personal amounts and evidence references stay in the existing local backup controls.

The 2026 tariff illustration requires taxable income and a verified extra deduction; unsupported/uncertain cases are referred for review. It excludes special tariffs, progression/foreign income, credits, benefits, church tax, solidarity surcharge and refunds. The insurance review deliberately does not treat spending as a deductible amount.

Run `node tools/version-assets.mjs` after changing local JS/CSS and before committing; it versions all imported local modules and the top-level assets from their contents. `node tools/version-assets.mjs --check` must pass. The footer describes the shipped HTML/app build rather than querying a potentially newer GitHub head.

Calculation references and verification limits are in [the 13 November review](REVIEWS/2026-11-13-tax-planning.md). Full mobile/accessibility/performance and authenticated Cloudflare checks are scheduled for the Sunday 15 November QA task.

## Money and paperwork review
The overview's muted sage, sand, blue and rose palette is shared by inner-page cards, icons, labels, category selections and focus outlines through `page-accents.js`. Topic/route accents are presentation only; calculator logic, saved records and completion/warning states retain their existing behavior. Overview and topic layouts keep their original styling. Release status is recorded in the selected-task checklist.

The money check offers sixteen locally saved document checks and the next three actions. It links the payslip explainer, tax preparation, family support, second-household evidence, insurance and departure guides. Checklist answers and evidence flags use the existing browser-only backup and clear-data controls; documents are not uploaded.

Run the focused checks with `node --test tests/money-guidance.test.mjs`. Editorial decisions and primary sources for this addition are recorded in [the 12 November content review](REVIEWS/2026-11-12-money-guidance.md).

## Service and privacy checks
Run all checks with `node --test tests/*.test.mjs` using Node with built-in `node:sqlite` support (verified with Node 24.22.1). The suite uses in-memory SQLite and mocked external calls; it does not submit real feedback or modify Cloudflare data. It covers consent, accepted payloads, aggregation, retention boundaries, deletion and failed feedback storage.

Read-only owner SQL reports are available at [Insights reports](insights-worker/report.sql) and [location reports](location-worker/report.sql). Run them in the appropriate authenticated D1 console. The private dashboard remains planned. See [operations verification](REVIEWS/2026-11-12-operations.md) for what was checked and what still needs live verification.

## Disclaimer
AtlasEveryday provides general educational information and estimated calculations, not personal tax, immigration, legal, financial or medical advice. Verify current official rules and sources before acting. No tax filing or investment transactions are performed.

## Contributing
Open a GitHub issue to report a bug or missing content. Share relevant source links and reproduction steps, not personal details, salary records, passwords, account identifiers or private AI transcripts.
