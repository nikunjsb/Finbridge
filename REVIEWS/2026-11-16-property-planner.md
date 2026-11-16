# Property purchase planner — 16 November 2026

## Scope and behaviour

Owner approved a guided property-buying planner showing upfront cash, loan payments, rental cash flow, conditional income-tax effects and investment outcomes under expected and difficult scenarios. The new route is `#propertyplan`, reachable from the sidebar, local search, Work & money / Tools hubs and the existing investment planner.

Inputs include price, acquisition costs, upfront works, applied equity, a ring-fenced cash buffer, available savings and funding budget. Financing inputs distinguish nominal borrowing rate, optional reference APR, fixed-rate period, repayment term, refinancing assumption and holding horizon. Up to three dated/anonymous bank scenarios can be saved and reloaded. No live personalised bank search or loan-approval decision is made; the starting rates are labelled editable examples.

Monthly rounded annuity schedules separate interest and principal, recalculate payments only after the fixed-rate period, and repay the final balance at maturity. Rent, vacancy, owner cash costs, a separately verified deductible portion, growth assumptions and selling costs feed yearly scenarios. The difficult case applies reduced rent, higher vacancy, an initial repair without unverified tax relief, lower property-value growth and higher refinancing interest after the fixed period.

Cash needs, conditional taxable rental profit/loss and tariff-tax change are separate. Principal repayment builds equity but does not enter the rental tax deduction. The building/land split applies to price and purchase acquisition costs, with building straight-line AfA reference rates 2.5% (pre-1925), 2% (1925–2022), 3% (from 2023), capped at its basis. AfA is not an extra cash expense. Purchase costs are not deducted in full in the first year.

Only ordinary fully rented German long-term residential property with confirmed conditions gets the optional 2026 tariff illustration. Baseline taxable income must exclude the property; joint assessment uses the combined baseline and the splitting tariff. Own use, mixed use, unknown income/year, unconfirmed tax conditions and upfront renovation classification keep tax/cash-after-tax marked **not assessed**, rather than zero. The deductible-cost portion is not inferred from WEG cash contributions or repair budgets. Important restrictions remain visible.

Each row is a full-year planning scenario. 2026 law and baseline income are held constant even in later scenario years: these are not future-law forecasts or actual acquisition-year tax returns. No partial-year timing, special/degressive depreciation, subsidies, Soli/church tax, co-owner allocation, foreign/progression cases, loss carry-back/forward, disposal tax, early repayment penalty or complete bank-fee model. The economic scenario gain reconciles applied purchase equity, accumulated cash flow and future equity after the entered selling costs; it is before disposal tax/inflation, not an annualised return or alternative-investment comparison. The cash buffer is excluded from invested-profit calculations.

## Privacy and consistency

Inputs/comparisons save only on explicit action inside the existing browser state. The general JSON backup retains them; separate property TXT/CSV exports are supplied. It does not create an expense claim or become an expense ZIP attachment. No financial inputs are sent to a bank or backend. Saved totals are not trusted: input schemas, enum/range/date/row limits and comparisons are revalidated and recalculated. Edited inputs disable stale save/download actions. Label text is escaped; CSV contains controlled scenario labels and numeric/unknown cells, not free-text quote labels. Storage failure restores the previous in-memory property state.

## Official sources

Links are maintained in `property-core.js`: EStG §§7,21,32a; BFH STRE202310209 on debt principal versus interest; BMF 2026 purchase-price allocation and repair/capitalisation guidance; ELSTER maintenance-reserve guidance. Bundesbank statistics are linked only as market context, never as an individual offer or an auto-filled current rate.

## Validation before publication

229 automated tests pass, including 26 new amortisation/reference, rental profit/loss, joint tariff, unknown-tax, depreciation cap, renovation/own/mixed gating, refinancing, cash/equity reconciliation, data validation, escaping, comparison and general-backup round-trip tests. A separate closed-form balance reference agrees within monthly bank-rounding tolerance.

Synthetic default example: €200,000 price + €20,000 costs, €40,000 applied equity, €10,000 buffer → €180,000 loan and €50,000 upfront cash. 4% nominal / 30-year repayment gives €859.35/month. Year 1: €7,142.30 interest, €3,169.90 principal, €3,520 building AfA, -€1,262.30 rental result; tariff at baseline €60,000 moves from €14,233 to €13,748 (reduction €485), while cash flow remains -€1,427.20/year. The planner therefore does not turn a tax reduction into a positive-cash-flow claim.

Local browser checks passed: unconfirmed tax stays unknown; confirmed example matches the reference; an anonymous 4% scenario and a dated synthetic 4.5% scenario compare separately, persist and reload; edited inputs disable stale export; own use removes rental income and numerical rental tax. Actual downloaded TXT and CSV were independently read: quote/limits retained and 31 CSV rows cover both 15-year cases plus header. At iframe widths 320/390/700/900/1348px, document scroll widths equal content widths (305/375/685/885/1333px), including the wide yearly-table disclosure; overflow stays inside labelled keyboard-focusable table regions. The existing declined upload/restore verification was not retried. This is scoped feature QA, not completion of the whole-site security/Cloudflare/accessibility audits.

Guarded publication and live verification remain pending before marking the feature complete.
