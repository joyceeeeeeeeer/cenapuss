# Cenapus Website Deployment Guide

This site is static and ready to deploy to Vercel, Netlify, GitHub Pages, or Nginx static hosting.

## 1) Domain

- Production domain: `https://cenapus.com`
- `robots.txt` and `sitemap.xml` already point to this domain.

## 2) Pre-deploy checklist

- Confirm all pages load from `index.html`.
- Verify language routes:
  - English: `/index.html`
  - Chinese: `/zh/index.html`
  - Italian: `/it/index.html`
- Verify product pages:
  - `/products/600plus.html`
  - `/products/500fit.html`
  - `/products/400eco.html`
  - `/products/1200max.html`
- Replace placeholder SVGs with final photography/render assets when ready.

## 3) Deploy options

### Option A: Vercel

1. Import this folder as a static project.
2. Keep root as publish directory.
3. `vercel.json` is already included.
4. Set environment variable: `FEISHU_WEBHOOK_URL=<your-feishu-bot-webhook>`.

### Option B: Netlify

1. New site from folder/repo.
2. Publish directory: `.`
3. `netlify.toml` is already included.
4. Set environment variable: `FEISHU_WEBHOOK_URL=<your-feishu-bot-webhook>`.

### Option C: GitHub Pages

1. Push folder content to repository root (or `docs` branch).
2. **Preview at `https://USER.github.io/REPO/`:** do **not** commit a root `CNAME` file and leave **Custom domain** empty in **Settings → Pages**. A `CNAME` file (or that setting) tells GitHub to bind `cenapus.com` and **redirect** `github.io` traffic to the custom domain. HTML uses **document-relative** `href` / `src` (not root-absolute `/file.css`) so CSS and JS load under the `/REPO/` prefix; `nav.js` derives the same prefix from its own URL.
3. **Production on `cenapus.com` via GitHub Pages only:** add a `CNAME` file containing `cenapus.com` and configure DNS per GitHub Pages docs. (If production is on Vercel instead, use Vercel for DNS/domain; you still skip `CNAME` in the repo when you want `github.io` to stay a separate preview URL.)

## 4) Search engine submission

- Submit `https://cenapus.com/sitemap.xml` to:
  - Google Search Console
  - Bing Webmaster Tools

## 5) AI/SEO files included

- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- Schema.org JSON-LD in homepage and product pages
- FAQPage schema in `faq.html`

## 6) Feishu bot integration

- Frontend form posts to `/api/contact`.
- Vercel uses: `api/contact.js`
- Netlify uses: `netlify/functions/contact.js` with redirect in `netlify.toml`.
- Keep webhook URL in server environment only; do not expose in frontend code.

## 7) GitHub repository + Vercel (recommended for sharing)

Run these commands **on your Mac** in Terminal (from the project folder). If a broken `.git` folder exists from a failed init, remove it first: `rm -rf .git`.

```bash
cd /path/to/cenapus-site
git init -b main
git add -A
git commit -m "Initial commit: Cenapus static site (EN/ZH/IT, Vercel-ready)"
```

On GitHub: **New repository** → name it (e.g. `cenapus-site`) → **do not** add README / `.gitignore` / license (avoid merge conflicts). Then:

```bash
git remote add origin https://github.com/YOUR_USER/cenapus-site.git
git push -u origin main
```

On Vercel: **Add New… → Project** → **Import** that GitHub repo.

- **Framework Preset:** Other (static site).
- **Root Directory:** `.` (repository root).
- **Build Command:** leave empty.
- **Output Directory:** leave empty (not applicable for static export at root).
- **Environment Variables:** add `FEISHU_WEBHOOK_URL` if you use the contact form webhook.

After deploy, assign your domain in Vercel and point DNS as in section 1.

`.gitignore` in this repo excludes `.env*`, `.vercel`, and `node_modules/` so secrets and local tooling are not pushed by mistake.
