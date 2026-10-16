/* ============================================================
   EDIT THIS FILE ONLY. Every word on the card comes from here.
   Each piece of text has an English (en) and Bangla (bn) version.
   Save, then refresh the browser to see the change.
   ============================================================ */

window.WEDDING = {
  defaultLanguage: "en", // "en" or "bn"

  // The moment the countdown counts to (Bangladesh time, +06:00)
  countdownTo: "2026-12-05T14:00:00+06:00",
  weddingDate: "2026-12-05",

  monogram: "N&E", // letters on the wax seal

  // ---- Venue -------------------------------------------------
  venue: {
    lat: 23.8023502,
    lng: 90.4633476,
    mapLink: "https://maps.app.goo.gl/iQbd32KJibN1igYf7",
  },

  // ---- Timeline (in order) ------------------------------------
  // icon can be: guests, rings, dining, camera, farewell
  timeline: [
    { icon: "guests",   time: { en: "1:30 pm", bn: "দুপুর ১:৩০" }, title: { en: "Arrival of guests",  bn: "অতিথিদের আগমন" } },
    { icon: "rings",    time: { en: "2:00 pm", bn: "দুপুর ২:০০" }, title: { en: "Nikah ceremony",     bn: "আকদ (নিকাহ)" } },
    { icon: "dining",   time: { en: "2:30 pm", bn: "দুপুর ২:৩০" }, title: { en: "Lunch",              bn: "দুপুরের খাবার" } },
    { icon: "camera",   time: { en: "3:30 pm", bn: "বিকেল ৩:৩০" }, title: { en: "Photos & dessert",   bn: "ফটোসেশন ও মিষ্টিমুখ" } },
    { icon: "farewell", time: { en: "4:30 pm", bn: "বিকেল ৪:৩০" }, title: { en: "Farewell & duas",    bn: "বিদায় ও দোয়া" } },
  ],

  // Attire colour swatches (hex colours)
  attireColours: ["#F3EBDD", "#DCC7A6", "#E9CDC3", "#C3CCB4", "#C9A35E"],

  // ---- RSVP --------------------------------------------------
  // Paste your Google Apps Script web-app URL here (README, step 2).
  rsvpEndpoint: "",
  rsvpDeadline: "2026-11-20",
  maxGuestsPerInvite: 6,

  // ---- Music (optional) ---------------------------------------
  // Put an .mp3 file in this folder and write its name, e.g. "music.mp3".
  // Leave "" for no music (the speaker button is then hidden).
  music: "",

  // ---- The two Quran verses ------------------------------------
  ayahLong: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
  ayahShort: "وَخَلَقْنَاكُمْ أَزْوَاجًا",

  // ---- All text, in both languages -----------------------------
  text: {
    en: {
      langSwitch: "বাংলা",
      skip: "Skip",
      tapToOpen: "Tap the seal to open",
      forGuest: "For",
      guestDefault: "our dear guest",

      heroInvite: "You are invited to the wedding of",
      groomShort: "Nasif",
      brideShort: "Esmat",
      groomFull: "Nasif Sarwar",
      brideFull: "Esmat Jahan Khan Bristi",
      and: "&",
      scroll: "Scroll down",

      ayahLongTrans: "And of His signs is that He created for you, from yourselves, spouses so that you may find tranquillity in them; and He placed between you affection and mercy.",
      ayahLongRef: "Surah Ar-Rum (30:21)",
      ayahShortTrans: "And We created you in pairs",
      ayahShortRef: "Surah An-Naba (78:8)",

      cardIntro: "With the blessings of Allah and our families",
      groomParents: "", // e.g. "Son of Mr. ... & Mrs. ..."  ("" hides it)
      with: "with",
      brideParents: "", // e.g. "Daughter of Mr. ... & Mrs. ..."
      dearHeading: "Dear friends and family",
      inviteBody: "With joy in our hearts, we invite you to witness our Nikah and the beginning of our forever. Your presence and duas would mean the world to us.",

      countdownHeading: "Counting down to our Nikah",
      days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
      countdownDone: "Alhamdulillah, the day is here",

      dateHeading: "The wedding date",
      scratchHint: "Scratch the heart to reveal",

      timelineHeading: "Wedding timeline",

      venueHeading: "The venue",
      venueName: "Pepper Tree BD",
      venueAddress: "Dhaka, Bangladesh",
      viewMap: "Open in Google Maps",

      attireHeading: "Attire",
      attireBody: "Traditional or formal wear. We would love to see soft ivory, beige, blush, sage or gold.",

      rsvpHeading: "RSVP",
      rsvpSub: "Kindly reply by {date}",
      fName: "Your name",
      fPhone: "Phone",
      optional: "(optional)",
      fComing: "Will you join us?",
      yes: "Joyfully accepts",
      no: "Regretfully declines",
      fGuests: "How many people, including you?",
      fMessage: "A message or dua for us",
      send: "Send RSVP",
      sending: "Sending…",
      doneYes: "Thank you, {name}! See you there, insha'Allah.",
      doneYesText: "We've received your RSVP. If your plans change, you can update it here.",
      doneNo: "Thank you for letting us know, {name}.",
      doneNoText: "We'll miss you. Please keep us in your duas.",
      change: "Change my answer",
      errName: "Please write your name.",
      errChoice: "Please choose whether you can come.",
      errNet: "Your RSVP didn't send. Check your internet connection and try again.",
      notConnected: "RSVP isn't connected yet. Add your Google Apps Script link to rsvpEndpoint in config.js.",

      blessing: "Jazakallahu khairan. May Allah bless this union.",
      credit: "Designed and coded by the bride and groom.",
      joke: "We had to use our software engineering degrees somewhere.",
    },

    bn: {
      langSwitch: "English",
      skip: "এড়িয়ে যান",
      tapToOpen: "খুলতে সিলে চাপুন",
      forGuest: "প্রিয়",
      guestDefault: "অতিথি",

      heroInvite: "শুভ বিবাহের নিমন্ত্রণ",
      groomShort: "নাসিফ",
      brideShort: "ইসমাত",
      groomFull: "নাসিফ সারওয়ার",
      brideFull: "ইসমাত জাহান খান বৃষ্টি",
      and: "ও",
      scroll: "নিচে স্ক্রল করুন",

      ayahLongTrans: "আর তাঁর নিদর্শনাবলির মধ্যে একটি হলো, তিনি তোমাদের জন্য তোমাদের মধ্য থেকেই জীবনসঙ্গী সৃষ্টি করেছেন, যাতে তোমরা তাদের কাছে প্রশান্তি পাও; এবং তিনি তোমাদের মধ্যে ভালোবাসা ও দয়া সৃষ্টি করেছেন।",
      ayahLongRef: "সূরা আর-রূম (৩০:২১)",
      ayahShortTrans: "আর আমি তোমাদের সৃষ্টি করেছি জোড়ায় জোড়ায়",
      ayahShortRef: "সূরা আন-নাবা (৭৮:৮)",

      cardIntro: "মহান আল্লাহর রহমত ও পরিবারের দোয়ায়",
      groomParents: "",
      with: "এবং",
      brideParents: "",
      dearHeading: "প্রিয় আত্মীয় ও বন্ধুরা",
      inviteBody: "আনন্দভরা হৃদয়ে আমাদের নিকাহ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাচ্ছি। আপনার উপস্থিতি ও দোয়া আমাদের কাছে অনেক মূল্যবান।",

      countdownHeading: "নিকাহর আর বাকি",
      days: "দিন", hours: "ঘণ্টা", minutes: "মিনিট", seconds: "সেকেন্ড",
      countdownDone: "আলহামদুলিল্লাহ, আজই সেই দিন",

      dateHeading: "বিয়ের তারিখ",
      scratchHint: "তারিখ দেখতে হৃদয়টি ঘষুন",

      timelineHeading: "অনুষ্ঠানসূচি",

      venueHeading: "অনুষ্ঠানস্থল",
      venueName: "পেপার ট্রি বিডি",
      venueAddress: "ঢাকা, বাংলাদেশ",
      viewMap: "গুগল ম্যাপে দেখুন",

      attireHeading: "পোশাক",
      attireBody: "ঐতিহ্যবাহী বা ফরমাল পোশাক। হালকা আইভরি, বেইজ, গোলাপি, সবুজাভ বা সোনালি রঙে আপনাকে দেখলে খুশি হব।",

      rsvpHeading: "উপস্থিতি নিশ্চিত করুন",
      rsvpSub: "অনুগ্রহ করে {date}-এর মধ্যে জানান",
      fName: "আপনার নাম",
      fPhone: "ফোন",
      optional: "(ঐচ্ছিক)",
      fComing: "আপনি কি আসছেন?",
      yes: "হ্যাঁ, আসছি",
      no: "দুঃখিত, আসতে পারছি না",
      fGuests: "আপনিসহ কতজন?",
      fMessage: "আমাদের জন্য কিছু কথা বা দোয়া",
      send: "পাঠান",
      sending: "পাঠানো হচ্ছে…",
      doneYes: "ধন্যবাদ, {name}! দেখা হবে ইনশাআল্লাহ।",
      doneYesText: "আপনার উত্তর আমরা পেয়েছি। পরিকল্পনা বদলালে এখান থেকেই আপডেট করতে পারবেন।",
      doneNo: "জানানোর জন্য ধন্যবাদ, {name}।",
      doneNoText: "আপনাকে মিস করব। দোয়ায় রাখবেন।",
      change: "উত্তর বদলান",
      errName: "অনুগ্রহ করে আপনার নাম লিখুন।",
      errChoice: "আপনি আসছেন কি না বেছে নিন।",
      errNet: "পাঠানো যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।",
      notConnected: "RSVP এখনো যুক্ত হয়নি। config.js-এ rsvpEndpoint-এ Google Apps Script লিংক দিন।",

      blessing: "জাযাকাল্লাহু খাইরান। আল্লাহ এই বন্ধনে বরকত দিন।",
      credit: "এই ওয়েবসাইটটি বর ও কনে নিজেরাই ডিজাইন ও কোড করেছে।",
      joke: "সফটওয়্যার ইঞ্জিনিয়ারিং ডিগ্রিটা কোথাও তো কাজে লাগাতে হবে!",
    },
  },
};
