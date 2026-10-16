/* Wedding invitation — behaviour. All words live in config.js. */
(function () {
  "use strict";

  var W = window.WEDDING || {};
  var TZ = "Asia/Dhaka";
  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search);
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var guest = (params.get("to") || "").trim().slice(0, 60);

  function store(action, key, value) {
    try {
      if (action === "get") return localStorage.getItem(key);
      if (action === "set") localStorage.setItem(key, value);
    } catch (e) { /* storage blocked */ }
    return null;
  }

  /* ---------------- language ---------------- */

  var lang = params.get("lang") || store("get", "lang") || W.defaultLanguage || "en";
  if (!W.text || !W.text[lang]) lang = "en";

  function t(key, vars) {
    var s = (W.text[lang] && W.text[lang][key]);
    if (s == null) s = W.text.en[key] || "";
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  }

  var locale = function () { return lang === "bn" ? "bn-BD" : "en-GB"; };
  function fmtDate(iso, opts) {
    return new Intl.DateTimeFormat(locale(), Object.assign({ timeZone: TZ }, opts)).format(new Date(iso));
  }
  function num(n, pad) {
    var s = String(n).padStart(pad || 0, "0");
    return lang === "bn" ? s.replace(/\d/g, function (d) { return "০১২৩৪৫৬৭৮৯"[d]; }) : s;
  }

  var weddingNoon = (W.weddingDate || "2026-12-05") + "T12:00:00+06:00";

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = t(el.dataset.t); });
    $("langLabel").textContent = t("langSwitch");
    $("langBtn").setAttribute("aria-label", lang === "bn" ? "Switch to English" : "বাংলায় দেখুন");
    $("guestName").textContent = guest || t("guestDefault");
    document.title = t("groomShort") + " & " + t("brideShort") + (lang === "bn" ? " — বিয়ের নিমন্ত্রণ" : " — You're invited");

    // scratch card content
    $("sWeekday").textContent = fmtDate(weddingNoon, { weekday: "long" });
    $("sDay").textContent = num(Number(fmtDate(weddingNoon, { day: "numeric", numberingSystem: "latn" }).replace(/\D/g, "")), 2);
    $("sMonth").textContent = fmtDate(weddingNoon, { month: "long", year: "numeric" });

    $("closingDate").textContent = fmtDate(weddingNoon, { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, " · ");
    $("rsvpSub").textContent = t("rsvpSub", { date: fmtDate(W.rsvpDeadline + "T12:00:00+06:00", { day: "numeric", month: "long" }) });

    renderTimeline();
    setMap();
    tick(true);
    if (!$("rsvpDone").hidden && lastReply) showDone(lastReply.name, lastReply.attending, true);
    $("guestsOut").textContent = num(guests);
  }

  $("langBtn").addEventListener("click", function () {
    lang = lang === "en" ? "bn" : "en";
    store("set", "lang", lang);
    applyLang();
  });

  /* ---------------- static content ---------------- */

  $("ayahLong").textContent = W.ayahLong || "";
  $("ayahShort").textContent = W.ayahShort || "";
  $("monogram").textContent = W.monogram || "N&E";

  (W.attireColours || []).forEach(function (c) {
    var s = document.createElement("span");
    s.className = "swatch";
    s.style.background = c;
    $("swatches").appendChild(s);
  });

  var venue = W.venue || {};
  $("mapLink").href = venue.mapLink || ("https://www.google.com/maps?q=" + venue.lat + "," + venue.lng);
  var mapSet = "";
  function setMap() {
    if (!venue.lat) { $("mapFrame").parentNode.hidden = true; return; }
    var src = "https://maps.google.com/maps?q=" + venue.lat + "," + venue.lng + "&z=15&hl=" + lang + "&output=embed";
    if (src !== mapSet) { $("mapFrame").src = src; mapSet = src; }
  }

  /* ---------------- timeline ---------------- */

  var ARCH = "M6 124 V52 C6 30 24 18 38 12 C46 8 49 4 50 0 C51 4 54 8 62 12 C76 18 94 30 94 52 V124 Z";
  var seen = new WeakSet();

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
          '<svg class="tl-icon__glyph" viewBox="0 0 48 48"><use href="#i-' + item.icon + '"/></svg>' +
          '<svg class="tl-icon__flowers" viewBox="0 0 140 46">' +
            '<use href="#leaf" x="0" y="-10" width="40" height="20" transform="translate(40 34) rotate(200) scale(.9)"/>' +
            '<use href="#leaf" x="0" y="-10" width="40" height="20" transform="translate(100 34) rotate(-20) scale(.9)"/>' +
            '<use href="#peony" x="-50" y="-50" width="100" height="100" transform="translate(70 30) scale(.3)"/>' +
            '<use href="#blossom" x="-20" y="-20" width="40" height="40" transform="translate(44 34) scale(.6)"/>' +
            '<use href="#blossom" x="-20" y="-20" width="40" height="40" transform="translate(97 36) scale(.5)"/>' +
          "</svg>" +
        "</div>" +
        '<div class="tl-text"><p class="tl-time"></p><p class="tl-title"></p></div>';
      li.querySelector(".tl-time").textContent = item.time[lang] || item.time.en;
      li.querySelector(".tl-title").textContent = item.title[lang] || item.title.en;
      ol.appendChild(li);
      watch(li);
    });
  }

  /* reveal on scroll */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); }
    });
  }, { threshold: .25 }) : null;

  function watch(el) {
    if (!io || reduceMotion || document.body.classList.contains("is-revealed-all")) { el.classList.add("is-inview"); return; }
    io.observe(el);
  }

  document.querySelectorAll(".verse-card").forEach(watch);

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
  if (tick(true)) {
    var cdTimer = setInterval(function () { if (!tick()) clearInterval(cdTimer); }, 1000);
  }

  /* ---------------- scratch to reveal ---------------- */

  var scratch = $("scratch"), canvas = $("scratchCanvas"), ctx = canvas.getContext("2d");
  var heartPts = [], revealed = false, drawing = false, lastPt = null, moves = 0;
  var HEART = "M.5 .97 C.2 .76 .02 .58 .02 .33 C.02 .15 .15 .03 .3 .03 C.4 .03 .46 .09 .5 .17 C.54 .09 .6 .03 .7 .03 C.85 .03 .98 .15 .98 .33 C.98 .58 .8 .76 .5 .97 Z";

  function paintFoil() {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    var w = canvas.width, h = canvas.height;
    ctx.globalCompositeOperation = "source-over";

    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#9C7A45"); g.addColorStop(.25, "#D9BC80"); g.addColorStop(.45, "#F4E1B2");
    g.addColorStop(.6, "#C9A462"); g.addColorStop(.8, "#E8CF98"); g.addColorStop(1, "#8A6A3A");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // glitter
    for (var i = 0; i < w * h / 90; i++) {
      var a = Math.random();
      ctx.fillStyle = a > .5 ? "rgba(255,248,225," + (Math.random() * .7) + ")" : "rgba(110,80,40," + (Math.random() * .25) + ")";
      ctx.fillRect(Math.random() * w, Math.random() * h, dpr * (Math.random() < .1 ? 2 : 1), dpr * (Math.random() < .1 ? 2 : 1));
    }

    // points inside the heart, used to measure how much is scratched
    var path = new Path2D();
    path.addPath(new Path2D(HEART), new DOMMatrix().scale(w, h));
    heartPts = [];
    var step = Math.max(6, Math.round(w / 40));
    for (var y = 0; y < h; y += step) for (var x = 0; x < w; x += step) {
      if (ctx.isPointInPath(path, x, y)) heartPts.push(x, y);
    }
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = w * .15;
  }

  function point(e) {
    var r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * canvas.width / r.width, y: (e.clientY - r.top) * canvas.height / r.height };
  }

  function scratchTo(p) {
    ctx.beginPath();
    ctx.moveTo(lastPt.x, lastPt.y);
    ctx.lineTo(p.x + .01, p.y);
    ctx.stroke();
    lastPt = p;
  }

  function clearedShare() {
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data, clear = 0, n = heartPts.length / 2;
    for (var i = 0; i < heartPts.length; i += 2) {
      if (data[(heartPts[i + 1] * canvas.width + heartPts[i]) * 4 + 3] < 40) clear++;
    }
    return n ? clear / n : 0;
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    scratch.classList.add("is-revealed");
    $("scratchHint").classList.add("is-done");
    if (reduceMotion) return;
    var box = $("sparkles");
    for (var i = 0; i < 26; i++) {
      var s = document.createElement("span");
      s.className = "spark";
      var ang = Math.random() * Math.PI * 2, dist = 60 + Math.random() * 90;
      s.style.left = "50%"; s.style.top = "48%";
      s.style.setProperty("--x", Math.cos(ang) * dist + "px");
      s.style.setProperty("--y", Math.sin(ang) * dist + "px");
      s.style.animationDelay = Math.random() * .25 + "s";
      box.appendChild(s);
    }
    setTimeout(function () { box.innerHTML = ""; }, 1800);
  }

  canvas.addEventListener("pointerdown", function (e) {
    if (revealed) return;
    drawing = true;
    canvas.setPointerCapture(e.pointerId);
    lastPt = point(e);
    scratchTo(lastPt);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!drawing) return;
    scratchTo(point(e));
    if (++moves % 12 === 0 && clearedShare() > .55) reveal();
  });
  ["pointerup", "pointercancel"].forEach(function (ev) {
    canvas.addEventListener(ev, function () {
      if (!drawing) return;
      drawing = false;
      if (clearedShare() > .45) reveal();
    });
  });
  canvas.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") reveal(); });
  canvas.tabIndex = 0;

  var resizeTimer;
  window.addEventListener("resize", function () {
    if (revealed) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(paintFoil, 200);
  });

  /* ---------------- falling petals ---------------- */

  function startPetals() {
    if (reduceMotion) return;
    var box = $("petals");
    var colours = ["#FBF4E8", "#FFFFFF", "#F3E3D3", "#EAD7B5", "#D9C7A2", "#F6E7DA"];
    var count = window.innerWidth < 700 ? 14 : 24;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "%";
      p.style.setProperty("--s", 8 + Math.random() * 10 + "px");
      p.style.setProperty("--c", colours[i % colours.length]);
      p.style.setProperty("--d", 10 + Math.random() * 10 + "s");
      p.style.setProperty("--delay", -Math.random() * 18 + "s");
      p.style.setProperty("--x", (Math.random() * 160 - 60) + "px");
      p.style.setProperty("--r", (Math.random() * 360 + 120) + "deg");
      box.appendChild(p);
    }
  }

  /* ---------------- music ---------------- */

  var audio = $("music"), musicBtn = $("musicBtn");
  if (W.music) {
    audio.src = W.music;
    musicBtn.hidden = false;
    musicBtn.addEventListener("click", function () {
      if (audio.paused) { audio.play().catch(function () {}); } else { audio.pause(); }
    });
    audio.addEventListener("play", function () { musicBtn.setAttribute("aria-pressed", "true"); });
    audio.addEventListener("pause", function () { musicBtn.setAttribute("aria-pressed", "false"); });
  }

  /* ---------------- envelope → gate → page ---------------- */

  var envelope = $("envelope"), gate = $("gate"), body = document.body, opened = false;

  function finishOpen() {
    body.classList.remove("is-sealed");
    gate.classList.add("is-gone");
    window.scrollTo(0, 0);
    paintFoil();
    startPetals();
    $("page").focus({ preventScroll: true });
  }

  function open(instant) {
    if (opened) return;
    opened = true;
    if (W.music) audio.play().catch(function () {});
    if (instant || reduceMotion) {
      envelope.hidden = true;
      gate.hidden = true;
      finishOpen();
      return;
    }
    envelope.classList.add("is-opening");
    setTimeout(function () { envelope.classList.add("is-flap-open"); }, 600);
    setTimeout(function () { envelope.classList.add("is-leaving"); }, 1700);
    setTimeout(function () { gate.classList.add("is-open"); }, 2600);
    setTimeout(finishOpen, 3900);
    setTimeout(function () { envelope.hidden = true; gate.hidden = true; }, 5200);
  }

  $("seal").addEventListener("click", function () { open(false); });
  $("skipBtn").addEventListener("click", function () { open(true); });
  if (params.get("open") === "1") open(true);

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
  if (prev) { try { var p = JSON.parse(prev); showDone(p.name, p.attending, true); } catch (e) { /* ignore */ } }

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
})();
