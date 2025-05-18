import os
import threading
from dotenv import load_dotenv
from flask import Flask
import discord
from discord.ext import commands
import sys

from database import init_db
from commands import setup_commands, start_scheduled_tasks

load_dotenv()
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")

def run_web():
    app = Flask(__name__)
    @app.route("/")
    def index():
        return "Bot is running!", 200
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

class NewsBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        await setup_commands(self)
        start_scheduled_tasks(self)

def main():
    print("🤖 Starting News Bot...")
    init_db()
    threading.Thread(target=run_web, daemon=True).start()
    if not DISCORD_TOKEN:
        print("❌ DISCORD_TOKEN is missing! Please check your .env file.", file=sys.stderr)
        exit(1)
    bot = NewsBot()
    bot.run(DISCORD_TOKEN)

if __name__ == "__main__":
    main()
