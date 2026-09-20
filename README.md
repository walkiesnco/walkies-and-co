# Walkies & Co.

Dog walking in Haarlem. Static site — plain HTML, CSS and vanilla JS. No build step.

## Editing

All brand details, contact info, prices and the calendar ID live in **`assets/js/config.js`**.
Change them there; nothing else hardcodes them.

## Local preview

```
node serve.js .
```

Or open `index.html` directly in a browser.

## Deploying

Pushing to `main` deploys automatically via Cloudflare Pages.
No build command; output directory is the repo root.

## Structure

```
index.html            landing page
request/              request a free introduction session
availability/         full-page availability calendar
terms/                pending — see CLAUDE.md
privacy/              privacy statement
assets/css/styles.css design tokens + base styles
assets/js/config.js   >>> single source of truth <<<
assets/js/main.js     applies config to the pages
```
