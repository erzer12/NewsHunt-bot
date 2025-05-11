import os
import discord
import requests
from discord.ext import tasks

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
CHANNEL_ID = int(os.getenv("CHANNEL_ID"))

intents = discord.Intents.default()
intents.message_content = True
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'✅ Logged in as {client.user.name}')
    post_daily_news.start()

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.lower().startswith('!news'):
        await send_news_to_channel(message.channel)

async def send_news_to_channel(channel):
    await channel.send("📰 Fetching today's top headlines...")

    url = f'https://newsapi.org/v2/top-headlines?country=us&apiKey={NEWS_API_KEY}'
    response = requests.get(url)
    data = response.json()

    if data['status'] == 'ok':
        articles = data['articles'][:5]
        news_text = "**🗞 Today's Top Headlines:**\n\n"
        for article in articles:
            title = article['title']
            link = article['url']
            news_text += f"🔹 [{title}]({link})\n"
        await channel.send(news_text)
    else:
        await channel.send("❌ Failed to fetch news.")

@tasks.loop(hours=24)
async def post_daily_news():
    channel = client.get_channel(CHANNEL_ID)
    if channel:
        await send_news_to_channel(channel)

client.run(DISCORD_TOKEN)
