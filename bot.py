import os
import threading
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import Flask
import discord
from discord.ext import commands
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

def run_web():
    app = Flask(__name__)

    @app.route("/")
    def index():
        return "Bot is running!", 200

    @app.route("/health")
    def health():
        global last_health_log
        current_time = datetime.now()
        
        # Only log if 10 minutes have passed since last log
        if current_time - last_health_log >= timedelta(minutes=10):
            logger.info("Health check: OK")
            last_health_log = current_time
            
        return "OK", 200

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

    threading.Thread(target=run_web, daemon=True).start()
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
