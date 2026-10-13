# Asane Solutions — website

Marketing and portfolio site for **Asane Solutions LLC** (engineering × cybersecurity).

**Stack:** plain HTML, CSS, and JavaScript with no build step. It's a content site with one form, so static files give the fastest load, no dependencies to maintain, and free hosting almost anywhere.

```
index.html            All page content and markup
css/styles.css        All styles (design tokens at the top)
js/main.js            Mobile menu, active-section highlight, scroll reveal
js/contact-form.js    Form validation + delivery (config at the top)
assets/favicon.svg    Favicon
```

The only external resource is Google Fonts (Archivo + IBM Plex Mono). If it can't load, the site falls back to system fonts.

## Run locally

Double-click `index.html`. It runs straight from the file system.

To serve it the way a host would (this gets anchor links and caching behavior right):

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Upload the folder as-is to any static host:

- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Cloudflare Pages / Vercel:** connect the repo. Leave the build command empty and set the publish directory to `/`.
- **Any web server:** copy the files into the web root.

## Before going live: replace the placeholders

Every placeholder has a visible **PLACEHOLDER** tag and an `<!-- PLACEHOLDER -->` comment. To find them all:

```sh
grep -n "PLACEHOLDER" index.html js/*.js
```

| What | Where |
|---|---|
| 9 case studies (one per capability) | `index.html`, `<details class="case is-placeholder">` blocks |
| Founder name, bio, "open to" line | `index.html`, §03 Profile |
| Résumé / LinkedIn / GitHub links | `index.html`, §03 Profile. Set the `href`, then remove `is-disabled`, `aria-disabled`, and the tag |
| Toolbox list | `index.html`, §03 Profile. List only tools you've actually used |
| Contact email and location | `index.html`, §05 Contact, **and** `CONTACT_CONFIG.email` in `js/contact-form.js` |

**Adding a real case study:** copy a `<details class="case">` block into the right capability. Remove the `is-placeholder` class and the `<span class="tag-placeholder">`, then fill in Problem / Approach / Outcome / Stack. Only use numbers you can back up. A capability can hold any number of cases.

**Résumé PDF:** put it at `assets/resume.pdf` and point the button at it.

## Contact form

The form validates in the browser: name, a properly formed email, and a message of at least 20 characters. A hidden honeypot field drops most bots. Delivery is set in `js/contact-form.js`:

- **Default (`endpoint: ""`):** opens the visitor's email app with the message already filled in. No setup needed, but it relies on the visitor having a mail app.
- **Recommended for production:** create a free form at a service like Formspree, Basin, or Getform and paste its URL into `endpoint`. The form then POSTs JSON to that URL and shows success or error messages on the page. No server needed.

## Design concept: "the drawing set"

The site is laid out like a set of engineering drawings. That fits a firm whose work is specified, built to standard, and documented.

- **Sheet-index navigation.** On desktop the menu is a fixed left rail, numbered `00–05` like a drawing index, with a marker on the current section. Under 1080px it becomes a top bar with a full-screen menu. Each section has a matching `§0X` label, plus corner crop marks.
- **Two tracks, one system.** The only bright colors on the site mark the two tracks: **amber = Track A, Engineering** and **cyan = Track B, Security**. Each track also has its own background texture (a square drafting grid vs. a dot matrix) and a large outlined track letter. Everything else is black and space grey (`#0b0b0c` → `#8a8d94`).
- **Both audiences in the first screen.** The hero states the value in one sentence, then offers two routes: *Hiring?* goes to the Profile, *Need a project done?* goes to the services. Just below, the capability ledger lists all nine services as jump links with codes (T-01…S-06). The same codes appear in the skills matrix, so each skill links straight to the case study that backs it up.
- **Fig. 1 diagram.** An inline SVG shows how the services fit together: main system ⇄ VPS tunnel ⇄ database, inside a cloud/IAM boundary, feeding a SIEM, governed by CIS/NIST. It loads instantly because it's code, not an image.
- **Typography.** Archivo condensed, uppercase, for headlines (engineered and dense). Archivo at normal width for reading. IBM Plex Mono for labels, codes, and data, the "annotation" layer.
- **Case studies as case files.** Each is a native `<details>` element with Problem / Approach / Outcome / Stack, collapsed by default so each service stays scannable. It needs no JavaScript and works with keyboards and screen readers.
- **Footer as a title block.** Firm, disciplines, doc/rev, date. A left-aligned grid instead of a centered sign-off.
- **Motion is minimal.** The diagram draws in once, then a packet moves across the tunnel. Sections fade up as you scroll. All of it turns off when the visitor's system asks for reduced motion.

### Adjusting it

- **Colors, fonts, spacing:** the `:root` block at the top of `css/styles.css`. Changing `--tech` or `--sec` re-colors that whole track.
- **Navigation:** the section `id`s in `index.html` must match the rail links. `main.js` picks them up automatically.
- **Adding or removing a capability:** copy or delete an `<article class="cap">`. Then update its entry in the hero ledger, the skills matrix, and the form's "Area of interest" list.
- **Engagement steps and terms (§04):** written as sensible defaults. Edit them to match how you actually work.
