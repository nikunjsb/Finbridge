# Operator notices and visitor accessibility, 24 November 2026

## Operator and privacy

Nikunj Selani confirmed that he makes the final editorial decisions for Expat updates and approved identification at his published address. The Impressum now identifies the editor. The privacy page identifies the controller, email recipient/provider and rights contact, and explains hosting and abuse prevention, legal obligations, and opt-in processing. The existing production contact and two-way email test were confirmed previously.

The following decisions still require operator review. The fact that an event is aggregated later does not resolve the legal basis for its collection.

| Processing | Remaining evidence or decision |
|---|---|
| Cloudflare visit beacon, approximate counts after device-location denial, and manual selection counts | Evaluate necessity, reasonable visitor expectations and less intrusive alternatives for each purpose. Document the balancing assessment before relying on legitimate interests. Assess the daily/session storage markers separately under § 25 TDDDG. Browser denial is not consent for analytics. |
| AI questions and recent messages, feedback, ordinary email | Confirm purpose and basis for each, the retention or deletion criteria the operator follows for private issues and email, and applicable provider retention. |
| Provider arrangements | Verify applicable contract/role, processing locations and any transfer mechanism and safeguards for the actual GitHub, Cloudflare, Google and CDN services used. Public provider policies alone cannot establish the account-specific arrangement. |
| Editorial responsibility | Public identification added on owner confirmation. The personal eligibility conditions in § 18(2) remain the editor’s responsibility. |

References: [GDPR, especially Articles 6, 13, 21 and 44–49](https://eur-lex.europa.eu/legal-content/EN-DE/TXT/?uri=CELEX%3A32016R0679), [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html), [§ 18 MStV](https://www.gesetze-bayern.de/Content/Document/MStV-18).

## Accessibility and loading

A production PageSpeed Insights run on build afbf326ea991 reported mobile CLS 0.149. Its element breakdown attributed the full shift to the footer. Mobile accessibility scored 96 and identified insufficient footer contrast. Desktop CLS rounded to 0.09 in the score calculator. [Production baseline](https://pagespeed.web.dev/analysis/https-atlas-everyday-com/6ixz2cm68p5h9sis6rzgti?form_factor=mobile). These are synthetic lab results.

The shared shell reserves space while the route is empty, and the footer and build stamp use darker text. The live location form previously left focus on Submit after a missing-state error. The fix focuses the state selector, associates it with an inline error, exposes the invalid state, and clears the error when corrected or when a different country is chosen. Privacy and location sections now use level-two headings below the page heading.

Browser accessibility-tree inspection checks exposed names, roles, order and states. It cannot verify spoken announcements on VoiceOver, TalkBack or another installed screen reader. Real-device screen-reader testing and wider route/error coverage remain open.
