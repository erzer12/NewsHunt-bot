import os
import requests

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def fetch_top_headlines(country="us", count=5, breaking=False):
    url = f"https://newsapi.org/v2/top-headlines?country={country}&apiKey={NEWS_API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    if data.get("status") == "ok":
        articles = data.get("articles", [])
        if breaking:
            articles = [a for a in articles if a.get('description') and 'breaking' in a.get('description', '').lower()]
            if not articles:
                articles = data.get("articles", [])
        return articles[:count]
    return []

def fetch_news_by_category(category, count=5):
    url = f"https://newsapi.org/v2/top-headlines?category={category.lower()}&apiKey={NEWS_API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    if data.get("status") == "ok":
        return data.get("articles", [])[:count]
    return []

def fetch_news_by_query(query, count=5):
    url = f"https://newsapi.org/v2/everything?q={query}&sortBy=relevancy&apiKey={NEWS_API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    if data.get("status") == "ok":
        return data.get("articles", [])[:count]
    return []

def fetch_trending_news(count=5):
    url = f"https://newsapi.org/v2/top-headlines?apiKey={NEWS_API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    if data.get("status") == "ok":
        return data.get("articles", [])[:count]
    return []
