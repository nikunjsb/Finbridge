# Connected expense workspace — 14 November 2026

## Implemented

- Stable record IDs; edit in place, duplicate without review confirmation or attachments, and remove with confirmation. Existing calculator inputs are restored when available; older records retain their values in a separate editor. No existing record is reclassified or deleted automatically.
- Annual recorded spending, separate planned spending, clearer allowance/unrecorded-cost labels, overlapping home-office/annual commuting and repeated-record checks.
- Optional user-reviewed current-year work amounts, reconciled for purpose, depreciation, reimbursements and duplication before use. The tariff illustration supports ordinary individual assessment for one employee in **2026**, using a verified taxable-income baseline after the standard employee allowance and before listed costs. It does not infer taxable income from gross/net salary or tax class, and does not calculate a refund.
- Paid-work reduction, additional planned-purchase reduction, net planned spending and non-additive remove-one-record comparisons. Unsupported years/scenarios and overlapping reviewed annual summaries produce an explanation rather than a numerical verdict. Family support, personal insurance and other non-work categories remain outside this work-tax illustration and link to their respective preparation tools.
- Four planning ideas, six overlapping situation/preparation checklist selections, record-stage control and section navigation. Plans are excluded from existing paid-record CSV/adviser exports and listed separately in the adviser text.
- PDF/JPEG/PNG attachment input, signature/extension/size validation (10 MiB each, 100 MiB combined), browser-local IndexedDB, original-file downloads and per-record attachment lists. No file parsing, OCR, AI transmission, server upload or ELSTER submission.
- Selected-year filing ZIP and all-years expense ZIP: PDF summary, full-Unicode TXT/CSV, JSON manifest, preparation checklist choices and original receipt bytes when present. Stored ZIP/CRC validation and guarded missing-ID restore; existing IDs stay unchanged and imported work/profile confirmations require review. The general JSON backup explicitly excludes receipt bytes. Clear-local-data includes the evidence store.
- This expense pack does not replace the existing adviser pack for saved detailed worksheets. No full tax assessment, receipt-content verification or unrestricted tax/investment optimiser is implemented.

## Source checks

Reviewed EStG §9a (ordinary employee allowance), §32a (2026 tariff) and the official ELSTER section guidance on 14 November 2026. Existing workbench-specific models retain their own reviewed scope. The 2026 individual tariff already has independent official reference cases in the repository.

## Verification before publication

- **174 automated tests pass**, including 18 new checks: work allowance and marginal effects, paid/planned and year separation, overlap gates, unsupported scenarios, editing/identity preservation, planned-record exclusion from existing exports, HTML/CSV escaping, PDF pagination/object offsets, ZIP CRC/reference vector, unsafe/damaged ZIP rejection, evidence signatures/limits and manifest linkage.
- Browser fictional example: annual commuting includes 80 home days; adding a separately reviewed 80-day summary blocks the comparison. Editing the latter keeps two records and excludes it from the comparison. Adding a EUR 120 monitor gives reviewed work costs EUR 1,664 and an income-tax reduction of EUR 152 against the EUR 50,000 baseline. Family support EUR 5,400 stays unassessed; total recorded spending is EUR 5,520. A separate planned EUR 300 monitor gives an additional EUR 105 illustration and EUR 195 remaining cost.
- Browser selected-year ZIP download succeeded. Python `zipfile` independently verified all entry CRCs, and `pypdf` read the two-page summary with the expected EUR 152 / EUR 105 / EUR 5,520 values. The first page was rendered with Poppler and inspected.
- **Verification limitation:** the browser file-selection permission was declined during the fictional receipt test. No alternate upload route was attempted. Attachment selection/storage/download and ZIP restore were not tested end to end in the browser. Byte/type/manifest/archive checks pass independently; retain this limitation in the task list. No real user's files were accessed or uploaded.
- An unrelated active preview replaced the local preview during testing; this is not an application reload failure. Remaining reload and responsive checks are to be completed on the published site using the [viewport harness](2026-11-14-expense-responsive.html).

Publication and final live checks are pending this release.
