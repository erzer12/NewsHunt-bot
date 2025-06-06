import os
import requests
import logging
from typing import List, Dict, Optional
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
if not NEWS_API_KEY:
    logger.error("NEWS_API_KEY is missing! Please check your .env file.")
else:
    logger.info("NewsAPI key found in environment variables.")

def fetch_top_headlines(country: str = "us", count: int = 5, breaking: bool = False) -> List[Dict]:
    """Fetch top headlines from NewsAPI"""
    if not NEWS_API_KEY:
        logger.error("NewsAPI key is missing")
        return []
    
    try:
        url = f"https://newsapi.org/v2/top-headlines?country={country}&apiKey={NEWS_API_KEY}"
        logger.info(f"Fetching headlines for country: {country}")
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        
        data = resp.json()
        if data.get("status") == "ok":
            articles = data.get("articles", [])
            logger.info(f"Found {len(articles)} articles")
            if breaking:
                # Filter for breaking news
                articles = [a for a in articles if 'breaking' in (a.get('title','') + a.get('description','')).lower()]
                if not articles:
                    articles = data.get("articles", [])[:1]  # Get at least one article
                logger.info(f"Found {len(articles)} breaking news articles")
            return articles[:count]
        else:
            error_msg = data.get('message', 'Unknown error')
            logger.error(f"NewsAPI error: {error_msg}")
            return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching headlines: {e}")
        return []

def fetch_news_by_category(category: str, count: int = 5) -> List[Dict]:
    """Fetch news by category from NewsAPI"""
    if not NEWS_API_KEY:
        logger.error("NewsAPI key is missing")
        return []
    
    try:
        url = f"https://newsapi.org/v2/top-headlines?category={category.lower()}&apiKey={NEWS_API_KEY}"
        logger.info(f"Fetching news for category: {category}")
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        
        data = resp.json()
        if data.get("status") == "ok":
            articles = data.get("articles", [])
            logger.info(f"Found {len(articles)} articles for category {category}")
            return articles[:count]
        else:
            error_msg = data.get('message', 'Unknown error')
            logger.error(f"NewsAPI error: {error_msg}")
            return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching category news: {e}")
        return []

def fetch_news_by_query(query: str, count: int = 5) -> List[Dict]:
    """Fetch news by query from NewsAPI"""
    if not NEWS_API_KEY:
        logger.error("NewsAPI key is missing")
        return []
    
    try:
        url = f"https://newsapi.org/v2/everything?q={query}&sortBy=relevancy&apiKey={NEWS_API_KEY}"
        logger.info(f"Fetching news for query: {query}")
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        
        data = resp.json()
        if data.get("status") == "ok":
            articles = data.get("articles", [])
            logger.info(f"Found {len(articles)} articles for query {query}")
            return articles[:count]
        else:
            error_msg = data.get('message', 'Unknown error')
            logger.error(f"NewsAPI error: {error_msg}")
            return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching query news: {e}")
        return []

def fetch_trending_news(count: int = 5) -> List[Dict]:
    """Fetch trending news from NewsAPI"""
    if not NEWS_API_KEY:
        logger.error("NewsAPI key is missing")
        return []
    
    try:
        url = f"https://newsapi.org/v2/top-headlines?apiKey={NEWS_API_KEY}"
        logger.info("Fetching trending news")
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        
        data = resp.json()
        if data.get("status") == "ok":
            articles = data.get("articles", [])
            logger.info(f"Found {len(articles)} trending articles")
            return articles[:count]
        else:
            error_msg = data.get('message', 'Unknown error')
            logger.error(f"NewsAPI error: {error_msg}")
            return []
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching trending news: {e}")
        return []
