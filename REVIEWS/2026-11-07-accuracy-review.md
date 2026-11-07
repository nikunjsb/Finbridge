# FinBridge Accuracy Review — 7 November 2026

This is a targeted first-pass accuracy review, **not** a professional tax or legal approval of all FinBridge content.

## Shipped and source-checked
- **German commuting (2024–2026):** Updated user-facing example. 2026: 30 full one-way km × 150 first-workplace days × €0.38/km = €1,710 preliminary distance allowance. 2025: (20 km × €0.30 + 10 km × €0.38) × 150 = €1,470. No return-leg doubling. Sources: [EStG §9](https://www.gesetze-im-internet.de/estg/__9.html) and [BMF 2026 distance allowance guidance](https://esth.bundesfinanzministerium.de/lsth/2026/B-Anhaenge/Anhang-14/anhang-14.html).
- **Tax entries and labels:** Added tax-year selection to the previously undated Home Office, Work Equipment and other expense entry types. Records now identify the tax year where captured; historic undated records remain undated. Removed one summed "preliminary deductions" number that mixed years and types; changed to a count of separately assessed candidate entries.
- **Tax conceptual difference:** Clarified out-of-pocket spending vs eligible tax deduction vs possible refund; employment expenses, insurance special expenses and maintenance deductions follow distinct rules. Source: [EStG](https://www.gesetze-im-internet.de/estg/).
- **Indian income-tax residency screening:** Clarified that fewer than 182 days does **not** certify non-residence, referenced the standard 60+365 lookback test and specific exceptions, and noted ROR/RNOR are further questions. Source: [Indian Income Tax Department, NR FAQs](https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/non%20resident%20-faq). Years and personal circumstances matter.
- **Indian bank accounts:** Expanded NRE/NRO/FCNR(B) general explanations, including different FEMA residential status from income-tax residential status, redesignation on leaving/returning and temporary visits. Source: [Reserve Bank of India, Accounts in India by Non-residents](https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=3).
- **Feedback privacy disclosure:** Removed obsolete "under setup" language. Explained active Cloudflare Turnstile → Cloudflare Worker → private GitHub Issue flow, data processing and retention limitations. This is a functionality and disclosure update, not legal compliance certification.

## Still requires review — do not mark as verified
- Commute calculator: mixed travel, carpooling, tax-free employer reimbursements, route specifics, case where annual public-transport actual costs exceed distance allowance, partial year, and double-counting across saved entries.
- Home-office eligibility and any overlap or special exceptions; depreciation and deductions for work equipment; insurance caps and tax treatment.
- Abroad-maintenance support: eligibility, support need, recipient's income/assets, mandatory recipient-account payment evidence since 2025 and country group ceilings. See [BMF foreign maintenance guidance, October 2025](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Einkommensteuer/2025-10-15-ausland-hinweise-unterhaltsaufw.html).
- Indian tax residency special cases (citizens/PIOs, deemed residence, income thresholds and lookback/RNOR), Germany–India treaty tie breakers.
- Pension refunds, pensions/social security agreements, Blue Card naturalisation thresholds and other time-sensitive legal pages.
- Germany Impressum and privacy notice: operator, purposes, legal bases, data-retention/deletion contact and Cloudflare/GitHub role review.
- Full calculator testing with realistic scenarios and device/browser accessibility; deployment confirmation.

## Release notes
All existing localStorage user data structures were retained. Old records without year are displayed as "not recorded (older entry)" rather than assigned an invented year. Frontend cache query updated for this release.
