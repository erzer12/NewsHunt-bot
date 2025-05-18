import os
import requests
import sys

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
if not NEWS_API_KEY:
    print("❌ NEWS_API_KEY is missing! Please check your .env file.", file=sys.stderr)

def fetch_top_headlines(country="us", count=5, breaking=False):
    if not NEWS_API_KEY:
        return []
    url = f"https://newsapi.org/v2/top-headlines?country={country}&apiKey={NEWS_API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    if data.get("status") == "ok":
        articles = data.get("articles", [])
        if breaking:
            # Simulate breaking as those with "breaking" in title/desc
            articles = [a for a in articles if 'breaking' in (a.get('title','') + a.get('description','')).lower()]
            if not articles:
                articles = data.get("articles", [])
        return articles[:count]
    return []

def fetch_news_by_category(category, count=5):
    if not NEWS_API_KEY:
        return []
    url = f"https://newsapi.org/v2/top-headlines?category={category.lower()}&apiKey={NEWS_API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    if data.get("status") == "ok":
        return data.get("articles", [])[:count]
    return []

def fetch_news_by_query(query, count=5):
    if not NEWS_API_KEY:
        return []
    url = f"https://newsapi.org/v2/everything?q={query}&sortBy=relevancy&apiKey={NEWS_API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    if data.get("status") == "ok":
        return data.get("articles", [])[:count]
    return []

def fetch_trending_news(count=5):
    if not NEWS_API_KEY:
        return []
    url = f"https://newsapi.org/v2/top-headlines?apiKey={NEWS_API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    if data.get("status") == "ok":
        return data.get("articles", [])[:count]
    return []
