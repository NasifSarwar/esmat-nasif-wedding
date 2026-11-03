/* ============================================================
   EDIT THIS FILE ONLY. Every word on the card comes from here.
   Each piece of text has an English (en) and Bangla (bn) version.
   Save, then refresh the browser to see the change.
   ============================================================ */

window.WEDDING = {
  defaultLanguage: "en", // "en" or "bn"

  // Countdown target and calendar event (Bangladesh time, +06:00)
  countdownTo: "2026-12-05T14:00:00+06:00",
  calendar: {
    start: "2026-12-05T13:30:00+06:00",
    end: "2026-12-05T17:00:00+06:00",
    title: "Nikkah of Esmat & Nasif",
    location: "Pepper Tree BD, Dhaka",
  },

  monogram: "NE", // letters on the pearl seal

  // Background music: plays softly after the seal is tapped, on loop.
  music: "music.mp3",
  musicVolume: 0.35, // 0 = silent, 1 = full

  venue: {
    lat: 23.8023502,
    lng: 90.4633476,
    mapLink: "https://maps.app.goo.gl/iQbd32KJibN1igYf7",
  },

  // icon can be: guests, nikah, dining, dua
  timeline: [
    { icon: "guests", time: { en: "1:30 pm", bn: "দুপুর ১:৩০" }, title: { en: "Arrival of guests", bn: "অতিথিদের আগমন" } },
    { icon: "nikah",  time: { en: "2:00 pm", bn: "দুপুর ২:০০" }, title: { en: "Nikkah ceremony",   bn: "আকদ (নিকাহ)" } },
    { icon: "dining", time: { en: "2:30 pm", bn: "দুপুর ২:৩০" }, title: { en: "Lunch",             bn: "দুপুরের খাবার" } },
    { icon: "dua",    time: { en: "4:30 pm", bn: "বিকেল ৪:৩০" }, title: { en: "Duas & farewell",   bn: "দোয়া ও বিদায়" } },
  ],

  // Attire colour dots
  attireColours: [
    { name: "Ivory",        hex: "#FBF6E9" },
    { name: "Beige",        hex: "#E6D5B8" },
    { name: "Blush pink",   hex: "#F2C6C2" },
    { name: "Sage green",   hex: "#B7C6A8" },
    { name: "Powder blue",  hex: "#BCD3E6" },
    { name: "Lavender",     hex: "#D5C9E8" },
    { name: "Butter yellow",hex: "#F5E6A6" },
    { name: "Light grey",   hex: "#D8D8D4" },
  ],

  // Phone numbers: Bangladesh numbers as written locally
  contacts: {
    bride: [
      { name: { en: "Mohammad Enamul Haque Khan", bn: "মোহাম্মদ এনামুল হক খান" }, phone: "01711617527" },
      { name: { en: "Salman Khan Shihan",         bn: "সালমান খান সিহান" },       phone: "01777679713" },
    ],
    groom: [
      { name: { en: "Mehedi Al Redoy",  bn: "মেহেদী আল রিদয়" },  phone: "01706544002" },
      { name: { en: "Mahfuzur Rahman",  bn: "মাহফুজুর রহমান" }, phone: "01521572275" },
    ],
  },

  // ---- RSVP --------------------------------------------------
  // Paste your Google Apps Script web-app URL here (README, step 2).
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbwEXSyZBNtZgePu2evezjPPL9Vl_wN6huZf78OXiC-QHZWrU1fdzNUXMrSYwS_8MsVo/exec",
  maxGuestsPerInvite: 6,

  bismillah: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
  ayah: "وَخَلَقْنَاكُمْ أَزْوَاجًا",

  text: {
    en: {
      langSwitch: "বাংলা",
      skip: "Skip",
      tapToOpen: "Tap the seal to open",
      forGuest: "For",
      guestDefault: "our dear guest",
      tapToContinue: "Tap to continue",

      bismillahTrans: "In the name of Allah, the Most Gracious, the Most Merciful",
      ayahTrans: "And We created you in pairs",
      ayahRef: "Surah An-Naba (78:8)",

      inviteLine1: "With the Blessing of Allah,",
      inviteLine2: "We cordially invite you to the Nikkah Ceremony of",
      brideShort: "Esmat",
      groomShort: "Nasif",
      brideFull: "Esmat Jahan Khan Bristi",
      brideParents: "(D/O. Mohammad Enamul Haque Khan\n& Saleha Begum)",
      and: "&",
      groomFull: "Md. Nasif Sarwar",
      groomParents: "(S/O. Md. Shahidul Islam\n& Nasima Akter)",
      scroll: "Scroll down",

      countdownHeading: "Countdown to our wedding",
      days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
      countdownDone: "Alhamdulillah, the day is here",

      saveHeading: "Save the date",
      saveDate: "5th December 2026, Saturday",
      addCalendar: "Add to Calendar",
      otherCalendar: "Apple / Outlook calendar (.ics)",

      timelineHeading: "Wedding timeline",

      venueHeading: "The venue",
      venueName: "Pepper Tree BD",
      venueAddress: "Madani Avenue, Satarkul, Dhaka, Bangladesh, 1212",
      viewMap: "Open in Google Maps",

      attireHeading: "Attire",
      attireBody: "We would love for you to celebrate with us in soft, light or pastel colours. Traditional and formal wear are both welcome.",
      attireClosing: "We can't wait to celebrate this special day with you!",

      rsvpHeading: "RSVP",
      rsvpSub: "Kindly let us know if you can join us",
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
      doneYes: "Thank you, {name}! See you there, In Sha Allah.",
      doneYesText: "We've received your RSVP.",
      doneNo: "Thank you for letting us know, {name}.",
      doneNoText: "We'll miss you. Please keep us in your duas.",
      change: "Change my answer",
      errName: "Please write your name.",
      errChoice: "Please choose whether you can come.",
      errNet: "Your RSVP didn't send. Check your internet connection and try again.",
      notConnected: "RSVP isn't connected yet. Add your Google Apps Script link to rsvpEndpoint in config.js.",

      contactsHeading: "For any inquiries",
      brideSide: "Bride's side",
      groomSide: "Groom's side",
      call: "Call",

      blessing1: "Jazakallahu khairan.",
      blessing2: "May Allah bless our union.",
      credit: "Designed and coded by the bride and groom.",
      joke: "We had to use our software engineering degrees somewhere.",
      musicOn: "Play music",
      musicOff: "Mute music",
    },

    bn: {
      langSwitch: "English",
      skip: "এড়িয়ে যান",
      tapToOpen: "সিলটি খোলার জন্য ক্লিক করুন",
      forGuest: "প্রিয়",
      guestDefault: "অতিথি",
      tapToContinue: "চালিয়ে যেতে চাপুন",

      bismillahTrans: "পরম করুণাময়, অসীম দয়ালু আল্লাহর নামে",
      ayahTrans: "আর আমি তোমাদের সৃষ্টি করেছি জোড়ায় জোড়ায়",
      ayahRef: "সূরা আন-নাবা (৭৮:৮)",

      inviteLine1: "মহান আল্লাহর রহমতে,",
      inviteLine2: "আমাদের শুভ আকদ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাচ্ছি",
      brideShort: "ইসমত",
      groomShort: "নাসিফ",
      brideFull: "ইসমত জাহান খান বৃষ্টি",
      brideParents: "(মোহাম্মদ এনামুল হক খান ও\nসালেহা বেগমের কন্যা)",
      and: "ও",
      groomFull: "মোঃ নাসিফ সারোয়ার",
      groomParents: "(মোঃ শহিদুল ইসলাম ও\nনাসিমা আক্তারের পুত্র)",
      scroll: "নিচে স্ক্রল করুন",

      countdownHeading: "আমাদের বিয়ের আর মাত্র কয়েকটা দিন...",
      days: "দিন", hours: "ঘণ্টা", minutes: "মিনিট", seconds: "সেকেন্ড",
      countdownDone: "আলহামদুলিল্লাহ, আজই সেই দিন",

      saveHeading: "তারিখটি মনে রাখবেন",
      saveDate: "৫ই ডিসেম্বর ২০২৬, শনিবার",
      addCalendar: "ক্যালেন্ডারে যোগ করুন",
      otherCalendar: "Apple / Outlook ক্যালেন্ডার (.ics)",

      timelineHeading: "অনুষ্ঠানসূচি",

      venueHeading: "অনুষ্ঠানস্থল",
      venueName: "পেপার ট্রি বিডি",
      venueAddress: "মাদানী অ্যাভিনিউ, সাতারকুল, ঢাকা, বাংলাদেশ, ১২১২",
      viewMap: "গুগল ম্যাপে দেখুন",

      attireHeading: "পোশাকের রং ও ধরন",
      attireBody: "আমাদের বিশেষ দিনটিকে আরও রঙিন করে তুলতে হালকা ও প্যাস্টেল রঙের পোশাকে আপনাদের পাশে পেলে আমরা খুবই আনন্দিত হব। ঐতিহ্যবাহী ও ফরমাল উভয় ধরনের পোশাকই সাদরে স্বাগত।",
      attireClosing: "এই বিশেষ দিনটি আপনাদের সাথে উদযাপনের অপেক্ষায় আছি!",

      rsvpHeading: "উপস্থিতি নিশ্চিত করুন",
      rsvpSub: "আপনি আসতে পারবেন কি না, অনুগ্রহ করে জানান",
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
      doneYesText: "আপনার উত্তর আমরা পেয়েছি।",
      doneNo: "জানানোর জন্য ধন্যবাদ, {name}।",
      doneNoText: "আপনাকে মিস করব। দোয়ায় রাখবেন।",
      change: "উত্তর বদলান",
      errName: "অনুগ্রহ করে আপনার নাম লিখুন।",
      errChoice: "আপনি আসছেন কি না বেছে নিন।",
      errNet: "পাঠানো যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।",
      notConnected: "RSVP এখনো যুক্ত হয়নি। config.js-এ rsvpEndpoint-এ Google Apps Script লিংক দিন।",

      contactsHeading: "যেকোনো প্রয়োজনে যোগাযোগ",
      brideSide: "কনে পক্ষ",
      groomSide: "বর পক্ষ",
      call: "কল",

      blessing1: "জাযাকাল্লাহু খাইরান।",
      blessing2: "আল্লাহ আমাদের বন্ধনে বরকত দিন।",
      credit: "এই ওয়েবসাইটটি বর ও কনে নিজেরাই ডিজাইন ও কোড করেছে।",
      joke: "সফটওয়্যার ইঞ্জিনিয়ারিং ডিগ্রিটা কোথাও তো কাজে লাগাতে হবে!",
      musicOn: "মিউজিক চালু করুন",
      musicOff: "মিউজিক বন্ধ করুন",
    },
  },
};
