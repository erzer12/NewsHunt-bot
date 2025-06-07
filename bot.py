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

# --- Shorter logging configuration ---
logging.basicConfig(
    level=logging.WARNING,  # Only warnings and errors will show up
    format='[%(levelname)s] %(name)s: %(message)s'
)
logging.getLogger('discord').setLevel(logging.WARNING)
logging.getLogger('werkzeug').setLevel(logging.WARNING)
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

    # Clean up old entries (remove those older than 1 minute)
    cutoff = current_time - 60
    for ip in list(last_health_check.keys()):
        if last_health_check[ip] < cutoff:
            del last_health_check[ip]

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
        logger.info("🔄 Setting up commands...")
        await setup_commands(self)
        logger.info("✅ Commands setup complete")

    async def on_ready(self):
        if self.user:
            logger.info(f"✅ Logged in as {self.user.name}")
        logger.info("🔄 Syncing commands...")
        try:
            synced = await self.tree.sync()
            logger.info(f"✨ Synced {len(synced)} command(s)")
        except Exception as e:
            logger.error(f"❌ Error syncing commands: {e}")
        start_scheduled_tasks(self)

def main():
    logger.warning("🤖 Starting News Bot...")  # Use warning so it's visible in logs
    try:
        init_db()
        logger.warning("✅ Database initialized")
    except Exception as e:
        logger.error(f"❌ Database initialization error: {e}")
        sys.exit(1)

    # Start Flask server in a separate thread
    web_thread = threading.Thread(target=run_web, daemon=True)
    web_thread.start()

    if not DISCORD_TOKEN:
        logger.error("❌ DISCORD_TOKEN is missing! Please check your .env file.")
        sys.exit(1)
    bot = NewsBot()
    bot.run(DISCORD_TOKEN)

if __name__ == "__main__":
    main()
