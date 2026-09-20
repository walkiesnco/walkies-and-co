/* ---------------------------------------------------------------
   Walkies & Co. — applies values from config.js to the page.
   Visible text stays in the HTML (good for SEO and no-JS visitors);
   this only fills in links and the calendar embed.
   --------------------------------------------------------------- */

(function () {
  "use strict";

  if (typeof SITE === "undefined") return;

  // Availability calendar — built from the calendar ID in config.js
  document.querySelectorAll("[data-calendar]").forEach(function (frame) {
    frame.src = SITE.calendarEmbedUrl;
  });

  // Direct link to the calendar, as a fallback if the embed fails to load
  document.querySelectorAll("[data-calendar-link]").forEach(function (el) {
    el.href = SITE.calendarEmbedUrl;
  });

  // Email links
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.href = SITE.mailtoUrl;
    if (el.dataset.email === "text") el.textContent = SITE.email;
  });

  // WhatsApp links — hidden entirely until a real number is configured,
  // so we never ship a broken wa.me link.
  var waReady = SITE.whatsapp && SITE.whatsapp.indexOf("TODO") === -1;
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    if (waReady) {
      el.href = SITE.whatsappUrl;
    } else {
      el.hidden = true;
    }
  });

  // Brand name, wherever it is marked for replacement
  document.querySelectorAll("[data-brand]").forEach(function (el) {
    el.textContent = SITE.name;
  });

  // Request form — if the Web3Forms key is not configured yet, hide the form
  // and show the email fallback instead of letting someone fill in a form
  // that silently goes nowhere.
  var form = document.querySelector("[data-request-form]");
  var fallback = document.querySelector("[data-form-fallback]");
  if (form && fallback) {
    var key = form.querySelector('input[name="access_key"]');
    var keyReady = key && key.value && key.value.indexOf("TODO") === -1;
    form.hidden = !keyReady;
    fallback.hidden = keyReady;
  }
})();
