# rachaelinciarte.com — static site

Plain HTML + one CSS file. No build step, no dependencies. Every page is a folder with an `index.html`, so URLs stay clean and match the old Squarespace paths (`/books/`, `/publications/`, `/awards/`, `/about/`).

```
index.html            Home
books/                Books & chapbooks (anchors: #seed #writing #lola)
publications/         Poetry / Fiction / Non-fiction
awards/               Awards, nominations, fellowships
services/             Education + editorial services
about/                Bio + contact form
thanks/               Form success page
assets/               Covers + Eric Hoffer seal
site.css              All styles (design tokens at the top)
email.js              Builds mailto: links at runtime (see "Email address" below)
CNAME                 Custom domain for GitHub Pages
_config.yml           Keeps the .md docs out of the published site
DEPLOY.md             GitHub Pages + Namecheap DNS + form setup (for Alex)
EDITING.md            Plain-English editing guide written for Rachael
```

## Setup

See **`DEPLOY.md`** for the full walkthrough: repo naming and the public/private tradeoff, pushing, turning on Pages, the Namecheap DNS records, and activating the contact form. It is written to be followed once, in order.

## Email address

There is no plain-text email address anywhere in the served HTML. `email.js` builds every `mailto:` at runtime from a base64 string, so a regex sweep of the page source turns up nothing.

Markup:

```html
<a data-mail href="about/#contact">Get in touch</a>
<a data-mail data-mail-text href="about/#contact">rachaeliwriting [at] gmail [dot] com</a>
<a data-mail data-subject="Editorial Services" href="../about/#contact">Editorial inquiry</a>
```

- `data-mail` on any `<a>` gets its `href` replaced with the real `mailto:`
- `data-mail-text` also replaces the visible text with the address
- `data-subject` pre-fills a subject line

The `href` you write in the HTML is the no-JavaScript fallback, so point it at `/about/#contact`. Never hardcode a `mailto:` back into a page.

To change the address, re-encode it and replace the one string in `email.js`:

```bash
python3 -c "import base64; print(base64.b64encode(b'new@address.com').decode())"
```

The remaining exception is the FormSubmit `action` on `/about/`, which is fixed by swapping in the alias endpoint. `DEPLOY.md` step 5 covers it.

## Editing content

`EDITING.md` is the non-technical version of this section, written for Rachael to follow on her own from the GitHub web editor. Point her at that file, not this one.

- **A new book:** copy an `<article class="book-entry">` block in `books/index.html`, and a card in the home grid.
- **A new publication/award:** copy a row `<div>` in the matching `rowlist`.
- **A new page** (e.g. events): make a folder `events/index.html`, copy any page's header/footer, add the nav link to every page's header and footer (7 files).
- Colors, fonts and spacing all live at the top of `site.css` as CSS variables.

### Nav and footer are duplicated

There is no templating, so the header nav and footer nav are copy-pasted into all seven pages. Any nav change is a seven-file find-and-replace. Same for the `© 2026` line and the social links.

Social links live in the footer of every page except `/thanks/`, as a `.socials` block right under the email button:

- Instagram: `https://www.instagram.com/rachaeliwriting/`
- LinkedIn: `https://www.linkedin.com/in/rachael-inciarte`

## Still placeholder

- Purchase links on the Seed entry point at the retailers' homepages — replace with the book's real product URLs.
- `© 2026` in every footer.

## Not carried over from Squarespace

The old site's nav also had a **Paper Wasp Press** item and a separate **Contact** page. Contact is folded into `/about/`; Paper Wasp Press was left out. Add it if she wants it back.
