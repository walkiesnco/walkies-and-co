# Project: Walkies & Co. — dog walking site, Haarlem

Static site, HTML/CSS/vanilla JS, no build step, no framework. English only.

## Non-negotiables

- **Brand, contact and prices live in `assets/js/config.js` only.** Never hardcode them anywhere else — the
  business rebrands as it grows, and that must stay a one-file change.
- **Never invent** reviews, testimonials, credentials, insurance cover or a KVK number. Use `TODO` markers.
- **Owner is South African, living in Haarlem, learning Dutch.** Never present him as Dutch.
- **Everything stays on free tiers.** If a step would cost money, stop and say so.
- **No VAT line, ever.** Prices are simply in euros. The owner is not VAT-registered, so VAT wording would
  be actively wrong.

## The booking model — get this right

There is **no self-serve booking** and there never will be at this stage.

1. Visitor sees the availability calendar — read-only, for guidance.
2. Visitor submits a **request** for a free introduction session.
3. Jean reaches out and agrees a time.
4. At the in-person meet-and-greet, Jean enters the recurring walks manually on his tablet.

Never describe the site as letting customers "book a slot" or "reserve a time". They request; Jean confirms.

## Availability

Jean's Walkies Google Calendar is the single source of truth. **Do not ask him to type out his hours.**
Read the public feed instead:
`https://calendar.google.com/calendar/ical/<CALENDAR_ID>/public/basic.ics`

The calendar is shared as **free/busy only** — verified 20 Sep 2026, event titles come back as "Busy" with
no location or description. Re-verify after any change to its sharing settings.

## Design

Palette (in `:root`): forest `#2F5D50`, cream `#FBF6EE`, sage `#DDE8E1`, sunshine `#F2A541`,
charcoal `#26302E`, terracotta `#C9623F`.

Sunshine is a **fill colour only** — never use it as text on cream, it fails contrast.
Headings Fraunces, body Inter, self-hosted. Mobile-first, 16px+ base.
WCAG AA contrast, alt text on every image, visible focus states, semantic HTML.

## Prices

Introduction session free; first walk €8; 20-min walk €11; second dog +€4; 10-walk card €100;
late cancellation (under 12h) 50%. No evening or weekend surcharge.

## Legal

Terms are to be drafted from **web research**, not from memory (section 8.2 of the plan).
Never claim the result is legal advice. Mark uncertain clauses `TODO-REVIEW`.
Do not publish liability or insurance wording anywhere on the site until that draft is reviewed —
`/terms/` is `noindex` until then.

## Privacy

No cookies, no trackers beyond Cloudflare Web Analytics. The private planning document
(`dog-walking-haarlem-mvp-plan.md`) is gitignored and must never be committed — the repo is public.

## Outstanding placeholders

Search the tree for `TODO` before any launch. Currently open:
`TODO_WHATSAPP_NUMBER`, `TODO_NEIGHBOURHOODS`, `TODO_WEB3FORMS_KEY`, `TODO_PAGES_DEV_URL`, photos.
