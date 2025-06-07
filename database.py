import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv
import sys
import logging
from typing import Dict, Optional
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DB = os.getenv("MONGODB_DB", "newsbot")

if not MONGO_URI:
    logger.error("MONGODB_URI not found in environment variables!")
    sys.exit(1)

# Global database connection
client = None
db = None

def get_db():
    """Get database connection"""
    global client, db
    if db is None:
        try:
            # Try strict TLS first, then fallback to allow invalid certs
            try:
                logger.info("🔗 Trying MongoDB connection with strict TLS...")
                client = MongoClient(MONGO_URI, tls=True)
                client.admin.command('ping')
                logger.info("✅ Successfully connected to MongoDB with strict TLS!")
            except Exception as e1:
                logger.warning(f"⚠️ Strict TLS failed: {e1}")
                logger.info("🔗 Retrying with tlsAllowInvalidCertificates=True...")
                client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
                client.admin.command('ping')
                logger.info("✅ Successfully connected to MongoDB with fallback TLS!")
            
            db = client[MONGO_DB]
        except Exception as e:
            logger.error(f"❌ Failed to connect to MongoDB: {e}")
            logger.error("Please check:")
            logger.error("- Your Python version (should be 3.7+)")
            logger.error("- Your OpenSSL version (should support TLS 1.2)")
            logger.error("- Your Atlas IP whitelist and network access settings")
            logger.error("- That your connection string is correct and uses mongodb+srv://")
            sys.exit(1)
    return db

def init_db():
    """Initialize database connection and create indexes"""
    try:
        db = get_db()
        
        # Create indexes
        db.user_preferences.create_index("user_id", unique=True)
        db.guild_settings.create_index("guild_id", unique=True)
        db.categories.create_index("name", unique=True)
        db.news_cache.create_index([("url", 1)], unique=True)
        db.news_cache.create_index([("timestamp", 1)], expireAfterSeconds=3600)  # 1 hour TTL
        
        # Initialize default categories if none exist
        if db.categories.count_documents({}) == 0:
            default_categories = [
                ("general", "General news and updates"),
                ("technology", "Technology and innovation news"),
                ("business", "Business and financial news"),
                ("sports", "Sports news and updates"),
                ("entertainment", "Entertainment and celebrity news")
            ]
            for name, desc in default_categories:
                db.categories.insert_one({"name": name, "description": desc})
        
        logger.info("Database initialized successfully!")
        return db
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

def is_registered(user_id):
    db = get_db()
    doc = db.user_preferences.find_one({"user_id": user_id})
    return doc is not None

def register_user(user_id):
    db = get_db()
    db.user_preferences.update_one(
        {"user_id": user_id},
        {"$setOnInsert": {"user_id": user_id}},
        upsert=True
    )

def set_user_country(user_id, country):
    db = get_db()
    db.user_preferences.update_one(
        {"user_id": user_id},
        {"$set": {"country": country}},
        upsert=True
    )

def get_user_country(user_id):
    db = get_db()
    doc = db.user_preferences.find_one({"user_id": user_id})
    return doc.get("country", "us") if doc else "us"

def set_user_languages(user_id, languages):
    db = get_db()
    db.user_preferences.update_one(
        {"user_id": user_id},
        {"$set": {"languages": languages}},
        upsert=True
    )

def get_user_languages(user_id):
    db = get_db()
    doc = db.user_preferences.find_one({"user_id": user_id})
    return doc.get("languages", ["en"]) if doc else ["en"]

def get_all_categories():
    db = get_db()
    return {cat["name"]: cat["description"] for cat in db.categories.find({})}

def set_guild_news_channel(guild_id, channel_id):
    db = get_db()
    db.guild_settings.update_one(
        {"guild_id": guild_id},
        {"$set": {"news_channel_id": channel_id}},
        upsert=True
    )

def get_guild_news_channel(guild_id):
    db = get_db()
    doc = db.guild_settings.find_one({"guild_id": guild_id})
    return doc["news_channel_id"] if doc and "news_channel_id" in doc else None

def cache_news_article(url: str, article_data: Dict):
    """Cache a news article in the database"""
    try:
        db = get_db()
        db.news_cache.update_one(
            {"url": url},
            {
                "$set": {
                    "data": article_data,
                    "timestamp": datetime.utcnow()
                }
            },
            upsert=True
        )
    except Exception as e:
        logger.error(f"Error caching news article: {e}")

def get_cached_article(url: str) -> Optional[Dict]:
    """Get a cached news article from the database"""
    try:
        db = get_db()
        cached = db.news_cache.find_one({"url": url})
        if cached:
            # Check if cache is still valid (1 hour)
            if datetime.utcnow() - cached["timestamp"] < timedelta(hours=1):
                return cached["data"]
            else:
                # Remove expired cache
                db.news_cache.delete_one({"url": url})
        return None
    except Exception as e:
        logger.error(f"Error getting cached article: {e}")
        return None

def clear_expired_cache():
    """Clear expired cache entries"""
    try:
        db = get_db()
        db.news_cache.delete_many({
            "timestamp": {"$lt": datetime.utcnow() - timedelta(hours=1)}
        })
    except Exception as e:
        logger.error(f"Error clearing expired cache: {e}")
