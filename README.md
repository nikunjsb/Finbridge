# FinBridge

A privacy-first personal finance learning and planning web app for life in Germany and across Germany ↔ India.

## Current status
**Early working prototype**, not a hosted production service. It includes an interactive home page, searchable guides, budgeting, a tax expense tracker, cross-border question pathways and local question insights. Tax and legal examples are educational; figures and rules must be checked against official guidance for the applicable year.

## Run
Open `index.html` in a browser. For development, serve the repository using any static HTTP server (e.g. `python -m http.server 8000`). No npm install is required.

## Privacy
Data entered into the tools is saved in browser localStorage. It is **not** synchronized between devices or sent to GitHub. Never enter tax identification numbers, banking credentials, or other secrets. Browser storage can be lost; use the export function to back up data. A later hosted version will have an explicit privacy policy and opt-in server-side functionality.

## Navigation & design
All active navigation items lead to functioning sections. Guidance articles are clearly distinguished from unimplemented future features. The visual design uses high-contrast neutral grays, mobile responsive layouts, and accessible labels.

## Roadmap
1. Refine and verify content, add year-versioned rules and official-source links.
2. Move from static modules to tested React + TypeScript app with predictable routes.
3. Cloudflare Pages deployment; optional invite-only access.
4. Backend service for reviewed rule changes, citation checking and AI question assistance, with explicit user consent.
5. Admin moderation and updates; independent review of high-impact rules.

## Disclaimer
FinBridge provides general educational information, not individual tax, legal, financial or investment advice. No tax filing or investment transactions are performed.

## Contributing
Open a GitHub issue describing the missing feature or incorrect information and supply a source. No secrets or personal financial data in issues.

## Deployment
This static project can be deployed to Cloudflare Pages using a Git integration with no build command and output directory `/`. **No live deployment is configured yet.**
