# Property planner flaw and flow review — 16 November 2026

Follow-up requested after checklist 27 was released. Review covered the new planner's calculations, incomplete inputs, saved data, exports, affordability warnings and responsive layout. No bank transaction, private financial record, upload or backend/account setting was used.

## Confirmed findings and corrections

1. **Unknown tax-only inputs blocked cash planning.** A blank building allocation or deductible-cost portion previously caused the entire calculation to fail, including own-use scenarios. These fields now preserve an explicit unknown value. Cash/debt calculations work; tax results, depreciation and cash after tax remain unassessed until all required tax inputs are confirmed. An explicit zero remains distinct from unknown. Invalid non-empty values still fail validation. Saved/reloaded inputs and exports retain the distinction.
2. **Budget assessment could omit interim funding.** For the synthetic one-year default example with a €140 monthly budget, the after-tax funding average (€118.93) fits, but the before-tax amount (€159.35) does not. A specific warning now identifies this gap and the summary shows before-tax funding for both cases. The annual tax illustration is not treated as a monthly payout or loan approval.
3. **Selling costs could create a closing shortfall without the relevant warning.** Projected equity could be positive before selling charges but negative after them. Both scenarios now flag that a sale would need extra cash even before disposal tax or early repayment penalties. The existing scenario-gain arithmetic already included selling costs; this fixes the missing warning rather than changing that formula.
4. **Refinancing warning appeared when no refinancing was needed.** Cash purchases and loans fully repaid within their fixed-rate period no longer get an out-of-horizon refinancing warning. The comparison displays “Not reached / not needed” instead of presenting that particular non-applicable payment as an unassessed tax/financial result.

## Verification

235 automated tests pass, including five new targeted regressions for these cases and preservation of prior amortisation, profit/loss, depreciation, security, saved-state and export tests. Asset dependency versions and syntax checks pass.

Local browser checks: blank tax fields calculate cash with an unassessed tax result; explicit save/reload/recalculate preserves unknowns; restoring the ordinary tax inputs produces the targeted interim-funding warning. At 320/390/900/1348px iframe widths, document width equals scroll width (305/375/885/1333px). Wide tables stay in their own scroll regions. The unchanged numerical default remains covered by the existing independent reference checks. Publication/live verification follows the guarded release; results will be checked on the published build before reporting completion.

## Remaining boundaries

This is a targeted review of the property planner, not certification that the whole website has no flaws. The broader security/Cloudflare/accessibility work remains separately tracked. Frozen 2026 full-year tax assumptions, actual filing-year timing, special depreciation, mixed-use tax allocation, personalised bank quotes, sale taxes and other exclusions from the original model remain explicit. No existing receipt/backup upload test was retried.
