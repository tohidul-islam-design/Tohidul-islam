# Portfolio content review — 17 September 2026

## Confirmed direction

Tohidul confirmed the ED AI design priority: make it easier for students to find programs. The case study uses that intent and describes decisions visible in the supplied artwork. Interpretations, tradeoffs, and proposed tests are labeled; no research participants, shipped features, or measured outcomes have been invented.

## Claims awaiting evidence

`claims-to-verify.json` preserves the former project metrics, client names, dates, and research assertions for editorial review. They are not evidence. Restore a claim only after documenting its source, measurement period, definition, baseline where applicable, and relationship to Tohidul’s contribution. Screenshots may also contain product marketing claims; those are not independent evidence of designer impact.

## Follow-up evidence needed

- Individual role, collaborators, scope, and project dates.
- Actual research or testing records, if any.
- Original unskewed interface exports for closer inspection.
- Permission and attribution for project imagery currently hosted on an external portfolio domain. Existing URLs have been retained, not verified as owned assets.
- A transcript or caption file for the spoken introduction video. No transcript was supplied or invented.

## Implementation

All 18 `work-*.html` pages contain static, project-specific content. The old query-string route forwards known slugs to these pages and presents a work-directory link for unknown slugs. `content/projects.json` records the reviewed catalogue; the work listing embeds that catalogue so it works without a fetch. Keep listing and page summaries aligned when editing.

Unsupported numerical outcomes and copied research assertions were removed from project pages. Brief projects are labeled as design presentations. ED AI has a fuller design walkthrough, uncropped images, figure captions, and explicitly proposed validation tasks.

The existing Tailwind browser runtime is saved locally in `assets/js/tailwind-runtime.js` (downloaded from the site's existing CDN URL). Other external assets still use their existing URLs. The homepage has a static grid fallback if Swiper cannot load.

`tools/check-portfolio.cjs` checks script syntax, all 18 project identities, legacy routes, contact labels, FAQ keyboard operation, mobile menu behavior, horizontal overflow, motion preferences, and project visibility with external requests blocked. It uses the bundled Playwright runtime and installed Chrome on this workstation. Contact submission is not sent during testing.
