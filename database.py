import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv
import sys
import logging
from typing import Dict, Optional
from datetime import datetime, timedelta

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DB = os.getenv("MONGODB_DB", "newsbot")

if not MONGO_URI:
    print("❌ MONGODB_URI not found in environment variables!", file=sys.stderr)
    sys.exit(1)

# Try strict TLS first, then fallback to allow invalid certs
try:
    print("🔗 Trying MongoDB connection with strict TLS...")
    client = MongoClient(MONGO_URI, tls=True)
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB with strict TLS!")
except Exception as e1:
    print(f"⚠️ Strict TLS failed: {e1}")
    print("🔗 Retrying with tlsAllowInvalidCertificates=True...")
    try:
        client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB with fallback TLS!")
    except Exception as e2:
        print(f"❌ Failed to connect to MongoDB: {e2}", file=sys.stderr)
        print("Please check:")
        print("- Your Python version (should be 3.7+)")
        print("- Your OpenSSL version (should support TLS 1.2)")
        print("- Your Atlas IP whitelist and network access settings")
        print("- That your connection string is correct and uses mongodb+srv://")
        sys.exit(1)

db = client[MONGO_DB]

def init_db():
    """Initialize database connection and create indexes"""
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URI)
        db = client.news_bot
        
        # Create indexes
        db.user_preferences.create_index("user_id", unique=True)
        db.bookmarks.create_index([("user_id", ASCENDING), ("url", ASCENDING)], unique=True)
        db.daily_news_users.create_index("user_id", unique=True)
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
        
        logging.info("Database initialized successfully!")
        return db
    except Exception as e:
        logging.error(f"Failed to initialize database: {e}")
        raise

def is_registered(user_id):
    doc = db.user_preferences.find_one({"user_id": user_id})
    return doc is not None

def register_user(user_id):
    db.user_preferences.update_one(
        {"user_id": user_id},
        {"$setOnInsert": {"user_id": user_id}},
        upsert=True
    )

def set_user_country(user_id, country):
    db.user_preferences.update_one(
        {"user_id": user_id},
        {"$set": {"country": country}},
        upsert=True
    )

def get_user_country(user_id):
    doc = db.user_preferences.find_one({"user_id": user_id})
    return doc.get("country", "us") if doc else "us"

def set_user_languages(user_id, languages):
    db.user_preferences.update_one(
        {"user_id": user_id},
        {"$set": {"languages": languages}},
        upsert=True
    )

def get_user_languages(user_id):
    doc = db.user_preferences.find_one({"user_id": user_id})
    return doc.get("languages", ["en"]) if doc else ["en"]

def add_bookmark(user_id, url, title):
    db.bookmarks.update_one(
        {"user_id": user_id, "url": url},
        {"$set": {"title": title}},
        upsert=True
    )

def get_bookmarks(user_id):
    return [
        (bm.get("url", ""), bm.get("title", ""))
        for bm in db.bookmarks.find({"user_id": user_id})
    ]

def remove_bookmark(user_id, index):
    bookmarks = list(db.bookmarks.find({"user_id": user_id}))
    if 0 <= index < len(bookmarks):
        db.bookmarks.delete_one({"_id": bookmarks[index]["_id"]})
        return True
    return False

def get_all_categories():
    return {cat["name"]: cat["description"] for cat in db.categories.find({})}

def set_guild_news_channel(guild_id, channel_id):
    db.guild_settings.update_one(
        {"guild_id": guild_id},
        {"$set": {"news_channel_id": channel_id}},
        upsert=True
    )

def get_guild_news_channel(guild_id):
    doc = db.guild_settings.find_one({"guild_id": guild_id})
    return doc["news_channel_id"] if doc and "news_channel_id" in doc else None

def add_user_to_daily_news(user_id):
    db.daily_news_users.update_one(
        {"user_id": user_id},
        {"$set": {"user_id": user_id}},
        upsert=True
    )

def remove_user_from_daily_news(user_id):
    db.daily_news_users.delete_one({"user_id": user_id})

def get_daily_news_users():
    return [u["user_id"] for u in db.daily_news_users.find({})]

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
