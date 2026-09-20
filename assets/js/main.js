/* ---------------------------------------------------------------
   Walkies & Co. — config binding + scroll motion.

   The reference site (mwdtinc.com) uses GSAP ScrollTrigger with
   `scrub`, so scroll position drives the animation rather than just
   triggering it. Same idea here in vanilla JS: one rAF-throttled
   scroll handler writes CSS custom properties, CSS does the rest.
   --------------------------------------------------------------- */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ 1. Config → page ============ */
  if (typeof SITE !== "undefined") {
    document.querySelectorAll("[data-calendar]").forEach(function (f) { f.src = SITE.calendarEmbedUrl; });
    document.querySelectorAll("[data-calendar-link]").forEach(function (e) { e.href = SITE.calendarEmbedUrl; });
    document.querySelectorAll("[data-email]").forEach(function (e) { e.href = SITE.mailtoUrl; });
    document.querySelectorAll("[data-brand]").forEach(function (e) { e.textContent = SITE.name; });

    // WhatsApp hides itself until a real number exists — a dead wa.me
    // link on a customer's phone is worse than no link at all.
    var waReady = SITE.whatsapp && SITE.whatsapp.indexOf("TODO") === -1;
    document.querySelectorAll("[data-whatsapp]").forEach(function (e) {
      if (waReady) { e.href = SITE.whatsappUrl; } else { e.hidden = true; }
    });

    // Same for the request form: no Web3Forms key means show the email
    // fallback rather than a form that silently goes nowhere.
    var form = document.querySelector("[data-request-form]");
    var fb = document.querySelector("[data-form-fallback]");
    if (form && fb) {
      var k = form.querySelector('input[name="access_key"]');
      var ok = k && k.value && k.value.indexOf("TODO") === -1;
      form.hidden = !ok;
      fb.hidden = ok;
    }
  }

  /* ============ 2. Reveal on enter (fade / slide) ============ */
  var revealTargets = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add("in"); }, parseInt(el.dataset.delay || 0, 10));
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ============ 3. Scrub-linked motion ============ */
  /* progress: 0 as the element's top reaches the bottom of the viewport,
     1 once its bottom has passed the top. Scroll position is the playhead. */
  function progress(rect, vh) {
    return Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
  }

  var parallax = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var band = document.querySelector(".walk-band");
  var dog = band && band.querySelector(".walk-dog");
  var paws = band ? Array.prototype.slice.call(band.querySelectorAll(".wp")) : [];
  var route = band && band.querySelector(".walk-route path");
  var routeLen = 0;

  if (route && route.getTotalLength) {
    routeLen = route.getTotalLength();
    route.style.strokeDasharray = "7 11";
  }

  function frame() {
    var vh = window.innerHeight;

    // Photographs drift against the page — the parallax the reference site uses.
    for (var i = 0; i < parallax.length; i++) {
      var el = parallax[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;   // offscreen, skip the work
      var amt = parseFloat(el.dataset.parallax) || 20;
      el.style.setProperty("--py", ((progress(r, vh) - 0.5) * -2 * amt).toFixed(1) + "px");
    }

    // The dog walks across, the route draws itself, paws land behind it.
    if (band) {
      var br = band.getBoundingClientRect();
      if (br.bottom > -100 && br.top < vh + 100) {
        var p = progress(br, vh);

        if (dog) {
          var travel = band.clientWidth - dog.offsetWidth;
          dog.style.setProperty("--dx", (p * travel).toFixed(1) + "px");
        }
        if (route && routeLen) {
          route.style.strokeDashoffset = (routeLen * (1 - Math.min(1, p * 1.15))).toFixed(1);
        }
        // Each paw appears just after the dog has passed over it.
        for (var j = 0; j < paws.length; j++) {
          var at = (j + 0.6) / paws.length;
          var on = p >= at * 0.92;
          paws[j].style.setProperty("--o", on ? "0.3" : "0");
          paws[j].style.setProperty("--s", on ? "1" : "0.4");
        }
      }
    }
  }

  if (!reduced) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { frame(); ticking = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    frame();
  }

  /* ============ 4. Header shadow ============ */
  var header = document.querySelector(".site-header");
  if (header) {
    var t2 = false;
    var hs = function () {
      if (t2) return;
      t2 = true;
      requestAnimationFrame(function () {
        header.classList.toggle("scrolled", window.scrollY > 12);
        t2 = false;
      });
    };
    window.addEventListener("scroll", hs, { passive: true });
    hs();
  }
})();
