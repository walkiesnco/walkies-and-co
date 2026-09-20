/* ---------------------------------------------------------------
   Walkies & Co. — config binding + scroll motion.
   No libraries. The reference site uses GSAP + AOS; this does the
   same fade/slide reveals with IntersectionObserver in ~1KB.
   --------------------------------------------------------------- */

(function () {
  "use strict";

  /* ============ 1. Config → page ============ */
  if (typeof SITE !== "undefined") {

    document.querySelectorAll("[data-calendar]").forEach(function (f) {
      f.src = SITE.calendarEmbedUrl;
    });
    document.querySelectorAll("[data-calendar-link]").forEach(function (el) {
      el.href = SITE.calendarEmbedUrl;
    });
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.href = SITE.mailtoUrl;
    });
    document.querySelectorAll("[data-brand]").forEach(function (el) {
      el.textContent = SITE.name;
    });

    // WhatsApp stays hidden until a real number is configured —
    // a dead wa.me link on someone's phone is worse than no link.
    var waReady = SITE.whatsapp && SITE.whatsapp.indexOf("TODO") === -1;
    document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      if (waReady) { el.href = SITE.whatsappUrl; } else { el.hidden = true; }
    });

    // Same logic for the request form: if there's no Web3Forms key,
    // show the email fallback rather than a form that goes nowhere.
    var form = document.querySelector("[data-request-form]");
    var fallback = document.querySelector("[data-form-fallback]");
    if (form && fallback) {
      var key = form.querySelector('input[name="access_key"]');
      var ready = key && key.value && key.value.indexOf("TODO") === -1;
      form.hidden = !ready;
      fallback.hidden = ready;
    }
  }

  /* ============ 2. Scroll reveals ============ */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll("[data-reveal], .paw-trail");

  if (reduced || !("IntersectionObserver" in window)) {
    // No motion, or a browser too old — just show everything.
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(function () { el.classList.add("in"); }, delay);
        io.unobserve(el);   // reveal once, then stop watching
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ============ 3. Header shadow on scroll ============ */
  var header = document.querySelector(".site-header");
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle("scrolled", window.scrollY > 12);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============ 4. Marquee: duplicate content so the loop is seamless ============ */
  var track = document.querySelector(".strip-track");
  if (track && !reduced) {
    track.innerHTML += track.innerHTML;
  }
})();
