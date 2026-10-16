# Nasif & Esmat — wedding invitation

An embossed ivory envelope with a glowing wax seal. Tap it and the flap opens, palace gates swing open, and the card appears: a mosque at sunset inside an arch, lanterns, birds and falling petals. Below that are two Quran verses, the formal invitation, a countdown, a scratch-to-reveal date, the timeline, the venue map, attire and an RSVP form that saves to Google Sheets. Every page works in English and বাংলা.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `config.js` | Every word, time, colour and link, in English **and** Bangla | **Yes — the only file you normally edit** |
| `index.html` | Page structure and all the drawings | No |
| `style.css` | Colours, fonts, animation | Only to change the look |
| `app.js` | Envelope, countdown, scratch card, language switch, RSVP | No |
| `google-apps-script/Code.gs` | The RSVP receiver you paste into Google Sheets | Paste once |
| `og-image.jpg` | Picture shown when the link is shared on WhatsApp | Optional |

## See it on your computer

Double-click `index.html`. Handy additions to the address:

- `?open=1` skips the envelope (useful while editing)
- `?lang=bn` opens in Bangla
- `?to=Rahman%20Family` shows a guest's personal envelope

## Things to fill in (`config.js`)

- **Parents' names** — `groomParents` / `brideParents` (English and Bangla). Empty = hidden.
- **Venue address line** — `venueAddress` (currently just "Dhaka, Bangladesh").
- **Timeline after lunch** — 3:30 pm "Photos & dessert" and 4:30 pm "Farewell & duas" are suggestions. Change or delete them.
- **RSVP deadline** — `rsvpDeadline` (currently 20 November 2026).
- **Music (optional)** — put an `.mp3` in this folder and write its name in `music`, e.g. `music: "music.mp3"`. A speaker button then appears and the music starts when the seal is tapped.

## Connect the RSVP to Google Sheets (about 10 minutes)

1. Go to [sheets.new](https://sheets.new) and name the sheet "Wedding RSVPs".
2. **Extensions → Apps Script**. Delete what's there, paste all of `google-apps-script/Code.gs`, click **Save**.
3. **Deploy → New deployment → ⚙ → Web app**. Execute as **Me**, access **Anyone**. Click **Deploy**.
4. Authorise it. If Google says "hasn't verified this app": **Advanced → Go to … (unsafe)** → **Allow**. That's normal for your own script.
5. Copy the **Web app URL** (ends in `/exec`) into `config.js` → `rsvpEndpoint: "…"`.
6. Send yourself a test RSVP and check the **RSVPs** tab in the sheet.

If you edit `Code.gs` later: **Deploy → Manage deployments → ✎ → Version: New version → Deploy**.

## Put it online (GitHub Pages, free)

```bash
cd ~/Documents/Essif-Evite
git add .
git commit -m "Wedding invitation"
git push -u origin main
```

Then on GitHub: **Settings → Pages → Deploy from a branch → main → / (root) → Save**. After 1–2 minutes the site is live at **https://nasifsarwar.github.io/Essif-Evite/**

Free GitHub Pages needs a **public** repository, so anyone with the link can see the names, date and venue. RSVP answers stay private in your Google Sheet.

## Personal links for guests

```
https://nasifsarwar.github.io/Essif-Evite/?to=Rahman%20Family
https://nasifsarwar.github.io/Essif-Evite/?to=Tanvir&lang=bn
```

The **Invite link name** column in the sheet shows which link each reply came from.
