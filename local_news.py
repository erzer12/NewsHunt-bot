import feedparser
import urllib.parse
import requests
from typing import List, Dict, Optional
import logging
from datetime import datetime, timedelta
import time
from functools import lru_cache
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiting settings
RATE_LIMIT_PER_MINUTE = 30  # Render free tier limit
RATE_LIMIT_PER_HOUR = 1000
CACHE_DURATION = 300  # 5 minutes cache

class RateLimiter:
    def __init__(self):
        self.requests = []
        self.lock = asyncio.Lock()
    
    async def check_rate_limit(self):
        async with self.lock:
            now = time.time()
            # Remove old requests
            self.requests = [req for req in self.requests if now - req < 60]
            
            if len(self.requests) >= RATE_LIMIT_PER_MINUTE:
                wait_time = 60 - (now - self.requests[0])
                if wait_time > 0:
                    logger.warning(f"Rate limit reached. Waiting {wait_time:.2f} seconds")
                    await asyncio.sleep(wait_time)
            
            self.requests.append(now)

rate_limiter = RateLimiter()

@lru_cache(maxsize=100)
def get_cached_rss_url(place: str, language: str, country: str) -> str:
    """Generate and cache RSS URL based on place and user preferences."""
    query = urllib.parse.quote_plus(f"{place} news")
    return f"https://news.google.com/rss/search?q={query}&hl={language}&gl={country.upper()}&ceid={country.upper()}:{language}"

async def fetch_rss_news(place: str, max_articles: int = 5, language: str = "en", country: str = "us") -> List[Dict]:
    """
    Fetch local news from RSS feeds with rate limiting and caching.
    
    Args:
        place: City or region name
        max_articles: Maximum number of articles to return
        language: Preferred language code
        country: Country code for regional news
    
    Returns:
        List of article dictionaries
    """
    try:
        # Check rate limit
        await rate_limiter.check_rate_limit()
        
        # Get cached RSS URL
        rss_url = get_cached_rss_url(place, language, country)
        
        # Parse feed with timeout
        feed = feedparser.parse(rss_url, timeout=10)
        
        if not feed.entries:
            logger.warning(f"No news found for {place}")
            return []
            
        articles = []
        for entry in feed.entries[:max_articles]:
            try:
                # Clean and validate the data
                title = entry.title.strip() if hasattr(entry, 'title') else ""
                link = entry.link.strip() if hasattr(entry, 'link') else ""
                summary = entry.summary.strip() if hasattr(entry, 'summary') else ""
                
                # Parse and format the date
                published = None
                if hasattr(entry, 'published'):
                    try:
                        published = datetime.strptime(entry.published, "%a, %d %b %Y %H:%M:%S %Z")
                    except ValueError:
                        published = datetime.now()
                
                if title and link:  # Only add if we have at least title and link
                    articles.append({
                        "title": title,
                        "link": link,
                        "summary": summary,
                        "published": published.strftime("%Y-%m-%d %H:%M") if published else "",
                        "source": "Google News"
                    })
            except Exception as e:
                logger.error(f"Error processing article: {str(e)}")
                continue
                
        return articles
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error fetching news for {place}: {str(e)}")
        return []
    except Exception as e:
        logger.error(f"Error fetching news for {place}: {str(e)}")
        return []
