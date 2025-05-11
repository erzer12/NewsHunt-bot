import os
import discord
from discord.ext import commands, tasks
import requests
import logging
from dotenv import load_dotenv

# Load environment variables from .env (if using locally or on Replit)
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)

# Get environment variables safely
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
CHANNEL_ID_STR = os.getenv("CHANNEL_ID")

# Validate all required variables
if not DISCORD_TOKEN:
    raise EnvironmentError("❌ DISCORD_TOKEN not set in environment variables.")
if not NEWS_API_KEY:
    raise EnvironmentError("❌ NEWS_API_KEY not set in environment variables.")
if not CHANNEL_ID_STR:
    raise EnvironmentError("❌ CHANNEL_ID not set in environment variables.")

# Convert CHANNEL_ID to integer safely
try:
    CHANNEL_ID = int(CHANNEL_ID_STR)
except ValueError:
    raise ValueError("❌ CHANNEL_ID must be an integer.")

# Setup Discord bot
intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

# Fetch top 5 news headlines
def get_news():
    url = (
        f"https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey={NEWS_API_KEY}"
    )
    response = requests.get(url)
    if response.status_code != 200:
        logging.error(f"Failed to fetch news: {response.text}")
        return []
    data = response.json()
    articles = data.get("articles", [])
    return [(article["title"], article["url"]) for article in articles]

# Task to post news daily
@tasks.loop(hours=24)
async def post_daily_news():
    await bot.wait_until_ready()
    channel = bot.get_channel(CHANNEL_ID)
    if not channel:
        logging.error("❌ Could not find channel with ID:", CHANNEL_ID)
        return
    news_list = get_news()
    if not news_list:
        await channel.send("⚠️ Failed to fetch news.")
        return
    await channel.send("📰 **Today's Top News Headlines:**")
    for title, url in news_list:
        await channel.send(f"• [{title}]({url})")

# Confirm bot is ready
@bot.event
async def on_ready():
    logging.info(f"✅ Logged in as {bot.user}")
    post_daily_news.start()

# Run the bot
bot.run(DISCORD_TOKEN)
