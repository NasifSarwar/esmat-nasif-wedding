/* Wedding invitation — behaviour. All words live in config.js. */
(function () {
  "use strict";

  var W = window.WEDDING || {};
  var TZ = "Asia/Dhaka";
  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search);
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var guest = (params.get("to") || "").trim().slice(0, 60);
  var isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);

  function store(action, key, value) {
    try {
      if (action === "get") return localStorage.getItem(key);
      if (action === "set") localStorage.setItem(key, value);
    } catch (e) { /* storage blocked */ }
    return null;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- language ---------------- */

  var lang = params.get("lang") || store("get", "lang") || W.defaultLanguage || "en";
  if (!W.text || !W.text[lang]) lang = "en";

  function t(key, vars) {
    var s = W.text[lang] && W.text[lang][key];
    if (s == null) s = W.text.en[key] || "";
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  }

  function num(n, pad) {
    var s = String(n).padStart(pad || 0, "0");
    return lang === "bn" ? s.replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯"[d]; }) : s;
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t(el.dataset.t); });
    $("langLabel").textContent = t("langSwitch");
    $("langBtn").setAttribute("aria-label", lang === "bn" ? "Switch to English" : "বাংলায় দেখুন");
    document.title = t("brideShort") + " & " + t("groomShort") + (lang === "bn" ? " — বিয়ের নিমন্ত্রণ" : " — You're invited");
    $("saveDate").textContent = t("saveDate");
    $("introDate").textContent = num("05.12.2026");
    fitNames();
    renderTimeline();
    renderContacts();
    setMap();
    tick(true);
    $("guestsOut").textContent = num(guests);
    if (!$("rsvpDone").hidden && lastReply) showDone(lastReply.name, lastReply.attending, true);
    updateMusicLabel();
  }

  $("langBtn").addEventListener("click", function () {
    lang = lang === "en" ? "bn" : "en";
    store("set", "lang", lang);
    applyLang();
  });

  /* ---------------- names: one line if it fits, otherwise two even lines ---------------- */

  function fitNames() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".fit"));
    if (!els.length) return;
    els.forEach(function (el) { el.classList.remove("is-wrapped"); el.style.fontSize = ""; el.style.whiteSpace = "nowrap"; });
    var max = parseFloat(getComputedStyle(els[0]).fontSize);
    // the size at which each name fits on one line
    var fits = els.map(function (el) {
      var avail = el.clientWidth, need = el.scrollWidth;
      return need > avail ? Math.floor(max * avail / need) - 1 : max;
    });
    var common = Math.min.apply(null, fits);
    if (common >= max * .78) {
      // every name fits on one line at a good size: use the same size for all
      els.forEach(function (el) { el.style.fontSize = common + "px"; });
    } else {
      // too small: keep a readable size; long names split into two even lines
      var size = Math.round(max * .9);
      els.forEach(function (el, i) {
        el.style.fontSize = size + "px";
        if (fits[i] < size) { el.style.whiteSpace = ""; el.classList.add("is-wrapped"); }
      });
    }
  }

  var fitTimer;
  window.addEventListener("resize", function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitNames, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNames);

  /* ---------------- static content ---------------- */

  $("bismillahText").textContent = W.bismillah || "";
  $("ayahText").textContent = W.ayah || "";
  $("monogram").textContent = W.monogram || "E&N";

  (W.attireColours || []).forEach(function (c) {
    var li = document.createElement("li");
    li.className = "swatch";
    li.style.setProperty("--c", c.hex);
    li.title = c.name;
    li.setAttribute("aria-label", c.name);
    $("swatches").appendChild(li);
  });

  /* pearl strands: place pearls along each curve */
  var SVGNS = "http://www.w3.org/2000/svg";
  document.querySelectorAll("svg.strand").forEach(function (svg) {
    var path = document.createElementNS(SVGNS, "path");
    path.setAttribute("d", svg.dataset.path);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#CDBB9C");
    path.setAttribute("stroke-width", ".6");
    svg.appendChild(path);
    var len = path.getTotalLength(), gap = Number(svg.dataset.gap) || 12, r = Number(svg.dataset.r) || 4;
    var i = 0;
    for (var d = gap / 2; d < len; d += gap) {
      var p = path.getPointAtLength(d);
      var c = document.createElementNS(SVGNS, "circle");
      var big = i % 7 === 3;
      c.setAttribute("cx", p.x.toFixed(1));
      c.setAttribute("cy", p.y.toFixed(1));
      c.setAttribute("r", (big ? r * 1.35 : r * (0.88 + 0.12 * Math.sin(i))).toFixed(2));
      c.setAttribute("fill", "url(#pearl)");
      svg.appendChild(c);
      if (big) d += r * .5;
      i++;
    }
  });

  /* ---------------- map ---------------- */

  var venue = W.venue || {};
  $("mapLink").href = venue.mapLink || ("https://www.google.com/maps?q=" + venue.lat + "," + venue.lng);
  var mapSet = "";
  function setMap() {
    if (!venue.lat) { $("mapFrame").parentNode.hidden = true; return; }
    var src = "https://maps.google.com/maps?q=" + venue.lat + "," + venue.lng + "&z=15&hl=" + lang + "&output=embed";
    if (src !== mapSet) { $("mapFrame").src = src; mapSet = src; }
  }

  /* ---------------- calendar ---------------- */

  var cal = W.calendar || {};
  function stamp(iso) { return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var page = location.href.split(/[?#]/)[0];

  var gcal = "https://calendar.google.com/calendar/render?" + new URLSearchParams({
    action: "TEMPLATE",
    text: cal.title || "Wedding",
    dates: stamp(cal.start) + "/" + stamp(cal.end),
    location: cal.location || "",
    details: "Invitation: " + page
  }).toString();

  var ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//esmat-nasif//wedding//EN", "BEGIN:VEVENT",
    "UID:esmat-nasif-" + stamp(cal.start) + "@wedding",
    "DTSTAMP:" + stamp(new Date().toISOString()),
    "DTSTART:" + stamp(cal.start),
    "DTEND:" + stamp(cal.end),
    "SUMMARY:" + (cal.title || "Wedding"),
    "LOCATION:" + (cal.location || "").replace(/,/g, "\\,"),
    "DESCRIPTION:Invitation: " + page,
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Wedding tomorrow", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  var icsHref = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);

  $("icsLink").href = icsHref;
  if (isApple) {
    $("calBtn").href = icsHref;
    $("calBtn").setAttribute("download", "esmat-nasif-wedding.ics");
    $("calBtn").removeAttribute("target");
  } else {
    $("calBtn").href = gcal;
  }

  /* ---------------- timeline ---------------- */

  var ARCH = "M6 124 V52 C6 30 24 18 38 12 C46 8 49 4 50 0 C51 4 54 8 62 12 C76 18 94 30 94 52 V124 Z";

  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); }
    });
  }, { threshold: .25 }) : null;

  function watch(el) {
    if (!io || reduceMotion) { el.classList.add("is-inview"); return; }
    io.observe(el);
  }

  function renderTimeline() {
    var ol = $("timeline");
    ol.innerHTML = "";
    (W.timeline || []).forEach(function (item) {
      var li = document.createElement("li");
      li.className = "tl-item";
      li.innerHTML =
        '<span class="tl-marker" aria-hidden="true"></span>' +
        '<div class="tl-icon" aria-hidden="true">' +
          '<svg class="tl-icon__frame" viewBox="0 0 100 124"><path d="' + ARCH + '"/></svg>' +
          '<svg class="tl-icon__glyph" viewBox="0 0 48 48"><use href="#i-' + esc(item.icon) + '"/></svg>' +
          '<span class="tl-icon__pearls"></span>' +
        "</div>" +
        '<div class="tl-text"><p class="tl-time"></p><p class="tl-title"></p></div>';
      li.querySelector(".tl-time").textContent = item.time[lang] || item.time.en;
      li.querySelector(".tl-title").textContent = item.title[lang] || item.title.en;
      ol.appendChild(li);
      watch(li);
    });
  }

  /* ---------------- contacts ---------------- */

  function phoneParts(local) {
    var digits = String(local).replace(/\D/g, "");
    var intl = digits.indexOf("880") === 0 ? digits : "88" + digits;
    var shown = digits.length === 11 ? digits.slice(0, 5) + " " + digits.slice(5) : digits;
    return { intl: intl, shown: num(shown) };
  }

  function renderContacts() {
    var groups = W.contacts || {};
    [["bride", "contactsBride"], ["groom", "contactsGroom"]].forEach(function (g) {
      var ul = $(g[1]);
      ul.innerHTML = "";
      (groups[g[0]] || []).forEach(function (c) {
        var p = phoneParts(c.phone);
        var li = document.createElement("li");
        li.innerHTML =
          '<span class="contact__name"></span>' +
          '<span class="contact__phone"></span>' +
          '<span class="contact__btns">' +
            '<a class="btn btn--line" href="tel:+' + p.intl + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="c-call"></span></a>' +
            '<a class="btn btn--line" target="_blank" rel="noopener" href="https://wa.me/' + p.intl + '"><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c.3 1.8 2 3.6 4 4.3l1.2-1.1 1.6.8c-.2 1-1 1.6-2 1.6-3 0-6-3-6-6 0-1 .6-1.8 1.6-2l.8 1.6z"/></g></svg>WhatsApp</a>' +
          "</span>";
        li.querySelector(".contact__name").textContent = c.name[lang] || c.name.en;
        li.querySelector(".contact__phone").textContent = p.shown;
        li.querySelector(".c-call").textContent = t("call");
        ul.appendChild(li);
      });
    });
  }

  /* ---------------- countdown ---------------- */

  var target = new Date(W.countdownTo).getTime();
  var cells = {};
  document.querySelectorAll("#countdown [data-unit]").forEach(function (el) { cells[el.dataset.unit] = el; });
  var last = {};

  function tick(force) {
    var diff = target - Date.now();
    if (diff <= 0) {
      $("countdown").hidden = true;
      $("countdownDone").hidden = false;
      return false;
    }
    var s = Math.floor(diff / 1000);
    var v = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
    Object.keys(v).forEach(function (k) {
      if (force || last[k] !== v[k]) {
        cells[k].textContent = num(v[k], 2);
        if (!force && !reduceMotion) {
          cells[k].classList.remove("tick");
          void cells[k].offsetWidth;
          cells[k].classList.add("tick");
        }
        last[k] = v[k];
      }
    });
    return true;
  }

  /* ---------------- music ---------------- */

  var audio = $("music"), musicBtn = $("musicBtn");
  if (W.music) {
    audio.src = W.music;
    audio.volume = W.musicVolume == null ? .35 : W.musicVolume;
    musicBtn.addEventListener("click", function () {
      if (audio.paused) audio.play().catch(function () {}); else audio.pause();
    });
    audio.addEventListener("play", function () { musicBtn.setAttribute("aria-pressed", "true"); updateMusicLabel(); });
    audio.addEventListener("pause", function () { musicBtn.setAttribute("aria-pressed", "false"); updateMusicLabel(); });
  }

  function updateMusicLabel() {
    musicBtn.setAttribute("aria-label", audio.paused ? t("musicOn") : t("musicOff"));
  }

  function startMusic() {
    if (!W.music) return;
    musicBtn.hidden = false;
    audio.volume = W.musicVolume == null ? .35 : W.musicVolume;
    audio.play().catch(function () { /* browser blocked autoplay; the button still works */ });
  }

  /* ---------------- envelope → Bismillah → ayah → page ---------------- */

  var envelope = $("envelope"), intro = $("intro"), body = document.body;
  var opened = false, timers = [], stepIndex = -1;

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function finish() {
    clearTimers();
    envelope.hidden = true;
    intro.classList.add("is-gone");
    body.classList.remove("is-sealed");
    window.scrollTo(0, 0);
    setTimeout(function () { intro.hidden = true; }, 1300);
    $("page").focus({ preventScroll: true });
  }

  // intro: the ayah, then our names, then the date — then the invitation
  var steps = [
    function () { $("stepAyah").classList.add("is-show"); later(next, 8000); },
    function () { $("stepAyah").classList.remove("is-show"); later(finish, 1100); }
  ];

  function next() {
    clearTimers();
    stepIndex++;
    if (stepIndex < steps.length) steps[stepIndex]();
    else finish();
  }

  intro.addEventListener("click", function () { if (opened) next(); });

  function open(skipAll) {
    if (opened) return;
    opened = true;
    startMusic();
    if (skipAll || reduceMotion) { finish(); return; }
    envelope.classList.add("is-opening");
    later(function () { envelope.classList.add("is-open"); }, 450);
    later(next, 1300);                                   // the ayah fades in as the doors part
    setTimeout(function () { envelope.hidden = true; }, 2600); // not cleared when the intro advances
  }

  $("seal").addEventListener("click", function () { open(false); });
  $("skipBtn").addEventListener("click", function () { open(true); });
  if (params.get("open") === "1") { opened = true; finish(); }

  /* ---------------- RSVP ---------------- */

  var form = $("rsvpForm");
  var maxGuests = W.maxGuestsPerInvite || 6, guests = 1, lastReply = null;
  var stepBtns = form.querySelectorAll("[data-step]");

  if (guest) $("rsvpName").value = guest;

  function setGuests(n) {
    guests = Math.max(1, Math.min(maxGuests, n));
    $("guestsOut").textContent = num(guests);
    stepBtns[0].disabled = guests <= 1;
    stepBtns[1].disabled = guests >= maxGuests;
  }
  stepBtns.forEach(function (b) { b.addEventListener("click", function () { setGuests(guests + Number(b.dataset.step)); }); });
  setGuests(1);

  form.querySelectorAll('input[name="attending"]').forEach(function (r) {
    r.addEventListener("change", function () { $("guestsField").hidden = r.value !== "Yes"; });
  });

  function showDone(name, attending, quiet) {
    lastReply = { name: name, attending: attending };
    form.hidden = true;
    var done = $("rsvpDone");
    done.hidden = false;
    var first = (name || "").split(" ")[0];
    $("doneTitle").textContent = t(attending === "Yes" ? "doneYes" : "doneNo", { name: first });
    $("doneText").textContent = t(attending === "Yes" ? "doneYesText" : "doneNoText");
    done.querySelector(".rings").classList.add("is-inview");
    if (!quiet) done.focus();
  }

  var prev = store("get", "rsvp-sent");
  if (prev) { try { var pr = JSON.parse(prev); showDone(pr.name, pr.attending, true); } catch (e) { /* ignore */ } }

  $("rsvpAgain").addEventListener("click", function () {
    $("rsvpDone").hidden = true;
    form.hidden = false;
    $("rsvpName").focus();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("rsvpError");
    err.textContent = "";
    var data = new FormData(form);
    var name = (data.get("name") || "").trim();
    var attending = data.get("attending");

    if (!name) { err.textContent = t("errName"); $("rsvpName").focus(); return; }
    if (!attending) { err.textContent = t("errChoice"); return; }
    if (!W.rsvpEndpoint) { err.textContent = t("notConnected"); return; }

    var payload = new URLSearchParams({
      name: name,
      phone: (data.get("phone") || "").trim(),
      attending: attending,
      guests: attending === "Yes" ? String(guests) : "0",
      message: (data.get("message") || "").trim(),
      invitedAs: guest,
      language: lang
    });

    var btn = $("rsvpSubmit");
    btn.disabled = true;
    btn.textContent = t("sending");

    // no-cors: Google accepts the data; the reply can't be read, but a network failure still throws.
    fetch(W.rsvpEndpoint, { method: "POST", mode: "no-cors", body: payload })
      .then(function () {
        store("set", "rsvp-sent", JSON.stringify({ name: name, attending: attending }));
        showDone(name, attending);
      })
      .catch(function () { err.textContent = t("errNet"); })
      .finally(function () { btn.disabled = false; btn.textContent = t("send"); });
  });

  /* ---------------- go ---------------- */

  applyLang();
  if (tick(true)) {
    var cdTimer = setInterval(function () { if (!tick()) clearInterval(cdTimer); }, 1000);
  }
})();
