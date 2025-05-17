import os
import discord
from discord.ext import commands, tasks
from dotenv import load_dotenv

from database import init_db
from commands import setup_commands, start_scheduled_tasks

load_dotenv()
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")

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
    client = NewsBot()
    client.run(DISCORD_TOKEN)

if __name__ == "__main__":
    main()
