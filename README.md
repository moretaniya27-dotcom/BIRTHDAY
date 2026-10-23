# Sakshi's Birthday Surprise

Plain HTML, CSS and vanilla JavaScript. No frameworks, no build step.

## Run locally (VS Code Live Server)
1. Open the `sakshi-birthday` folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click `index.html`, then "Open with Live Server".

## Add your assets (all optional, the site works without them)
- `assets/audio/birthday-music.mp3` : the music player disables itself if missing.
- `assets/images/thank-you.png` : download it yourself from the URL in your brief if you have permission; an SVG fallback shows otherwise.
- `assets/textures/paper-texture.png` : subtle paper texture; cards fall back to flat ivory.
- `sakshi-photo-1.jpg`, `sakshi-photo-2.jpg` : not used yet (photo section not built).

## Deploy to Vercel (static)
1. Push the folder to GitHub, or run `npm i -g vercel` then `vercel` inside the folder.
2. Framework preset: "Other". Build command: none. Output directory: `.`
3. Deploy.

## Notes
- The passkey is in `script.js` (`birthdayConfig`). It is a client-side gate, not real security.

## Test checklist
- [ ] Wrong passkey shakes the card and shows an error; letters are stripped, max 8 digits
- [ ] Correct passkey runs loading (about 3s) then welcome
- [ ] Welcome, Back and Continue work
- [ ] Envelope flap opens, letter rises, Open Letter appears
- [ ] Letter reveals line by line; "Show full letter" shows all
- [ ] Scratch with mouse and touch; about 40% reveals the coupon; keyboard reveal button works
- [ ] Wish dims the scene; Blow Out extinguishes flames; Cut shows knife and splits the cake
- [ ] Gift opens through bounce, ribbon, lid, light, then final page
- [ ] Final text reveals in stages; Thank You shows message; Replay resets everything
- [ ] Check widths 360, 390, 768, 1024, 1440 with no horizontal scroll
