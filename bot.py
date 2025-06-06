import os
import threading
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import discord
from discord.ext import commands, tasks
import sys
import logging

from database import init_db
from commands import setup_commands, start_scheduled_tasks

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")

# Track last health check log time
last_health_log = datetime.now()

# Rate limiting for health checks
last_health_check = {}
HEALTH_CHECK_INTERVAL = 5  # seconds

# Initialize Flask app
app = Flask(__name__)

@app.route("/")
def index():
    return "Bot is running!", 200

@app.route("/health")
def health():
    """Health check endpoint with rate limiting"""
    current_time = time.time()
    client_ip = request.remote_addr
    
    # Check if this IP has made a request recently
    if client_ip in last_health_check:
        last_check = last_health_check[client_ip]
        if current_time - last_check < HEALTH_CHECK_INTERVAL:
            return jsonify({"status": "ok", "message": "Rate limited"}), 429
    
    # Update last check time
    last_health_check[client_ip] = current_time
    
    # Clean up old entries
    current_time = time.time()
    last_health_check.clear()
    
    return jsonify({
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": get_uptime()
    })

def get_uptime():
    """Get bot uptime"""
    if not hasattr(get_uptime, 'start_time'):
        get_uptime.start_time = datetime.utcnow()
    uptime = datetime.utcnow() - get_uptime.start_time
    return str(uptime)

def run_web():
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, threaded=True)

class NewsBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        print("🔄 Setting up commands...")
        await setup_commands(self)
        print("✅ Commands setup complete")

    async def on_ready(self):
        print(f"✅ Logged in as {self.user.name}")
        print("🔄 Syncing commands...")
        try:
            synced = await self.tree.sync()
            print(f"✨ Synced {len(synced)} command(s)")
        except Exception as e:
            print(f"❌ Error syncing commands: {e}")
        start_scheduled_tasks(self)

def main():
    print("🤖 Starting News Bot...")
    try:
        init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        sys.exit(1)

    # Start Flask server in a separate thread
    web_thread = threading.Thread(target=run_web, daemon=True)
    web_thread.start()
    
    if not DISCORD_TOKEN:
        print(
            "❌ DISCORD_TOKEN is missing! Please check your .env file.",
            file=sys.stderr
        )
        sys.exit(1)
    bot = NewsBot()
    bot.run(DISCORD_TOKEN)

if __name__ == "__main__":
    main()
