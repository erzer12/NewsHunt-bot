import feedparser
import urllib.parse

def fetch_rss_news(place, max_articles=5):
    query = urllib.parse.quote_plus(f"{place} news")
    rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
    feed = feedparser.parse(rss_url)
    articles = []
    for entry in feed.entries[:max_articles]:
        articles.append({
            "title": entry.title,
            "link": entry.link,
            "summary": entry.summary if "summary" in entry else "",
            "published": entry.published if "published" in entry else "",
        })
    return articles
