from pymongo import MongoClient
import os
from dotenv import load_dotenv
import sys

def test_mongodb_connection():
    print("🔄 Testing MongoDB connection...")
    
    # Load environment variables
    load_dotenv()
    MONGO_URI = os.getenv("MONGODB_URI")
    MONGO_DB = os.getenv("MONGODB_DB", "newsbot")
    
    if not MONGO_URI:
        print("❌ MONGODB_URI not found in environment variables!")
        return False
    
    try:
        # Try to connect to MongoDB
        client = MongoClient(MONGO_URI)
        db = client[MONGO_DB]
        
        # Try to ping the database
        client.admin.command('ping')
        
        print("✅ Successfully connected to MongoDB!")
        print(f"📊 Database name: {MONGO_DB}")
        
        # Test basic operations
        test_collection = db.test_collection
        test_doc = {"test": "data"}
        test_collection.insert_one(test_doc)
        print("✅ Successfully inserted test document!")
        
        found_doc = test_collection.find_one({"test": "data"})
        print("✅ Successfully retrieved test document!")
        
        test_collection.delete_one({"test": "data"})
        print("✅ Successfully deleted test document!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_mongodb_connection()
    sys.exit(0 if success else 1) 