#!/usr/bin/env python3
"""
AI Trend News Scraper
Scrapes AI news from multiple RSS feeds, summarizes the articles,
and generates a Jekyll markdown post for GitHub Pages.
"""

import re
import os
import html
import time
import datetime
import textwrap
import unicodedata
from pathlib import Path
from urllib.parse import urlparse

try:
    import feedparser
except ImportError:
    raise ImportError("feedparser is required. Run: pip install feedparser")

try:
    import requests
    from requests.exceptions import RequestException
except ImportError:
    raise ImportError("requests is required. Run: pip install requests")

try:
    from bs4 import BeautifulSoup
except ImportError:
    raise ImportError("beautifulsoup4 is required. Run: pip install beautifulsoup4")

# ── Configuration ──────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "_posts"

# How many hours back to look for articles
HOURS_BACK = 48

# Maximum articles per source
MAX_PER_SOURCE = 5

# Maximum total articles in one digest
MAX_TOTAL = 25

# Summary length (sentences)
SUMMARY_SENTENCES = 4

# Request timeout (seconds)
REQUEST_TIMEOUT = 15

# RSS feeds to scrape
FEEDS = [
    {
        "name": "TechCrunch AI",
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
        "tags": ["industry"],
    },
    {
        "name": "MIT Technology Review",
        "url": "https://www.technologyreview.com/feed/",
        "tags": ["research", "analysis"],
    },
    {
        "name": "The Verge – AI",
        "url": "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
        "tags": ["industry"],
    },
    {
        "name": "VentureBeat AI",
        "url": "https://venturebeat.com/category/ai/feed/",
        "tags": ["industry", "business"],
    },
    {
        "name": "Wired – AI",
        "url": "https://www.wired.com/feed/tag/ai/latest/rss",
        "tags": ["analysis"],
    },
    {
        "name": "AI News",
        "url": "https://www.artificialintelligence-news.com/feed/",
        "tags": ["industry"],
    },
    {
        "name": "Google DeepMind Blog",
        "url": "https://deepmind.google/blog/rss.xml",
        "tags": ["research"],
    },
    {
        "name": "OpenAI News",
        "url": "https://openai.com/news/rss.xml",
        "tags": ["research", "industry"],
    },
    {
        "name": "Hugging Face Blog",
        "url": "https://huggingface.co/blog/feed.xml",
        "tags": ["research", "open-source"],
    },
    {
        "name": "Import AI (Jack Clark)",
        "url": "https://jack-clark.net/feed/",
        "tags": ["research", "analysis"],
    },
]

# ── Helpers ────────────────────────────────────────────────────────────────────

def clean_text(text: str) -> str:
    """Strip HTML tags, unescape entities, normalize whitespace."""
    if not text:
        return ""
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    # Unescape HTML entities
    text = html.unescape(text)
    # Normalize unicode
    text = unicodedata.normalize("NFKC", text)
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extractive_summary(text: str, n: int = SUMMARY_SENTENCES) -> str:
    """Return first *n* meaningful sentences of *text*."""
    text = clean_text(text)
    # Split into sentences
    sentences = re.split(r"(?<=[.!?])\s+", text)
    # Filter out very short or boilerplate sentences
    sentences = [
        s for s in sentences
        if len(s.split()) >= 6
        and not re.search(r"(cookie|subscribe|sign up|click here|advertisement)", s, re.I)
    ]
    selected = sentences[:n]
    summary = " ".join(selected)
    if len(summary) > 600:
        summary = summary[:597] + "…"
    return summary


def fetch_article_text(url: str) -> str:
    """Best-effort fetch of plain article text via requests + BeautifulSoup."""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; AITrendBot/1.0)"}
        resp = requests.get(url, timeout=REQUEST_TIMEOUT, headers=headers)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        # Remove nav, footer, ads, scripts
        for tag in soup(["script", "style", "nav", "footer", "aside", "form",
                          "header", "noscript", "figure"]):
            tag.decompose()
        # Try common article selectors
        for selector in ["article", "main", ".article-body", ".post-content",
                         ".entry-content", "#article-body", ".story-body"]:
            el = soup.select_one(selector)
            if el:
                return el.get_text(separator=" ")
        return soup.get_text(separator=" ")
    except Exception:
        return ""


def parse_date(entry) -> datetime.datetime:
    """Parse a feedparser entry's published date into a UTC datetime."""
    for attr in ("published_parsed", "updated_parsed", "created_parsed"):
        t = getattr(entry, attr, None)
        if t:
            return datetime.datetime(*t[:6], tzinfo=datetime.timezone.utc)
    return datetime.datetime.now(datetime.timezone.utc)


def is_ai_related(title: str, summary: str) -> bool:
    """Return True if the article is likely about AI."""
    text = (title + " " + summary).lower()
    keywords = [
        "artificial intelligence", "machine learning", "deep learning",
        "neural network", "large language model", "llm", "gpt", "chatgpt",
        "openai", "google ai", "deepmind", "anthropic", "claude", "gemini",
        "generative ai", "foundation model", "transformer", "diffusion",
        "natural language processing", "nlp", "computer vision", "robotics",
        "autonomous", "reinforcement learning", "agi", "ai ", " ai,", " ai.",
        "stable diffusion", "midjourney", "hugging face", "pytorch", "tensorflow",
    ]
    return any(kw in text for kw in keywords)


def slug(text: str) -> str:
    """Create a URL-safe slug from text."""
    text = clean_text(text).lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text[:60]


# ── Scraping ───────────────────────────────────────────────────────────────────

def scrape_feed(feed_info: dict, cutoff: datetime.datetime) -> list[dict]:
    """Parse a single RSS feed and return relevant recent articles."""
    articles = []
    url = feed_info["url"]
    source_name = feed_info["name"]
    print(f"  Fetching: {source_name}")
    try:
        parsed = feedparser.parse(url, request_headers={"User-Agent": "AITrendBot/1.0"})
    except Exception as exc:
        print(f"    ⚠ Failed to parse {url}: {exc}")
        return articles

    for entry in parsed.entries[:MAX_PER_SOURCE * 2]:
        pub_date = parse_date(entry)
        if pub_date < cutoff:
            continue

        title = clean_text(getattr(entry, "title", ""))
        if not title:
            continue

        link = getattr(entry, "link", "")
        raw_summary = (
            getattr(entry, "summary", "")
            or getattr(entry, "description", "")
            or getattr(entry, "content", [{}])[0].get("value", "")
        )
        summary_text = clean_text(raw_summary)

        # Filter non-AI articles from general feeds
        if not is_ai_related(title, summary_text):
            continue

        # Try to get richer summary from article body if feed summary is thin
        if len(summary_text.split()) < 30 and link:
            time.sleep(0.5)
            body = fetch_article_text(link)
            if body:
                summary_text = body

        summary = extractive_summary(summary_text)

        articles.append(
            {
                "title": title,
                "url": link,
                "source": source_name,
                "tags": feed_info.get("tags", []),
                "date": pub_date,
                "summary": summary or "Read the full article for details.",
            }
        )

        if len(articles) >= MAX_PER_SOURCE:
            break

    print(f"    → {len(articles)} articles")
    return articles


def scrape_all() -> list[dict]:
    """Scrape all configured feeds and return deduplicated articles."""
    now = datetime.datetime.now(datetime.timezone.utc)
    cutoff = now - datetime.timedelta(hours=HOURS_BACK)
    print(f"Scraping AI news (since {cutoff.strftime('%Y-%m-%d %H:%M')} UTC)…\n")

    all_articles = []
    seen_urls: set[str] = set()
    seen_titles: set[str] = set()

    for feed in FEEDS:
        articles = scrape_feed(feed, cutoff)
        for art in articles:
            url_key = art["url"].rstrip("/")
            title_key = slug(art["title"])
            if url_key in seen_urls or title_key in seen_titles:
                continue
            seen_urls.add(url_key)
            seen_titles.add(title_key)
            all_articles.append(art)

    # Sort newest first
    all_articles.sort(key=lambda a: a["date"], reverse=True)
    return all_articles[:MAX_TOTAL]


# ── Post Generation ────────────────────────────────────────────────────────────

def group_by_source(articles: list[dict]) -> dict[str, list[dict]]:
    groups: dict[str, list[dict]] = {}
    for art in articles:
        groups.setdefault(art["source"], []).append(art)
    return groups


def build_markdown(articles: list[dict], date: datetime.date) -> str:
    """Build the Jekyll-compatible markdown content for a daily digest post."""
    total = len(articles)

    groups = group_by_source(articles)
    sources_used = list(groups.keys())

    lines = []
    lines.append(f"Today's AI digest covers **{total} articles** from "
                 f"**{len(sources_used)} sources**: "
                 + ", ".join(f"*{s}*" for s in sources_used) + ".")
    lines.append("")
    lines.append("<hr class='section-divider' />")
    lines.append("")

    for source, arts in groups.items():
        lines.append(f"## {source}")
        lines.append("")
        for art in arts:
            pub_time = art["date"].strftime("%H:%M UTC")
            lines.append('<div class="news-item">')
            lines.append(f'<div class="news-item-title">')
            lines.append(f'<a href="{art["url"]}" target="_blank" rel="noopener">{art["title"]}</a>')
            lines.append('</div>')
            tag_html = " ".join(
                f'<span class="source-tag">{t}</span>' for t in art["tags"]
            )
            lines.append(
                f'<div class="news-item-meta">'
                f'<span>🕐 {pub_time}</span>'
                f'<span>{tag_html}</span>'
                f'</div>'
            )
            lines.append(f'<div class="news-item-summary">{art["summary"]}</div>')
            lines.append('</div>')
            lines.append("")

    return "\n".join(lines)


def write_post(articles: list[dict]) -> Path:
    """Write the Jekyll post file and return its path."""
    today = datetime.date.today()
    date_str = today.strftime("%Y-%m-%d")
    # Use cross-platform day formatting (no leading zero)
    human_date = f"{today.strftime('%B')} {today.day}, {today.year}"
    title = f"AI Trend Digest – {human_date}"
    filename = POSTS_DIR / f"{date_str}-ai-trend-digest.md"

    POSTS_DIR.mkdir(parents=True, exist_ok=True)

    sources = list({a["source"] for a in articles})
    content_body = build_markdown(articles, today)

    front_matter = textwrap.dedent(f"""\
        ---
        layout: post
        title: "{title}"
        date: {date_str} 06:00:00 +0000
        author: AI Trend Bot
        source_count: {len(articles)}
        categories: [{', '.join(sources[:3])}]
        excerpt: "AI news digest for {human_date}: {len(articles)} articles from {len(sources)} sources covering the latest in artificial intelligence."
        ---
    """)

    filename.write_text(front_matter + "\n" + content_body, encoding="utf-8")
    print(f"\n✅  Post written → {filename.relative_to(REPO_ROOT)}")
    return filename


# ── Entry Point ────────────────────────────────────────────────────────────────

def main():
    articles = scrape_all()

    if not articles:
        print("\n⚠  No articles found in the last 48 hours. Skipping post generation.")
        return

    print(f"\nTotal: {len(articles)} articles collected.")
    path = write_post(articles)
    print(f"Done. Post: {path}")


if __name__ == "__main__":
    main()
