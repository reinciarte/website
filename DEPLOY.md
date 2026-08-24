# Deploying: GitHub Pages + Namecheap

Notes for Alex. Everything here is one-time setup except step 5, which needs doing once after the site is live.

Working assumption: `rachaelinciarte.com` is now registered at Namecheap, and the site should end up at `https://www.rachaelinciarte.com` with the apex redirecting to it. That matches the `CNAME` file already in this repo.

---

## 1. Repo name and visibility

### Name

**It does not matter.** Since the site is served on a custom domain, GitHub's repo name never appears in a URL. Call it `rachaelinciarte.com` so it is obvious what it is.

The one name with special behavior is `<username>.github.io`, which GitHub treats as your personal "user site" and serves at the root of that domain. You only get one per account, and you do not need it here. A normal project repo is fine.

Worth knowing: every path in this site is relative (`books/`, `../site.css`, `./`), so it works correctly whether it is served from a domain root or from a `/reponame/` subpath. That means you can preview it at `https://<username>.github.io/rachaelinciarte.com/` before the DNS is pointed, and nothing will be broken.

### Public or private

You said private would be better. The honest answer is that private does less for you than it sounds like it does, and it costs money:

- **GitHub Pages will not publish from a private repo on the free plan.** It needs GitHub Pro ($4/month) or a Team plan. On Free, the repo has to be public or Pages simply will not build.
- **A private repo does not make the site private.** The published HTML is served to the whole internet either way, and it is byte for byte the same content that is in the repo. There is nothing in this project that is secret: no keys, no credentials, no database. The only things private actually hides are the commit history and the three markdown docs.

So the question is really "do I mind the commit history being visible," and for a poetry site the answer is probably no.

**Recommendation: make it public and use GitHub Pages.** It is free, it is the least moving parts, and there is nothing to protect.

**If you want private anyway,** you have two options:

| Option | Cost | Notes |
| --- | --- | --- |
| GitHub Pro | $4/month | Pages works from a private repo, everything below applies unchanged |
| Cloudflare Pages | Free | Deploys from a private GitHub repo, free custom domain and HTTPS. Easiest if you move the nameservers to Cloudflare, which is also free. The DNS steps below would be replaced by Cloudflare's own flow. |

Either way, I have already added a `_config.yml` that keeps `README.md`, `DEPLOY.md` and `EDITING.md` out of the published site, so those three files are not reachable at `rachaelinciarte.com/README.md` even with a public repo.

---

## 2. Push the site, without the CNAME file

1. Create the repo on GitHub. Do not let it add a README, a license, or a `.gitignore`, since the repo root needs to be the site root.
2. **Leave `CNAME` out of the first commit.** This matters, see the box below.
3. From this folder:

```bash
git init
git add .
git reset CNAME          # keep it on disk, keep it out of this commit
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<username>/rachaelinciarte.com.git
git push -u origin main
```

The files must be at the **repo root**, not inside a subfolder. `index.html` should be the first thing you see on the repo page.

> ### Why the CNAME file has to wait
>
> The `CNAME` file is how GitHub Pages learns about a custom domain. The moment it sees one, it starts **301-redirecting** `https://<username>.github.io/<repo>/` to that domain.
>
> Since the DNS is not pointed yet, that redirect lands on nothing. You would get a dead page instead of a preview, and it would look like the site is broken when it is fine.
>
> So: push without it, preview on the github.io URL, and add it at step 4 when the DNS is actually ready. You do not have to add it back by hand. Typing the domain into Settings → Pages writes the `CNAME` file into the repo for you and commits it.
>
> If you already pushed it, just remove it for now:
>
> ```bash
> git rm --cached CNAME && git commit -m "Hold CNAME until DNS is ready" && git push
> ```
>
> Then clear the Custom domain box in Settings → Pages if GitHub has already filled it in.

---

## 3. Turn on Pages

Repo → **Settings** → **Pages**:

- **Source:** `Deploy from a branch`
- **Branch:** `main`, folder `/ (root)` → **Save**

Give it a minute, then open:

```
https://<username>.github.io/rachaelinciarte.com/
```

The whole site works at that URL. Every path in the project is relative, so nothing cares that it is being served from a `/rachaelinciarte.com/` subpath instead of a domain root. This is a real, shareable link, so it is also the way to let Rachael look the site over and ask for changes before anything points at the live domain.

Doing it in this order means that if something breaks after the DNS switch, you know it is DNS and not the site.

The **Custom domain** box in Settings → Pages should be empty at this stage. If GitHub has filled it in, the `CNAME` file made it into the repo. Clear the box and remove the file, per the note in step 2, or the github.io URL will just redirect you to a domain that does not resolve yet.

### Two things that behave differently on the preview URL

- **The contact form's redirect.** The `_next` field sends people to `https://www.rachaelinciarte.com/thanks/` after submitting, which is not live yet. Do not judge the form on the preview URL. It gets activated and tested at step 5, after the domain is working.
- **Nothing else.** No other absolute URL in the site refers to the domain, so every page, link, image and style renders exactly as it will on the real thing.

### Even faster, just for you

To look at changes on your own machine without pushing at all, from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. That serves the site at a root path, no build step, no GitHub involved. Ctrl-C to stop it.

---

## 4. DNS at Namecheap

### 4a. Check the nameservers first

This is the step people skip and then spend an hour debugging. A transferred domain often still points at the old provider's nameservers, in which case nothing you type into Namecheap's DNS tab has any effect.

Namecheap → **Domain List** → **Manage** on the domain → the **NAMESERVERS** dropdown on the Domain tab.

It must say **Namecheap BasicDNS**. If it still lists Squarespace's nameservers, switch it to Namecheap BasicDNS and save. Allow up to a few hours for that to settle.

### 4b. Clear out the defaults

Go to the **Advanced DNS** tab. Namecheap ships new domains with parking records that will fight with yours. Delete these if present:

- `CNAME Record` on host `www` pointing at `parkingpage.namecheap.com.`
- `URL Redirect Record` on host `@`
- Any leftover `A` or `CNAME` records from Squarespace

**Do not delete `MX` records or a `TXT` record starting with `v=spf1` without checking first.** If she has email on this domain, those are what make it work. If her email is plain Gmail at `@gmail.com` (which it is), there is probably nothing to preserve, but look before you delete.

### 4c. Add the GitHub records

Still on **Advanced DNS** → **Add New Record**. TTL can stay on `Automatic` for all of them.

| Type | Host | Value |
| --- | --- | --- |
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME Record | `www` | `<username>.github.io.` |

Note the trailing dot on the CNAME value. Namecheap usually adds it for you; if it complains, that is why.

Optionally add IPv6 as well, which costs nothing and helps a little:

| Type | Host | Value |
| --- | --- | --- |
| AAAA Record | `@` | `2606:50c0:8000::153` |
| AAAA Record | `@` | `2606:50c0:8001::153` |
| AAAA Record | `@` | `2606:50c0:8002::153` |
| AAAA Record | `@` | `2606:50c0:8003::153` |

The four A records on the apex are what let `rachaelinciarte.com` (no www) reach GitHub, which then redirects it to the www version because that is what the `CNAME` file says.

### 4d. Point GitHub at the domain

Back in repo → **Settings** → **Pages** → **Custom domain**, enter:

```
www.rachaelinciarte.com
```

Save. GitHub writes the `CNAME` file back into the repo for you as a commit, then runs a DNS check. Once it passes you get a green "DNS check successful."

From this point the github.io URL redirects to the custom domain, which is the behavior you want now that the domain resolves.

Then tick **Enforce HTTPS**. This checkbox is greyed out until GitHub has provisioned a Let's Encrypt certificate for the domain, which usually takes a few minutes but is documented as taking up to 24 hours. Come back and tick it. Do not skip it.

### 4e. Verify

```bash
dig +short rachaelinciarte.com          # expect the four 185.199.x.153 addresses
dig +short www.rachaelinciarte.com      # expect <username>.github.io, then those addresses
curl -sI https://www.rachaelinciarte.com | head -1        # expect HTTP/2 200
curl -sI https://rachaelinciarte.com | head -2            # expect a 301 to the www version
```

If `dig` returns nothing or returns old Squarespace addresses, you are looking at DNS caching or at step 4a. Wait it out; propagation is usually minutes on Namecheap but the advertised window is 48 hours.

---

## 5. Get the contact form working

The form on `/about/` uses [FormSubmit](https://formsubmit.co), which is free, needs no account, and requires no backend. It does need one activation step, and it has to happen **after** the site is live on the real domain.

1. Go to `https://www.rachaelinciarte.com/about/` and submit the form with anything.
2. FormSubmit sends a confirmation email to her Gmail. Someone has to open it and click the activation link, once. Until that happens, submissions go nowhere.
3. That same email contains a **random alias endpoint**, something like `https://formsubmit.co/a1b2c3d4e5f6...`.
4. Open `about/index.html` and replace the form's action with the alias:

   ```html
   <form class="contact" action="https://formsubmit.co/a1b2c3d4e5f6..." method="POST">
   ```

   There is a `<!-- SETUP: ... -->` comment sitting directly above that line so it is easy to find. Delete the comment once you have done it.
5. Commit, wait a minute, and submit the form again to confirm it arrives and that you land on `/thanks/`.

Step 4 matters for more than tidiness: the form action is the last place in the whole site where her address appears in plain text. Swapping in the alias removes it.

### Things to know about the form

- **`_next`** is the hidden field that controls where people land after submitting. It is set to `https://www.rachaelinciarte.com/thanks/`. It must be the full URL including `https://`. If the domain ever changes, this breaks silently and people see a FormSubmit page instead of the thank you page.
- **`_honey`** is a honeypot: an invisible field that humans never fill in and naive bots always do. FormSubmit discards anything that fills it. Leave it alone.
- **Captcha is on by default.** FormSubmit shows a challenge before delivering. You can turn it off by adding a `_captcha` field set to `false`, but given the spam question, leave it on.
- If the emails look ugly, adding `<input type="hidden" name="_template" value="table">` formats them as a table.

---

## 6. What I did about the email address

You asked for basic defense against harvesters. Here is what changed and, more usefully, what it does and does not buy you.

### What changed

Every `mailto:` link in the site is now built at runtime by `email.js`, from a base64 string. There is no longer any `something@something.tld` pattern anywhere in the served HTML, so a scraper doing a regex sweep over the page source finds nothing at all.

The markup looks like this now:

```html
<a class="btn btn-dark" data-mail href="about/#contact">Get in touch</a>
```

`email.js` finds anything with `data-mail` and fills in the real `mailto:`. Two optional attributes:

- `data-mail-text` also replaces the link's visible text with the address (used for the footer button)
- `data-subject="Editorial Services"` adds a pre-filled subject line (used on the services page)

**It degrades gracefully.** With JavaScript off, nothing is broken and nothing looks wrong: every one of those links still has a real `href` pointing at the contact form on `/about/`, so the visitor gets to a working way of reaching her. The two places that display the address as visible text fall back to reading `rachaeliwriting [at] gmail [dot] com`, which a person can parse and a bot mostly cannot.

To change the address later, run:

```bash
python3 -c "import base64; print(base64.b64encode(b'new@address.com').decode())"
```

and paste the result into the one string in `email.js`. It is the only place the address lives.

### What this actually stops

Being straight with you: this defeats the large majority of address harvesters, which are dumb crawlers that fetch raw HTML and regex it. It does **not** defeat a scraper running a headless browser, because that executes the JavaScript and sees the same thing a person does. Nothing you can put on a public web page defeats that. The claim here is "meaningfully fewer," not "immune."

Two gaps that remain after this:

1. **The form action** still has the plain address in it until you do step 5.4 above. Do that step.
2. **If the repo is public,** the address is also sitting in `README.md`, `EDITING.md` and this file on github.com. Those are excluded from the published site, but the repo itself is indexed. If that bothers you, that is a genuine argument for the private repo.

### The stronger option, if spam becomes real

Stop publishing her personal Gmail at all. Namecheap includes free email forwarding on domains registered with them, so you can set up something like `hello@rachaelinciarte.com` that forwards into her existing Gmail, and put that on the site instead. She keeps reading mail in exactly the same inbox.

The advantage is that the published address becomes disposable. If it gets scraped and buried, you change the forwarding address and every piece of spam aimed at the old one stops dead, with no effect on her actual account.

It is under Domain List → Manage → the **Redirect Email** section. One caveat: enabling it adds MX records to the domain, so if any real mail service ever gets set up on `rachaelinciarte.com`, the two will conflict and you will need to sort out which one owns the MX records.

---

## Quick reference

| Thing | Where |
| --- | --- |
| Preview URL (before DNS) | `https://<username>.github.io/<repo>/`, only works while `CNAME` is out of the repo |
| Local preview | `python3 -m http.server 8000` in this folder |
| Pages settings | Repo → Settings → Pages |
| DNS | Namecheap → Domain List → Manage → Advanced DNS |
| Nameservers | Namecheap → Domain List → Manage → Domain tab |
| GitHub Pages IPs | `185.199.108-111.153` |
| Form dashboard | formsubmit.co, no login, keyed off the email |
| Address lives in | `email.js` (base64), and the form action in `about/index.html` |
| Docs kept off the live site by | `_config.yml` |
