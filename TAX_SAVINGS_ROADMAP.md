# FinBridge tax-saving workstream

Requested: 12 November 2026. Status: TS01–TS03 and TS05–TS10 preparation features are deployed and live-verified as of 14 November; TS04 remains pending. The plan does not establish eligibility for a tax claim. Hosting/domain work remains deferred until 22 November.

## Build on the existing site

Extend the money check (`#moneycheck`), claim categories (`#taxguide`), expense workspace (`#tax`), double-household worksheet (`#doublehousehold`), family-support guide (`#parentsguide`) and sourced topic articles. The money check, payslip explainer, evidence checklists and arrival/departure-year article already exist. The remaining work is deeper screening, calculations, examples and validation.

## Selected implementation status — 14 November

- [x] TS01 and TS07–TS10: delivered as preparation/review tools on 13 November, with successful Pages deployment and live functional checks. Numerical scope is explicitly bounded; insurance/pension and complex treaty cases receive review rather than automatic eligibility or refund figures.
- [x] TS02, TS03, TS05 and TS06: deeper work-expense, parent-support and household-service worksheets published and live-verified on 14 November for 2025/2026 within their stated scope. All 140 tests pass, including 49 new numerical/boundary checks; [scope, sources and evidence](REVIEWS/2026-11-14-tax-workbenches.md).
- [ ] TS04: relocation/double-household extension remains pending.
- [Owner checklist](PENDING_TASKS.md) preserves the eighteen chat IDs; [release review](REVIEWS/2026-11-13-tax-planning.md) records sources and validation. Wider payroll, legal/source, accessibility and performance coverage remains separately tracked.

## First implementation priorities

| ID | Work to do | Existing area | Completion evidence |
|---|---|---|---|
| TS01 | Guided tax-saving finder: ask about employment/studies, arrival/departure, family, work arrangements and India ties; return relevant opportunities and evidence to review. | Money check + What can I claim? | Employee, student, spouse/family, newcomer and returnee examples reach appropriate existing guides. Results distinguish potentially relevant, needs review and not relevant; no automatic eligibility verdict. |
| TS02 | Improve commuting, home-office and business-travel planning: dated days, one-way distance, transport, reimbursements and overlap checks. | Expense workspace + commuting/home-office guides | Each supported tax year has verified parameters and independent examples. Office, home-working and travel records reconcile without duplicate claims. |
| TS03 | Add work-equipment, phone/internet and professional-training screening: work-use share, reimbursements, purchase dates, immediate deduction/depreciation and course purpose. | Expense workspace + equipment/training guides | Supported, partly supported and personal-use cases are documented. General German learning is assessed separately from profession-specific training. |
| TS04 | Extend relocation and double-household screening: own main household, centre of life, financial participation, eligible accommodation, furniture, actual flights home, first/last travel and meal-period rules. | Existing moving guide + double-household worksheet | India-main-home examples and land/air travel are handled separately. Housing limits do not automatically apply to every expense group; reimbursements and overlap checks are included. |
| TS05 | Build a parent-support preparation and screening tool: recipient need, income/assets, support months, country/year adjustment, payment trail, shared-household allocation and other supporters. | Existing parents guide + ten-step checklist | Verified examples cover one parent, two parents sharing a household, recipient income and incomplete/late-year support. Distinguish Unterhaltserklärung from Anlage Unterhalt. |
| TS06 | Add a Nebenkosten/household-services checker: identify relevant labour items, invoices, bank payments, tax-credit limits and exclusions. | Household-services guide + tax workspace | The interface distinguishes a direct tax reduction from an income deduction, separates labour/materials and checks duplicate use of the same costs. |

## Further planned improvements

| ID | Work to do | What must be covered |
|---|---|---|
| TS07 | Insurance, pension and other special-expense review | Annual insurer/employer certificates, prefilled data, relevant limits, reimbursements, donation certificates and duplicate entries. Assess fees, lock-ins, later taxation and portability before describing a financial product as a tax-saving option. |
| TS08 | Family, student and part-year case paths | Joint/separate annual assessment questions; distinguish tax-class cash flow from annual tax. Review childcare and eligible extraordinary expenses. Separate first/subsequent education and potential loss carryforwards. Check arrival/departure income and voluntary versus mandatory filing deadlines. |
| TS09 | Germany–India tax relief and investment-tax literacy | Review Indian interest, rent, dividends and gains; treaty treatment and qualifying foreign-tax relief. Cover savings allowances, exemption orders, losses and fund-specific rules by year. Account redesignation, transferring money and foreign income are separate questions. |
| TS10 | Receipt preparation, export and transparent tax-effect estimates | Keep tax year, payment date, work-use share, reimbursement and receipt references. Provide an export/printable adviser checklist. Display money spent, candidate eligible amount, additional income deduction/direct credit and estimated tax effect separately, with explicit model assumptions. |

## Shared calculation and release requirements

- Store year-specific rules with official source, effective period and last-checked date. Preserve historical years and label proposals separately from enacted rules.
- Account for automatic allowances, employer payments and prefilled contributions before describing an additional deduction or saving.
- Calculate a tax-effect estimate only when the model and available inputs support it. A deductible amount is not a refund; a part-year stay or tax-class change does not guarantee cash back.
- Add independent reference cases and boundary checks: eligible, partly eligible, ineligible, missing evidence, reimbursed and cross-border cases as relevant. Connect this work to the existing financial QA backlog.
- Keep personal amounts and evidence references in the existing local workspace. Include exports in existing backup controls; avoid sensitive document uploads and never send financial inputs to topic analytics.
- Map preparation steps to the relevant official filing guidance. FinBridge does not submit a tax return.
- Preserve the existing site structure and tester URL. Check the previous Pages deployment before any implementation or documentation commit, then verify the new deployment before another commit.

## Official sources to check for each implementation

These are research entry points, not a completed rule audit or a table of guaranteed benefits. Verify the applicable filing year before publishing calculations.

- [Income Tax Act §9: employment expenses](https://www.gesetze-im-internet.de/estg/__9.html)
- [Income Tax Act §9a: expense allowances](https://www.gesetze-im-internet.de/estg/__9a.html)
- [Income Tax Act §10: special expenses](https://www.gesetze-im-internet.de/estg/__10.html)
- [Income Tax Act §33: extraordinary burdens](https://www.gesetze-im-internet.de/estg/__33.html)
- [Income Tax Act §33a: maintenance and related deductions](https://www.gesetze-im-internet.de/estg/__33a.html)
- [Income Tax Act §35a: household-services tax reductions](https://www.gesetze-im-internet.de/estg/__35a.html)
- [Income Tax Act §32b: progression](https://www.gesetze-im-internet.de/estg/__32b.html)
- [Income Tax Act §46: assessment of employees](https://www.gesetze-im-internet.de/estg/__46.html)
- [BMF: 2026 wage-tax guidance](https://lsth.bundesfinanzministerium.de/lsth/2026/)
- [ELSTER: official filing and annex help](https://www.elster.de/eportal/)
- [BMF: Germany–India tax treaty](https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Internationales_Steuerrecht/Staatenbezogene_Informationen/Laender_A_Z/Indien/1996-05-06-Indien-Abkommen-DBA.html)

## Owner expansion agreed 14 November 2026

The English self-filing companion (`#taxplan/prepare`) adds overlapping situation/year-change questions and two preparation journeys, with section-level ELSTER guidance and a local TXT plan. Published and live-verified (build `6399c4aac147`); see [review](REVIEWS/2026-11-14-self-filing-companion.md). This does not complete TS04.

The personalised tax/investment comparison has [defined requirements](INVESTMENT_TAX_COMPARISON_SPEC.md); numerical product models, eligibility/limit references, fair net-cost comparisons and the automatic search remain pending. Do not report the optimiser as implemented.
