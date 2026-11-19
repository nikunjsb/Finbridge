# Mobile navigation review, 18 November 2026

The public mobile header used a 38 × 38 px menu button for 31 destinations. On the previous release, opening the drawer from Overview and pressing Tab moved focus to the insight strip behind it. Reading down a long page also scrolled the menu button away.

The mobile header now keeps Menu visible when scrolling. The drawer has a close button, a filter for page and section names, and 44 px minimum link heights. On small phones the location control reads “Location”. Opening the drawer focuses Close. Choosing a destination focuses its heading. Skip to content bypasses the site navigation.

## Browser checks

| Interaction | Result |
| --- | --- |
| Open, filter and select Property purchase planner at 320, 390 and 700 px | Correct heading received focus. No document overflow. Selecting the current route also returned to its heading. |
| Filter by tax, filter to zero matches, clear by closing | Matching destinations grouped under their existing section names. Empty search explained. Reopening restored the menu. |
| Tab and Shift+Tab across filtered results | Focus wrapped inside the drawer. Escape, Close and tapping outside returned focus to Menu. |
| Resize an open, filtered drawer to 701 px | Restored all 31 desktop destinations and cleared the modal state and filter. |
| Desktop collapse and expand, Skip to content | The toggle operated at 1280 px. The skip link focused the current page heading and preserved the route. |
| Browser Back with drawer open | Returned to the previous page with the drawer closed and the heading focused. |
| Scroll on Double household costs | Menu remained visible. |

Tested with Chromium at phone and desktop viewport widths. Physical iOS and Android devices and screen-reader announcements remain unverified. This closes the browser-reproduced interaction issues in BQA-01 and BQA-02. The performance and feedback-widget follow-ups in the 17 November review remain open.
