import os
import requests
import logging
from typing import List, Dict, Optional
from dotenv import load_dotenv
from datetime import datetime, timedelta
import json
from database import cache_news_article, get_cached_article, clear_expired_cache

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

# Cache for storing API responses
CACHE_DURATION = timedelta(minutes=15)  # Cache for 15 minutes
api_cache = {}

def get_cached_data(cache_key: str) -> Optional[Dict]:
    """Get data from cache if it exists and is not expired"""
    if cache_key in api_cache:
        timestamp, data = api_cache[cache_key]
        if datetime.now() - timestamp < CACHE_DURATION:
            logger.info(f"Using cached data for {cache_key}")
            return data
    return None

def set_cache_data(cache_key: str, data: Dict):
    """Store data in cache with current timestamp"""
    api_cache[cache_key] = (datetime.now(), data)
    # Also cache individual articles in database
    if isinstance(data, list):
        for article in data:
            if "url" in article:
                cache_news_article(article["url"], article)

def make_api_request(url: str, params: Dict = None) -> Optional[Dict]:
    """Make API request with error handling and retries"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"API request failed: {e}")
        return None

def fetch_top_headlines(country: str = "us", count: int = 5, breaking: bool = False) -> List[Dict]:
    """Fetch top headlines from NewsAPI"""
    if not NEWS_API_KEY:
        logger.error("NewsAPI key is missing")
        return []
    
    cache_key = f"headlines_{country}_{breaking}"
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return cached_data[:count]
    
    try:
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "country": country,
            "apiKey": NEWS_API_KEY
        }
        
        logger.info(f"Fetching headlines for country: {country}")
        data = make_api_request(url, params)
        
        if data and data.get("status") == "ok":
            articles = data.get("articles", [])
            logger.info(f"Found {len(articles)} articles")
            
            if breaking:
                # Filter for breaking news
                breaking_articles = [a for a in articles if 'breaking' in (a.get('title','') + a.get('description','')).lower()]
                if breaking_articles:
                    articles = breaking_articles
                    logger.info(f"Found {len(articles)} breaking news articles")
                else:
                    # If no breaking news, get the most recent article
                    articles = articles[:1]
                    logger.info("No breaking news found, using most recent article")
            
            # Cache the results
            set_cache_data(cache_key, articles)
            return articles[:count]
        else:
            error_msg = data.get('message', 'Unknown error') if data else 'No response'
            logger.error(f"NewsAPI error: {error_msg}")
            return []
    except Exception as e:
        logger.error(f"Error fetching headlines: {e}")
        return []

def fetch_news_by_category(category: str, count: int = 5) -> List[Dict]:
    """Fetch news by category from NewsAPI"""
    if not NEWS_API_KEY:
        logger.error("NewsAPI key is missing")
        return []
    
    cache_key = f"category_{category}"
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return cached_data[:count]
    
    try:
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "category": category.lower(),
            "apiKey": NEWS_API_KEY
        }
        
        logger.info(f"Fetching news for category: {category}")
        data = make_api_request(url, params)
        
        if data and data.get("status") == "ok":
            articles = data.get("articles", [])
            logger.info(f"Found {len(articles)} articles for category {category}")
            
            # Cache the results
            set_cache_data(cache_key, articles)
            return articles[:count]
        else:
            error_msg = data.get('message', 'Unknown error') if data else 'No response'
            logger.error(f"NewsAPI error: {error_msg}")
            return []
    except Exception as e:
        logger.error(f"Error fetching category news: {e}")
        return []

def fetch_news_by_query(query: str, count: int = 5) -> List[Dict]:
    """Fetch news by query from NewsAPI"""
    if not NEWS_API_KEY:
        logger.error("NewsAPI key is missing")
        return []
    
    cache_key = f"query_{query}"
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return cached_data[:count]
    
    try:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": query,
            "sortBy": "relevancy",
            "apiKey": NEWS_API_KEY
        }
        
        logger.info(f"Fetching news for query: {query}")
        data = make_api_request(url, params)
        
        if data and data.get("status") == "ok":
            articles = data.get("articles", [])
            logger.info(f"Found {len(articles)} articles for query {query}")
            
            # Cache the results
            set_cache_data(cache_key, articles)
            return articles[:count]
        else:
            error_msg = data.get('message', 'Unknown error') if data else 'No response'
            logger.error(f"NewsAPI error: {error_msg}")
            return []
    except Exception as e:
        logger.error(f"Error fetching query news: {e}")
        return []

def fetch_trending_news(count: int = 5) -> List[Dict]:
    """Fetch trending news from NewsAPI"""
    if not NEWS_API_KEY:
        logger.error("NewsAPI key is missing")
        return []
    
    cache_key = "trending"
    cached_data = get_cached_data(cache_key)
    if cached_data:
        return cached_data[:count]
    
    try:
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "apiKey": NEWS_API_KEY
        }
        
        logger.info("Fetching trending news")
        data = make_api_request(url, params)
        
        if data and data.get("status") == "ok":
            articles = data.get("articles", [])
            logger.info(f"Found {len(articles)} trending articles")
            
            # Cache the results
            set_cache_data(cache_key, articles)
            return articles[:count]
        else:
            error_msg = data.get('message', 'Unknown error') if data else 'No response'
            logger.error(f"NewsAPI error: {error_msg}")
            return []
    except Exception as e:
        logger.error(f"Error fetching trending news: {e}")
        return []

def clear_cache():
    """Clear expired cache entries"""
    try:
        # Clear in-memory cache
        now = datetime.now()
        expired_keys = [k for k, (t, _) in api_cache.items() if now - t >= CACHE_DURATION]
        for k in expired_keys:
            del api_cache[k]
        
        # Clear database cache
        clear_expired_cache()
        
        logger.info("Cache cleared successfully")
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
