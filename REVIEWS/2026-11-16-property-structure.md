# Property planner structure — 16 November 2026

Owner approved the reviewed purchase → financing → result → explore-further flow.

- The initial form has 15 basic fields for rental/mixed use and 13 for own use. The previous 34 calculation fields remain available where relevant; advanced refinancing/quote, growth/sale, tax and stress assumptions are collapsed after the result.
- Own use hides and disables rental inputs. Mixed use retains entered rent and explains that tax allocation is unassessed. Disabled rental/tax fields cannot block cash planning. Mode changes preserve DOM entries while on the page; saving records the active model inputs.
- Rental tax is explicitly opt-in, still subject to existing eligibility/validation. Inactive tax values remain unknown, not zero relief. Old version-1 saved plans/comparisons still load and recalculate; confirmed rental-tax plans restore the opt-in.
- A desktop sticky snapshot shows upfront cash, initial mortgage payment and year-1 before-tax funding. The result separately labels monthly cash flow, annual income-tax change and horizon equity. Detailed comparisons/yearly tables and model explanations are expandable; dynamic financial-risk warnings remain visible.
- Section navigation stays within the property route. Submissions scroll to the result start. Hidden invalid native controls open their containing section; model validation opens related advanced sections. Changing any associated input invalidates both summaries and disables save/export until recalculation.

Validation: 240 combined tests pass (five additional input-mode/tax-gate/summary regressions). Browser checks cover rental/own/mixed modes, tax opt-in (€485 annual example reduction), external associated advanced controls, stale-result invalidation, native collapsed-field validation, model error opening, section links, old saved-plan load, save/reload and comparison add/load/remove. Actual direct-page TXT and 31-row CSV downloads/content passed. At 320, 390, 900 and 1348px the document client/scroll widths match. Desktop snapshot and phone layouts visually inspected. Native HTML form association retains a single validated calculation for both update buttons.

Calculation/tax formulas and backup schema are unchanged. This remains a bounded German-property illustration, with no bank search, actual refund forecast or investment recommendation. Upload/import end-to-end verification and the wider security review retain their pending statuses.
