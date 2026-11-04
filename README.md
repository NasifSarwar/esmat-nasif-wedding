# Esmat & Nasif — wedding invitation

An ivory satin envelope with pearls and a glowing seal. Tap the seal and the two halves open like doors. Then Surah An-Naba 78:8 fades in with our names and the date, and then the invitation (starting with the Bismillah). Below it: countdown (sage band), save the date with Add to Calendar, timeline (sage band), venue map, attire, RSVP, contacts (sage band) and the closing. Soft flute music plays on loop after the seal is tapped. Every page works in English and বাংলা.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `config.js` | Every word, time, phone number, colour and link, in English **and** Bangla | **Yes — the only file you normally edit** |
| `index.html` | Page structure and all the drawings | No |
| `style.css` | Colours, fonts, animation. The sage band colour is `--band` near the top | Only to change the look |
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
cd ~/Documents/Essif-Evite   # your local folder
git add .
git commit -m "Wedding invitation"
git push -u origin main
```

Then on GitHub: **Settings → Pages → Deploy from a branch → main → / (root) → Save**. After 1–2 minutes the site is live at **https://nasifsarwar.github.io/esmat-nasif-wedding/**

Free GitHub Pages needs a **public** repository, so anyone with the link can see the names, date and venue. RSVP answers stay private in your Google Sheet.

## Personal links for guests

```
https://nasifsarwar.github.io/esmat-nasif-wedding/?to=Rahman%20Family
https://nasifsarwar.github.io/esmat-nasif-wedding/?to=Tanvir&lang=bn
```

The **Invite link name** column in the sheet shows which link each reply came from.

## How RSVPs are stored

- **One row per guest**, identified by **phone number + name**. Phone is required.
- Same phone + same name again → that row is **updated** (latest answer wins). The guest sees "We've updated your earlier RSVP".
- Same phone + a different name → a **separate row** (family members sharing a phone).
- Numbers are matched in any format: `01711-617527`, `+880 1711 617527` and Bangla digits all count as the same number.
- The page shows Google's real answer: saved, updated, or an error with a clear message.

## Security

What is protected:

- **The page** only runs its own two scripts. A Content-Security-Policy (top of `index.html`) blocks any other script, plugin or form target, so injected code can't run.
- **Personal links** (`?to=…`) only keep letters, spaces and `. ' - &`, max 50 characters. Code or odd hidden characters in a link are stripped.
- **No secrets in the code.** The Google Apps Script URL is public by design: it can only *add* rows. Nobody can read, edit or delete your sheet through it.
- **The RSVP receiver (`Code.gs`)**:
  - checks every field and limits its length; anything else sent is ignored
  - neutralises spreadsheet formulas (`=HYPERLINK(...)` etc.)
  - hidden trap field + minimum fill time catch most spam bots
  - rate limits: 60 RSVPs a minute in total, 3 per person per 10 minutes
  - stops at 3,000 rows, so a flood can't fill your Drive
  - never shows error details to visitors (see them in Apps Script → Executions)

What you must keep doing:

- **Keep the Google Sheet private** (Share → "Restricted"). It holds guests' phone numbers.
- **After editing `Code.gs`**, redeploy: Deploy → Manage deployments → ✎ → Version: *New version* → Deploy.
- If spam ever gets through, delete the rows. If it keeps coming, make a new deployment (new URL), put it in `config.js` and push.

Limits (honest): this is a free static site with no login, so a determined person could still send fake-but-valid RSVPs slowly. That costs you a few junk rows, never your data.
