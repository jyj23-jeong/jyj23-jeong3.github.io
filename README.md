# AI Trend Daily 🤖

A GitHub Pages website that automatically scrapes AI news from multiple sources and publishes daily summarized digests.

## Features

- **Daily automation** – A GitHub Actions workflow runs every day at 06:00 UTC, scraping the latest AI news and committing a new digest post.
- **Multiple sources** – Aggregates RSS feeds from TechCrunch AI, MIT Technology Review, The Verge, VentureBeat, Wired, Google DeepMind, OpenAI, Hugging Face, and more.
- **Extractive summarization** – Each article is automatically summarized using extractive NLP techniques (no API key required).
- **Jekyll site** – Dark-themed, responsive static site with RSS feed support.

## Sources

| Source | Tags |
|---|---|
| TechCrunch AI | industry |
| MIT Technology Review | research, analysis |
| The Verge – AI | industry |
| VentureBeat AI | industry, business |
| Wired – AI | analysis |
| AI News | industry |
| Google DeepMind Blog | research |
| OpenAI News | research, industry |
| Hugging Face Blog | research, open-source |
| Import AI (Jack Clark) | research, analysis |

## Running the scraper locally

```bash
pip install -r requirements.txt
python scripts/scraper.py
```

The script will generate a new `_posts/YYYY-MM-DD-ai-trend-digest.md` file.

## Local development

```bash
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`.

## Deployment

Push to `main` (or merge this PR) and GitHub Pages will automatically build and deploy the site. The daily workflow handles the rest.
