# CCAO-F Prep

Study and practice site for **Claude Certified Associate – Foundations (CCAO-F)**. It's a static site with no server, database or login, hosted on GitHub Pages.

## Run locally
Open `public/index.html` in a browser, or run `npm start` to serve `public/` at http://localhost:3000.

## Deploy
Every push to `main` deploys through `.github/workflows/pages.yml`.
One-time setup: in the repo go to **Settings → Pages → Source** and choose **GitHub Actions**.

## Content
- `public/data/lessons.js`: teaching content. Domain 0 is the exam overview; 1–7 are the exam domains.
- `public/data/questions.js`: quiz bank. Add a question with `q(domain, question, options, answerIndex | [indexes], explanation, tags)`. Answer indexes are 0-based; use 2 or more for multi-select.

## Modes
- **Quick mixed**: random questions with the answer and explanation shown right after each one.
- **By domain**: drill a single domain.
- **Full mock exam**: up to 60 questions picked by the real exam's domain weights, with a timer of 2 minutes per question. You review answers at the end.
- At the end of any quiz you can retry the questions you missed.
