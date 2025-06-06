import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv
import sys
import logging

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
            default_categories = {
                'business': 'Business, finance, stocks, markets, cryptocurrencies, startups, and company news',
                'entertainment': 'Movies, TV shows, music, celebrities, gaming, streaming, and arts',
                'technology': 'AI, software, hardware, gadgets, cybersecurity, and tech company updates',
                'sports': 'Football, basketball, cricket, tennis, F1, Olympics, and athlete updates',
                'science': 'Space exploration, physics, biology, climate change, and research breakthroughs',
                'health': 'Medical research, wellness, nutrition, fitness, mental health, and healthcare',
                'politics': 'Government policies, elections, international relations, and political events',
                'environment': 'Climate change, sustainability, renewable energy, and conservation',
                'education': 'Learning trends, academic research, education tech, and student news',
                'automotive': 'Cars, EVs, automotive industry, and future mobility',
                'gaming': 'Video games, esports, gaming hardware, and industry updates',
                'food': 'Culinary trends, restaurants, recipes, and food industry news',
                'travel': 'Tourism, destinations, travel tips, and industry updates',
                'fashion': 'Fashion trends, designers, industry news, and lifestyle',
                'crypto': 'Cryptocurrency, blockchain, NFTs, and digital assets',
                'general': 'Top headlines and breaking news from around the world'
            }
            for name, desc in default_categories.items():
                db.categories.insert_one({"name": name, "description": desc})
        print("✅ Database initialized successfully!")
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
