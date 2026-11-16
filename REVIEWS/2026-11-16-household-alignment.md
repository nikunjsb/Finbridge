# Double-household alignment review — 16 November 2026

Long questions wrapped to different line counts in the two-column form, offsetting adjacent controls by 17px. Native text, date and select controls also differed in height (43px/45px).

Scoped the relocation worksheet grid to bottom-align fields within each row, gave its direct input/select controls a consistent 46px height and full available width, and retained a single-column layout through 700px. This applies to eligibility and dynamically added expense records. Calculation and storage logic are unchanged.

Browser checks: eligibility pairs and an added complete-journey record align at 900px and 1348px. Controls remain 46px high at 390px and 320px; document client/scroll widths match at all four widths. Existing automated suite and asset-version validation pass. No attachment/import verification was attempted.
