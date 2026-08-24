# How to update your site

Hi Rachael. This is your whole website. It is six pages of plain text files, and you can edit any of them from your web browser without installing anything.

**Nothing here can break permanently.** GitHub keeps a copy of every version, so any mistake can be undone in about thirty seconds. Instructions for that are at the bottom.

---

## The basics

### Where the pages live

| What you want to change | Open this file |
| --- | --- |
| The front page | `index.html` |
| The books page | `books/index.html` |
| The publications list | `publications/index.html` |
| The awards list | `awards/index.html` |
| Your bio and the contact form | `about/index.html` |
| The services page | `services/index.html` |

### How to edit a file

1. Go to your repository on github.com and click the file you want from the table above.
2. Click the **pencil icon** at the top right of the file.
3. Make your change.
4. Scroll to the bottom, type a short note about what you changed (for example, "add new poem in Nimrod"), and click **Commit changes**.

The live site updates about a minute later. Refresh the page and it will be there.

> **Tip:** if the file feels cramped in that little editor, press the `.` key while looking at your repository. That opens a full editor in your browser with all the files in a sidebar. It works the same way: edit, then commit.

### The one rule

Text lives **between** the pointy brackets, never inside them.

```
<div class="pub-title">&ldquo;urban planning&rdquo;</div>
                        ^^^^^^^^^^^^^^^^^^^^^^^^
                        only change this part
```

The `<div class="...">` and `</div>` bits are the scaffolding that makes it look right. Leave them exactly as they are, including the slashes and quote marks.

### Curly quotes and dashes

The site uses these little codes for typographic punctuation. Copy them as-is when you need them:

| Code | Shows up as |
| --- | --- |
| `&ldquo;` | " opening double quote |
| `&rdquo;` | " closing double quote |
| `&rsquo;` | ' apostrophe |
| `&amp;` | & ampersand |
| `&ndash;` | – en dash, for ranges like 2010–13 |

If you just type a normal `"` or `'` it will still work, it will only look slightly less polished.

---

## Common changes

### Add a publication

Open `publications/index.html`. Find the section you want (Poetry, Fiction, or Non-fiction) and you will see rows that look like this:

```html
<div><div class="pub-title">&ldquo;ornament&rdquo;</div><span class="caption">Coffin Bell</span></div>
```

Copy an entire line like that, paste it directly above or below, and change the poem title and the magazine name. Save.

Some rows have a third piece that shows a small orange note underneath, like this:

```html
<span class="note-badge">Best of the Net nominated, 2024</span>
```

If you copied a row that had one and your new poem does not need it, delete that whole `<span>...</span>` piece. If you want to add one to a row that does not have it, paste it in just before the final `</div>`.

### Add an award

Open `awards/index.html`. The rows look like this:

```html
<div class="award-row"><span class="award-year">2024</span><div><div class="pub-title" style="font-size:21px">Best of the Net Nominee</div><span class="caption">&ldquo;ornament&rdquo; · Coffin Bell</span></div></div>
```

There are three things to change: the year, the name of the award, and the caption underneath. The list is newest first, so paste your new row at the top.

To put a book title in italics inside a caption, wrap it: `<em class="serif">Brittle the Egg</em>`.

### Update the "Recent publications" or "Awards" boxes on the front page

The front page shows the three most recent of each. They are near the bottom of `index.html` and use the same kind of rows. Add your new one at the top of the list and delete the bottom one so it stays at three.

### Change your bio

Open `about/index.html`. Your bio is the long paragraph that starts with `<p class="lead" style="margin-top:32px">`. Rewrite everything between that tag and the closing `</p>`. Do not delete the tags themselves.

### Change the services page

Open `services/index.html`. The two service descriptions are the paragraphs after `<h2>Education</h2>` and `<h2>Editorial</h2>`. The bulleted items look like this:

```html
<li>Writing composition<span>All levels</span></li>
```

The first part is the service. The `<span>` part is the small grey line underneath, and you can leave it out entirely if you do not want one:

```html
<li>Manuscript consultation</li>
```

### Add a book

This one is more involved. Open `books/index.html`, find the block that starts with `<article class="book-entry"` for the book that most resembles the new one, and copy the whole block from `<article` through `</article>`. Then change the title, year, publisher, description, and purchase links.

You will also want to add a cover image. In your repository, open the `assets` folder, click **Add file → Upload files**, and drag the cover in. Then point the new block at it by changing the file name in `src="../assets/whatever-you-named-it.jpg"`.

Finally, add a matching card to the three-up grid on the front page in `index.html`.

### Change the year in the footer

The copyright year is at the bottom of every page. Search each file for `© 2026` and change it. There are six files, so it is six edits.

---

## Adding a whole new page

Say you want an Events page.

1. Copy `awards/index.html` (it is the simplest one) and save it as `events/index.html`. In the GitHub editor: **Add file → Create new file**, then type `events/index.html` as the name and paste the contents in.
2. In that new file, change the `<title>` and the big `<h1>` heading, and replace the body content.
3. Add the link to the menu in **all seven** files. In each one, find the line starting with `<nav class="main">` and the one starting with `<nav>` near the bottom, and add `<a href="../events/">Events</a>` in the right spot. On `index.html` only, it is `href="events/"` with no `../`.

That last step is the fiddly one. If you want a new page, it is probably easier to ask Alex.

---

## If something looks wrong

Do not panic and do not try to fix it by guessing. Undo it:

1. Go to your repository and click **Commits** (or the clock icon showing the commit history).
2. Find your most recent change in the list and click it.
3. Click the **`...`** menu at the top right and choose **Revert**.
4. Confirm.

The site goes back to how it was a minute later, and you can try the edit again.

You can also click **History** at the top of any individual file to see every version of just that file and what changed each time.

---

## Please do not type your email address into a page

This one is worth knowing, because it will look like something is broken when it is not.

Your email address is deliberately **not** written anywhere in these files. Spam robots crawl websites looking for anything shaped like an address, and they are very good at finding it. So instead, the address is scrambled in a separate file and the site unscrambles it in the visitor's browser at the moment the page loads. Every "email me" button on the site still works exactly as you would expect. It just does not sit there in the open waiting to be harvested.

That means if you are editing a page and you see something like this:

```html
<a data-mail data-mail-text href="../about/#contact">rachaeliwriting [at] gmail [dot] com</a>
```

**that is correct, please leave it as it is.** It will display as your real address on the live site. The `[at]` version is only what appears in the file.

If you want to add a new "email me" link somewhere, copy one of the existing ones rather than typing out `mailto:your@address.com`, which would undo the protection for that link.

If your email address ever changes, ask Alex. It is a one-line change but it is in a different file.

## Two things to know about the contact form

- The form on the About page is run by a free service called FormSubmit. Messages arrive in your Gmail as normal.
- If you ever change the site's domain name, the `_next` line in the form (in `about/index.html`) has the old domain written into it and needs updating, otherwise people see an error after they hit Send.
