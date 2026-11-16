# Shared form alignment — 16 November 2026

The property purchase page had the same 17px offsets from wrapped labels as the double-household worksheet. Replaced the worksheet-only correction with shared form-grid row alignment and shrinkable minmax columns. Standard direct text/number/date inputs and selects now use the available width and a 46px minimum height. Checkbox, radio, range, file, colour and hidden inputs keep their specialised layouts. Fields containing inline small-print help occupy a full row, keeping that help from offsetting neighbouring controls.

The Sources directory also overflowed on phones. Its source rows now wrap the action below the title when needed, keep domains breakable and preserve the button width.

Verification:
- Browser inspection of property, relocation and budget layouts, including mixed native controls and wrapped questions.
- 35 main pages/planner views checked at 900px; 1348px, 390px and 320px page-width checks found the Sources overflow, subsequently corrected.
- 113 linked main pages, guide/term/topic templates and calculator subpages visited at 320px with route identity and document width checks. A transient parent-support measurement was rechecked after rendering: client/scroll width both 305px.
- Additional tax-planning form checks at 900px; no visible control-bottom offsets or page overflow found.
- Existing 235 automated tests and asset-version validation pass. This is a layout review, not an exhaustive interaction or security audit. Upload/import verification remains pending.
