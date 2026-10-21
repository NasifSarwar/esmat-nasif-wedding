# Esmat & Nasif — wedding invitation

An ivory satin envelope with pearls and a glowing seal. Tap the seal and the two halves open like doors. Then the Bismillah (Arabic + English/Bangla) fades in and out, then Surah An-Naba 78:8, and then the invitation. Below it: countdown (navy band), save the date with Add to Calendar, timeline (navy band), venue map, attire, RSVP, contacts and the closing. Soft flute music plays on loop after the seal is tapped. Every page works in English and বাংলা.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `config.js` | Every word, time, phone number, colour and link, in English **and** Bangla | **Yes — the only file you normally edit** |
| `index.html` | Page structure and all the drawings | No |
| `style.css` | Colours, fonts, animation. The navy band colour is `--band` near the top | Only to change the look |
| `app.js` | Envelope, intro, countdown, calendar, language switch, RSVP | No |
| `music.mp3` | 0:00–1:02 of the flute instrumental, with soft fades so the loop is smooth | Replace to change the music |
| `google-apps-script/Code.gs` | The RSVP receiver you paste into Google Sheets | Paste once |
| `og-image.jpg` | Picture shown when the link is shared on WhatsApp | Optional |

## See it on your computer

Double-click `index.html`. Handy additions to the address:

- `?open=1` skips the envelope and intro (useful while editing)
- `?lang=bn` opens in Bangla
- `?to=Rahman%20Family` shows a guest's personal envelope

Music volume: `musicVolume` in `config.js` (0.35 now; 0 = silent, 1 = full). Browsers only allow music after a tap, so it starts when the seal is tapped.

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
