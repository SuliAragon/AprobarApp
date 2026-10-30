# Mesa de estudio

## Direction

A calm, editorial workspace for a long-term study habit. Paper tones, forest ink,
clear navigation and practical density. Inspired by the readability of editorial
knowledge tools, without copying a product or adding decorative dashboard data.

## System

- Newsreader for page and section titles; Manrope for controls, questions and body.
- Warm paper in light mode; forest surfaces with sage accents in dark mode.
- Primary actions use the forest accent. Errors, doubts and correct answers retain
  separate semantic colors and explicit text.
- Surfaces use thin borders, restrained shadows and 7-16px corners.
- Spacing follows an 8px rhythm, with 20-28px card padding.
- Icons are local inline SVG, not remote images or an extra dependency.
- Short entrance animation on page headings; reduced-motion preferences disable it.

## Layout

- A fixed study navigation rail above 1024px, grouped into study and organization.
- A compact sticky header with an accessible disclosure menu below that width.
- A visible current section, including nested official and practice test routes.
- The homepage prioritizes actual saved work, the next step and today's agenda.
- Question sheets retain readable code, stable option order and explicit correction.
- Tables scroll inside their own container; the document must not scroll sideways.

## Boundaries

`src/styles/redesign.css` owns the workspace appearance and theme tokens.
`global.css` retains the existing specialized control and calendar mechanics.
Do not change storage identifiers, answer keys, question wording or option order
for a visual adjustment. Do not fabricate progress, streaks, charts or activity.

Verify light/dark modes and 390px, 800px and desktop layouts before shipping.
Keep keyboard focus visible, tap targets usable and a skip-to-content link.
