# Browser QA — 17 November 2026

Tested public build `d0aad7ac7312` / repository head `14f825c4549a5317944a7ac7993591f92ec9f3c0`. This is a scoped browser audit, not a completed accessibility certification, security audit, financial-model validation or Cloudflare operational verification. No application fixes are included in this review commit.

## Environments and scope

- Live Chromium desktop: guide search, salary validation/calculation and budget handoff, feedback required fields, health comparison, route/menu focus, actual browser zoom.
- Same shipped assets in a managed local QA preview, using iframe viewports of **320, 390, 768 and 1280 CSS px**. Instrumentation exists only in the temporary QA copy, not shipped application files. This checks responsive CSS, not a physical iPhone or Android browser.
- Seventeen routes: overview, discover, salary, budget, tax, taxplan, doublehousehold, propertyplan, healthcompare, taxclasses, feedback, settings, location, invest, healthcare, immigration and parentsguide.
- Actual browser zoom at **200%** (681 CSS px viewport) and **400%** (340 CSS px viewport). Browser zoom restored to 100% afterward. Property tested at both levels; salary, double-household and insurance tested at 400%.

## Passed checks

| Area | Observed result |
| --- | --- |
| Reflow | All 68 route/width combinations had equal document client and scroll widths: 305/375/753/1265 px respectively, allowing for the scrollbar. No whole-page horizontal overflow. |
| Zoom | Property, salary, double-household and insurance retained document-width reflow. A property input received visible keyboard focus at 400%. |
| Salary | Synthetic EUR 6,000 gross, class IV, standard public-insurance example returned EUR 3,641.57 monthly net. Negative gross was blocked with native validation and focus on the invalid field. This verifies the interaction, not independent tax accuracy. |
| Salary to budget | The calculated EUR 3,641.57 transferred into the budget base income once. |
| Budget | In the local copy, a synthetic EUR 12.34 expense updated spending and remaining totals. Removed the test transaction; original zero-entry state restored. |
| Expense workspace | Added a synthetic EUR 49.95 equipment record at 50% work use, producing EUR 24.98 preliminary candidate. Edited to EUR 60 and observed EUR 30; confirmed removal and cleaned up that test record. Existing records preserved. |
| Double household | EUR 1,200 housing row remained excluded while conditions were unconfirmed; after seven relevant confirmations it produced the model's EUR 1,000 conditional housing candidate. Changing the amount disabled saving and marked prior results stale. No worksheet was saved over an existing one. |
| Property | Submitted rental example; income-tax effect remained Not assessed without tax opt-in. Changing price disabled readable export. Own-use mode recalculated cash needs and retained unassessed tax. |
| Property tables | At 320 px, yearly table region was 221 px wide with 1440 px scrollable content; document width stayed 305 px. Region has an accessible name and tabindex 0. ArrowRight keyboard input moved its horizontal scroll from 0 to 200 px (after scroll animation). |
| Collapsed invalid input | Negative refinancing rate inside a collapsed property disclosure caused submission to open that disclosure and focus the invalid control. |
| Native disclosures | Accommodation and property disclosures opened by Enter on their summary elements. |
| Menu Escape | Escape closed the mobile drawer and restored focus to the menu toggle. Closed sidebar uses inert; it was not recorded as a hidden-focus defect. |
| Search | NRE search submitted by Enter and returned the relevant India-account guides. Matching is broad; search ranking was not audited. |
| Health comparison | Switching the compared insurer to hkk updated its 2026 contribution result immediately. |
| Feedback | Empty submission stopped at required Short title with browser validation and focus. Status still said nothing sent. No feedback issue or message was submitted; no CAPTCHA was solved. |

## Open findings

### BQA-01 — mobile drawer focus management (priority 1)

Reproduced in the 320 px local copy and on the **live site at actual 200% zoom**. Open the navigation drawer by Enter on Open navigation menu, then press Tab. Focus moves to Location guidance and settings, then Read guide, then Pause automatic rotation in the dimmed page behind the drawer. It does not move into the drawer or stay within its available controls. Escape works.

Source: `app.js`, `fbInitNavigation()` (around line 1613). Opening only toggles the drawer class and updates sidebar inert state; it neither transfers focus nor contains background keyboard interaction. Required follow-up: give the mobile drawer an appropriate accessible interaction model, move focus to a visible drawer control, contain focus/background interaction while open, preserve Escape and restore focus after every close path. Retest direct selection, backdrop, narrow-to-wide resize and keyboard wrapping. Preserve desktop collapse behaviour.

### BQA-02 — no navigation bypass / route focus (priority 2)

There are **32 sidebar links** and no Skip to content link. On desktop, initial Tab navigation starts with the brand and sidebar links. After activating Budget & goals, focus remains on that sidebar link rather than moving to a page heading/content target; route content has been replaced. This creates unnecessary repeated navigation and weak page-change orientation.

Sources: `index.html` main/content structure and `app.js` render/hash navigation. Follow-up: add a visible-on-focus bypass link and a properly focusable main-content target; define route focus/announcement behaviour for genuine page navigation while preserving in-page links, form interactions and browser history. Retest with keyboard and an actual screen reader.

### BQA-03 — startup layout stability / performance evidence (follow-up required)

The local preview's homepage showed startup layout movement. It is a lab signal, not a measured production-user Core Web Vital. Investigate initial shell-to-content insertion and font/ticker sizing, then measure production with controlled cache, CPU/network settings and repeated runs.

| Local fresh document sample | FCP | DOMContentLoaded end | Load event end | Observed layout-shift sum |
| --- | --- | --- | --- | --- |
| Overview, 320 px | 1532 ms | 634 ms | 692 ms | 0.205 |
| Overview, 1280 px | 260 ms | 357 ms | 360 ms | 0.109 |
| Property, 320 px | 852 ms | 386 ms | 437 ms | 0 |

Samples were unthrottled, in an iframe, with browser/font/cache state not reset. The layout-shift column sums entries without recent input; it does not implement the CLS session-window algorithm. Do not call it a final CLS score. Early LCP values are deliberately omitted: the rotating ticker can replace a candidate during the observation window, so a late read does not describe initial content reliably. The first mobile sample reported about 809 KB decoded resources (33 entries, including fonts, QA/preview and third-party assets); cached samples reported zero decoded-byte accounting. Production compressed transfer size was not established. Source `app.js` is 308,350 bytes and `styles.css` 71,936 bytes uncompressed; a future code-splitting review may help. No Lighthouse grade or INP claim is made.

### BQA-04 — feedback widget cleanup warning (priority 3 / verify)

After leaving feedback, Chromium recorded a Cloudflare Turnstile warning that a widget could not be found and suggested turnstile.remove() cleanup. No broken submission was established. Review mount/unmount behaviour on repeated feedback entry/exit without creating test submissions. Browser-extension metadata errors were also present and excluded from site findings.

## Remaining verification

- Fix/retest BQA-01 and BQA-02; investigate BQA-03 and BQA-04.
- Actual iOS Safari/Android devices, assistive-technology reading/order/announcements, contrast and text-only enlargement, other routes and deeper edge cases.
- Controlled production performance, slow network/CPU and error/offline states. These samples are not field measurements.
- Attachment upload/ZIP restore end-to-end checks remain pending; the earlier declined upload permission was not retried.
- Real feedback submission/spam validation, AI/backend error states and authenticated Cloudflare bindings/cron/retention checks remain separate. No private visitor data was accessed.

Checklist 14 and full regression item 3 remain open with this partial evidence. Security item 19 and hosting review retain their separate scope. Browser work is complete for this requested pass; next work is the recorded fixes and remaining verification, not repeating the same checks without a change.
