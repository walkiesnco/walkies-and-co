/* ---------------------------------------------------------------
   Walkies & Co. — single source of truth for brand + contact.
   Change values HERE ONLY. Nothing else in the site hardcodes them.
   --------------------------------------------------------------- */

const SITE = {
  // --- Brand ---
  name:     "Walkies & Co.",
  tagline:  "Same walker. Same routine. Every walk reported.",
  promise:  "Your dog's 20-minute reset, from a walker who's out there every day.",
  walker:   "Jean",

  // --- Contact ---
  email:    "walkiesnco@gmail.com",
  whatsapp: "TODO_WHATSAPP_NUMBER",   // international format, digits only, e.g. 31612345678
  whatsappMessage: "Hi Jean! I'd like to book a free introduction session for my dog.",

  // --- Availability calendar (Google, free/busy only — verified private 20 Sep 2026) ---
  calendarId:  "3cbb80d24b85a5bcc4f8661b7bc2057f8e32effa8a9e65b33fdb3397daa1fdd8@group.calendar.google.com",
  calendarTz:  "Europe/Amsterdam",

  // --- Service area ---
  city:  "Haarlem",
  areas: ["TODO_NEIGHBOURHOODS"],

  // --- Pricing (section 4 of the plan) ---
  prices: {
    intro:      "Free",
    firstWalk:  "€8",
    standard:   "€11",
    secondDog:  "+€4",
    tenCard:    "€100",
    lateCancel: "50%"
  },

  // --- Canonical URL (swap when the custom domain lands) ---
  canonical: "https://walkies-and-co.walkiesnco.workers.dev"
};

/* Derived links — don't edit, these build themselves from the values above. */
SITE.whatsappUrl = "https://wa.me/" + SITE.whatsapp +
                   "?text=" + encodeURIComponent(SITE.whatsappMessage);
SITE.mailtoUrl   = "mailto:" + SITE.email;
SITE.calendarEmbedUrl = "https://calendar.google.com/calendar/embed" +
  "?src=" + encodeURIComponent(SITE.calendarId) +
  "&ctz=" + encodeURIComponent(SITE.calendarTz) +
  "&mode=WEEK&wkst=2&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0" +
  "&bgcolor=%23FBF6EE&color=%232F5D50";
