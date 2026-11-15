# Relocation and double-household expansion — 16 November 2026

## Delivered scope

Replaces the rent × months / land-trip example at `#doublehousehold` with an editable 2026 employee preparation worksheet. Independent own-household, financial participation, centre-of-life, professional reason, first-workplace proximity and German-accommodation confirmations gate double-household candidates. A standalone professionally motivated move has separate German-income checks and does not require keeping two homes.

Records distinguish German accommodation months, complete weekly home trips, first/final journeys, independently usable furnishings, domestic meal days and actual moving costs. Employer payments reduce the relevant basis. Own-car home mileage is an allowance, not recorded €0 spending; flight kilometres are never put into the distance allowance. Cash spending, conditional candidates and reimbursements are separate. No refund is calculated.

One complete home visit is recorded with departure/return dates, land/air portions and one ISO departure week. Overlapping intervals, repeated weeks, repeated months and duplicate item references are rejected. Saved paid expense references and work-worksheet meal dates are checked for potential overlaps, without silently altering other records. Absence/job/household facts still need the taxpayer's review.

Furniture: invoice-VAT-adjusted €800 net test; immediate treatment only for necessary, independently usable items; otherwise a user-checked useful life and acquisition-month straight-line calculation. Tax-free asset reimbursement reduces its cost basis. Meals: €28/€14 domestic rates, meal-specific employer-provided meal reductions/own contributions, first three calendar months including preceding work and no automatic year-boundary restart. Moving expenses: supported actuals after reimbursement, with explicit classification and BUKG/AUV review, not automatic flat rates.

Inputs save only by choice into the existing browser state/JSON backup. TXT is available directly and the general adviser pack recalculates the saved worksheet. No expense is automatically added. The separate expense ZIP continues to cover its own records and attachments; it is not a backup of all worksheets.

## Limits / follow-up

Numerical scope remains 2026, one arrangement and German second accommodation. The main household can be in India. Each recorded housing month is conservatively capped individually before its employer reimbursement; unused-limit pooling across eligible months in the same year needs a separate review. No cross-year carry-forward is implied. Meal-clock restarts after qualifying interruptions, foreign meal rates/second accommodation, older assets, multiple arrangements, owned-home financing, cross-year payments and outbound treaty cases remain outside the model. First/final multi-day travel and feeder transport outside the supported ticket/own-car cases need review. Standalone moving actuals are preparation subtotals before full BUKG/AUV limits. These limits remain visible rather than receiving fabricated eligibility or refund results.

## Focused security / consistency fixes

- Fixed inconsistent escaping in the local question-history refresh. Both question and stored date now use the same safe HTML renderer.
- General backup selection checks a 5 MiB limit before reading, validates structural/record/budget fields and restores the previous in-memory state if persistence fails. Tool-specific worksheet checks remain necessary; this is not a complete schema audit of all legacy fields.
- Relocation input normalization rejects object/array/boolean coercion, unexpected years, invalid dates, unsupported enum values, excess rows and multiline evidence references. Unknown fields are dropped, rendered references are escaped, and exports recompute results rather than trusting a stored total.
- Saved-year mismatch and detected cross-worksheet overlaps cannot silently become a ready-to-combine result. Edited inputs invalidate prior results and disable stale save/download actions.

No credentials, permissions, Cloudflare service settings or private visitor data were changed. The broader SEC01–SEC06 review and authenticated operational verification remain pending; no security certification is claimed.

## Sources

Official references are maintained in `relocation-core.js`: EStG §§9, 6 and 7; BMF LStH 2026 R9.9/R9.11, travel/meal guidance; BFH VI R18/17 on furnishings; and ELSTER filing help. The 2026 €0.38 home-distance rule is kept separate from €0.30 own-car first/final actual journey kilometres. Prior-year rules are not silently reused.

## Validation before publication

203 automated tests pass, including 25 new relocation/backup/reference/adversarial cases. Module syntax and dependency-based asset versions pass. Local browser: eligibility gating, synthetic €1,500 housing cost / €500 reimbursement → €500 candidate; €800 airfare + 40 land km / €100 reimbursement → €715.20; €1,200 furnishing / €200 reimbursement / 10-year life from July → €50. Save/reload/recalculate preserves the records; editing disables stale export. The actual downloaded TXT was independently read and matched the €1,215.20 rent+flight subtotal with reference inputs. At 320/390/700/900/1348px iframe widths, document scroll width matched content width (305/375/685/885/1333px). Browser ZIP/general JSON imports were not retried; the existing declined-upload verification limit remains.

## Published-site verification

Feature commit `da5b3bca2ad544294f031fbc9e9f8c39a444d720` passed Pages run `43774637250`. The live site served build `0eb7aac750d4` at `https://nikunjsb.github.io/Finbridge/?build=0eb7aac750d4#doublehousehold`. A synthetic rent/reimbursement example produced the expected €500 conditional candidate from €1,500 recorded cost and €500 reimbursement; save, reload, load and recalculation preserved it. An actual live TXT download was independently read and matched EUR 500.00, including original normalized inputs. No user receipt/backup upload was attempted. A release screenshot was captured with the synthetic row clearly labelled.

Checklist 6/TS04 is complete within the stated 2026 preparation scope. Advanced cases are retained as checklist 6b. The earlier wider accessibility/performance, operational and security reviews remain separate and incomplete unless their own evidence is recorded.
