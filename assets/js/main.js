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

  var PAW = '<svg viewBox="0 0 24 24" fill="currentColor">' +
    '<ellipse cx="12" cy="15.6" rx="5" ry="4.2"/>' +
    '<ellipse cx="5.5" cy="9.4" rx="2.3" ry="3"/>' +
    '<ellipse cx="18.5" cy="9.4" rx="2.3" ry="3"/>' +
    '<ellipse cx="9.3" cy="4.6" rx="2.1" ry="2.8"/>' +
    '<ellipse cx="14.7" cy="4.6" rx="2.1" ry="2.8"/></svg>';

  /* Each trail is a walk down the page: paws alternate left and right of a
     meandering centre line, angled to follow the direction of travel. */
  var TRAILS = {
    lead:   { n: 7,  x: 50, amp: 13, turns: 1.1, w: 22, stride: 8,  colour: "var(--forest)",     opacity: .30, from: 6,  to: 96 },
    main:   { n: 18, x: 50, amp: 17, turns: 2.2, w: 27, stride: 10, colour: "var(--forest)",     opacity: .26, from: 2,  to: 99 },
    second: { n: 13, x: 62, amp: 11, turns: 1.6, w: 19, stride: 9,  colour: "var(--terracotta)", opacity: .30, from: 24, to: 97 }
  };

  var trails = [];
  document.querySelectorAll("[data-trail]").forEach(function (host) {
    var cfg = TRAILS[host.dataset.trail];
    if (!cfg) return;
    host.style.color = cfg.colour;
    var paws = [];
    for (var i = 0; i < cfg.n; i++) {
      var t = i / (cfg.n - 1);
      var y = cfg.from + t * (cfg.to - cfg.from);
      var wobble = Math.sin(t * Math.PI * cfg.turns) * cfg.amp;
      var side = (i % 2 === 0 ? -1 : 1) * cfg.stride;   // left paw, right paw
      // angle follows the tangent of the meander so the gait reads correctly
      var tangent = Math.cos(t * Math.PI * cfg.turns) * cfg.turns * cfg.amp;
      var el = document.createElement("span");
      el.className = "paw";
      el.style.setProperty("--x", (cfg.x + wobble + side) + "%");
      el.style.setProperty("--y", y + "%");
      el.style.setProperty("--w", cfg.w + "px");
      el.style.setProperty("--r", (Math.atan2(28, -tangent) * 180 / Math.PI - 90).toFixed(1) + "deg");
      el.innerHTML = PAW;
      host.appendChild(el);
      paws.push(el);
    }
    trails.push({ host: host, paws: paws, op: cfg.opacity });
  });


  /* ---- Hero dog: sit -> stand -> bark, driven by scroll position ---- */
  var shell = document.querySelector(".hero-shell");
  var stage = document.querySelector(".dog-stage");
  var header = document.querySelector(".site-header");

  // the hero sits under the header, so publish its real height to CSS
  function headerH() {
    if (header) document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }
  headerH();
  window.addEventListener("resize", headerH, { passive: true });

  function dogFrame() {
    if (!shell || !stage) return;
    var r = shell.getBoundingClientRect();
    // 0 while the hero is fully in view, 1 by the time it has scrolled away
    var p = Math.min(1, Math.max(0, -r.top / (r.height * 0.72)));

    // stands over the first 55% of that, then barks near the end
    var stand = Math.min(1, p / 0.55);
    var bark  = Math.min(1, Math.max(0, (p - 0.6) / 0.3));

    stage.style.setProperty("--sit", (1 - stand).toFixed(3));
    stage.style.setProperty("--bark", bark.toFixed(3));
    stage.classList.toggle("barking", bark > 0.05);
  }

  var parallax = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));

  function frame() {
    var vh = window.innerHeight;

    dogFrame();

    // Photographs drift against the page — the parallax the reference site uses.
    for (var i = 0; i < parallax.length; i++) {
      var el = parallax[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;   // offscreen, skip the work
      var amt = parseFloat(el.dataset.parallax) || 20;
      el.style.setProperty("--py", ((progress(r, vh) - 0.5) * -2 * amt).toFixed(1) + "px");
    }

    // Paws land one after another as you scroll down, and lift as you scroll back up.
    for (var t = 0; t < trails.length; t++) {
      var tr = trails[t];
      var br = tr.host.getBoundingClientRect();
      if (br.bottom < -150 || br.top > vh + 150) continue;
      // read against the viewport middle so paws land just ahead of the reader
      var p = Math.min(1, Math.max(0, (vh * 0.82 - br.top) / br.height));
      for (var k = 0; k < tr.paws.length; k++) {
        var on = p >= (k + 0.5) / tr.paws.length;
        tr.paws[k].style.setProperty("--o", on ? tr.op : 0);
        tr.paws[k].style.setProperty("--s", on ? 1 : 0.45);
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

  /* ============ 4. Header: transparent over the hero, solid past it ============ */
  if (header) {
    var t2 = false;
    var hs = function () {
      if (t2) return;
      t2 = true;
      requestAnimationFrame(function () {
        var trigger = shell ? shell.getBoundingClientRect().bottom - header.offsetHeight - 8 : 12;
        header.classList.toggle("scrolled", shell ? trigger < 0 : window.scrollY > 12);
        t2 = false;
      });
    };
    window.addEventListener("scroll", hs, { passive: true });
    window.addEventListener("resize", hs, { passive: true });
    hs();
  }
})();
