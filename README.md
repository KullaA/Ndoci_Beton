# Ndoci Beton

Locally runnable, dependency-free informative website. The starting folder contained only media, with no existing framework, package manager, or application to preserve. Node.js 20+ is sufficient; no package installation is required.

## Run and verify

```sh
npm run dev
```

Open http://localhost:3000. Stop the server with Ctrl+C.

```sh
npm test
npm run build
node scripts/serve.mjs --dist
```

The build outputs `dist/`, including only the used logo and any configured video/poster. Nothing is deployed.

## Editing

- `src/config.js`: confirmed operating year, completed-project count, phone, Maps link, optional email/WhatsApp, media paths, navigation, service and equipment categories. Service-area names and bilingual prose live in translations; corresponding city rows live in `index.html`.
- `src/translations.js`: all Albanian (`sq`) and English (`en`) content, navigation, accessibility labels, title and description. Keep both languages' keys aligned.
- `src/styles.css`: logo-derived colours, layouts, responsive breakpoints and motion preferences.
- `src/components.js`: reusable media component and equipment illustrations.
- `src/app.js`: language selection/persistence, menu behavior and content rendering.
- `index.html`: semantic page structure and initial Albanian metadata.

## Add the video later

Place your chosen video in `Media/company-video.mp4` and an optional poster in `Media/company-video-poster.jpg`. In `src/config.js`, set `media.videoSrc` to `'./Media/company-video.mp4'` and `media.poster` to `'./Media/company-video-poster.jpg'`. Use a broadly compatible MP4 with H.264 encoding. The component starts muted, inline and looping, exposes a translated pause/play control, and does not autoplay for reduced-motion visitors. The poster remains available before playback. With `videoSrc: null`, the area stays intentionally empty and makes no video request. Rebuild after changes.

## Add email or WhatsApp later

In `src/config.js`, replace `company.email: null` with the confirmed email address. A translated email action will then appear in contact. Set `company.whatsapp` only after confirming that channel, using a full `https://wa.me/...` URL. Both channels remain hidden while null. Rebuild after changes.

## Verification scope

Automated tests cover translation parity, content bindings, navigation targets, initial Albanian markup, confirmed links, unused contact channels, and local asset paths. Browser-based visual and interaction verification requires a browser tool; see the delivery notes for checks actually performed. The site uses progressive native anchor navigation, keyboard-accessible controls, Escape dismissal and focus return in the mobile menu. Explicit language selection is stored as `ndoci-language`; unavailable localStorage does not prevent switching.
