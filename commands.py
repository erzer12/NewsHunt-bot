import logging
import discord
from discord import app_commands
from discord.ext import commands, tasks
from database import (
    set_user_country, get_user_country, set_user_languages, get_user_languages,
    add_bookmark, get_bookmarks, remove_bookmark,
    add_user_to_daily_news, remove_user_from_daily_news, get_daily_news_users,
    set_guild_news_channel, get_guild_news_channel,
    get_all_categories, is_registered, register_user
)
from news_api import (
    fetch_top_headlines, fetch_news_by_category, fetch_news_by_query, fetch_trending_news, clear_cache
)
from local_news import fetch_rss_news
from translation import translate_text
from summarizer import summarize_article
from views import NewsPaginator, HelpMenuView
from utils import create_news_embed, get_country_choices, get_category_choices, require_registration
from onboard import ONBOARD_MSG
import asyncio
import traceback

# Configure logger
logger = logging.getLogger(__name__)

async def setup_commands(bot: commands.Bot):
    tree = bot.tree

    @tasks.loop(minutes=15)
    async def clear_news_cache():
        """Clear expired news cache every 15 minutes"""
        clear_cache()

    @tree.command(name="start", description="Register to use NewsBot and get started")
    async def start(interaction: discord.Interaction):
        if is_registered(interaction.user.id):
            await interaction.response.send_message("You are already registered! Use `/help` to see available commands.", ephemeral=True)
            return
        register_user(interaction.user.id)
        try:
            await interaction.user.send(ONBOARD_MSG)
        except Exception:
            pass  # DM might fail
        await interaction.response.send_message("✅ You are registered! Check your DMs for a quick setup guide.", ephemeral=True)

    @tree.command(name="help", description="Show all available commands or get help for a specific command")
    @require_registration()
    async def help_command(interaction: discord.Interaction, command: str = None):
        if command:
            # Command-specific help
            command = command.lower()
            if command == "setcountry":
                embed = discord.Embed(
                    title="📰 Help: /setcountry",
                    color=discord.Color.blue(),
                    description=(
                        "Set your preferred country for news.\n\n"
                        "**Usage:** `/setcountry <country_code>`\n\n"
                        "**Available Countries:**\n"
                        "• United States (us)\n"
                        "• India (in)\n"
                        "• United Kingdom (gb)\n"
                        "• Australia (au)\n"
                        "• Canada (ca)\n\n"
                        "**Example:** `/setcountry us`"
                    )
                )
            elif command == "setlang":
                embed = discord.Embed(
                    title="📰 Help: /setlang",
                    color=discord.Color.blue(),
                    description=(
                        "Set your preferred language(s) for news translation.\n\n"
                        "**Usage:** `/setlang <language_codes>`\n\n"
                        "**Reliable Language Codes:**\n"
                        "• English (en) - Most accurate\n"
                        "• Spanish (es) - Very accurate\n"
                        "• French (fr) - Very accurate\n"
                        "• German (de) - Very accurate\n"
                        "• Italian (it) - Very accurate\n"
                        "• Portuguese (pt) - Very accurate\n"
                        "• Russian (ru) - Good accuracy\n"
                        "• Japanese (ja) - Good accuracy\n"
                        "• Korean (ko) - Good accuracy\n"
                        "• Chinese (zh) - Good accuracy\n\n"
                        "**Examples:**\n"
                        "• `/setlang en` - English only\n"
                        "• `/setlang es,fr` - Spanish and French\n"
                        "• `/setlang ja,ko` - Japanese and Korean\n\n"
                        "**Note:** These languages have been tested and provide reliable translations for news content. Other languages may have varying accuracy."
                    )
                )
            elif command == "news":
                embed = discord.Embed(
                    title="📰 Help: /news",
                    color=discord.Color.blue(),
                    description=(
                        "Get today's top headlines from your selected country.\n\n"
                        "**Usage:** `/news [count]`\n\n"
                        "**Parameters:**\n"
                        "• count (optional): Number of articles (default: 5)\n\n"
                        "**Example:** `/news 3` - Get 3 top headlines"
                    )
                )
            elif command == "category":
                embed = discord.Embed(
                    title="📰 Help: /category",
                    color=discord.Color.blue(),
                    description=(
                        "Get news by specific category.\n\n"
                        "**Usage:** `/category <category> [count]`\n\n"
                        "**Available Categories:**\n"
                        "• business - Business and finance news\n"
                        "• entertainment - Movies, TV, music, and arts\n"
                        "• technology - Tech and innovation news\n"
                        "• sports - Sports and athletics\n"
                        "• science - Scientific discoveries\n"
                        "• health - Health and medical news\n"
                        "• politics - Political news\n"
                        "• environment - Environmental news\n"
                        "• education - Education news\n"
                        "• automotive - Auto industry news\n"
                        "• gaming - Gaming news\n"
                        "• food - Food and culinary news\n"
                        "• travel - Travel and tourism\n"
                        "• fashion - Fashion news\n"
                        "• crypto - Cryptocurrency news\n"
                        "• general - General news\n\n"
                        "**Example:** `/category technology 3`"
                    )
                )
            elif command == "dailynews":
                embed = discord.Embed(
                    title="📰 Help: /dailynews",
                    color=discord.Color.blue(),
                    description=(
                        "Toggle daily news digest in your DMs.\n\n"
                        "**Usage:** `/dailynews <on|off>`\n\n"
                        "**Parameters:**\n"
                        "• on: Enable daily news\n"
                        "• off: Disable daily news\n\n"
                        "**Example:** `/dailynews on`"
                    )
                )
            elif command == "bookmark":
                embed = discord.Embed(
                    title="📰 Help: /bookmark",
                    color=discord.Color.blue(),
                    description=(
                        "Bookmark a news article for later reading.\n\n"
                        "**Usage:** `/bookmark <url> <title>`\n\n"
                        "**Parameters:**\n"
                        "• url: The article URL\n"
                        "• title: A title for the bookmark\n\n"
                        "**Example:** `/bookmark https://example.com/article \"Important News\"`"
                    )
                )
            elif command == "search":
                embed = discord.Embed(
                    title="📰 Help: /search",
                    color=discord.Color.blue(),
                    description=(
                        "Search for news articles by keyword.\n\n"
                        "**Usage:** `/search <query> [count]`\n\n"
                        "**Parameters:**\n"
                        "• query: Search term\n"
                        "• count (optional): Number of results (default: 5)\n\n"
                        "**Example:** `/search artificial intelligence 3`"
                    )
                )
            elif command == "summarize":
                embed = discord.Embed(
                    title="📰 Help: /summarize",
                    color=discord.Color.blue(),
                    description=(
                        "Get a summary of a news article.\n\n"
                        "**Usage:** `/summarize <url> [length] [style]`\n\n"
                        "**Parameters:**\n"
                        "• url: The article URL to summarize\n"
                        "• length (optional): Summary length (default: medium)\n"
                        "• style (optional): Summary format (default: paragraph)\n\n"
                        "**Available lengths:**\n"
                        "• short - 2 sentences\n"
                        "• medium - 3 sentences\n"
                        "• long - 5 sentences\n\n"
                        "**Available styles:**\n"
                        "• paragraph - Regular text format\n"
                        "• bullet - Bullet point format\n"
                        "• numbered - Numbered list format\n\n"
                        "**Examples:**\n"
                        "• `/summarize https://example.com/article`\n"
                        "• `/summarize https://example.com/article length:long style:bullet`\n"
                        "• `/summarize https://example.com/article style:numbered`"
                    )
                )
            elif command == "localnews":
                embed = discord.Embed(
                    title="📰 Help: /localnews",
                    color=discord.Color.blue(),
                    description=(
                        "Get local news for a specific place.\n\n"
                        "**Usage:** `/localnews <place>`\n\n"
                        "**Parameters:**\n"
                        "• place: City or region name\n\n"
                        "**Example:** `/localnews New York`"
                    )
                )
            else:
                embed = discord.Embed(
                    title="❌ Command Not Found",
                    color=discord.Color.red(),
                    description=f"Command `{command}` not found. Use `/help` to see all available commands."
                )
            await interaction.response.send_message(embed=embed, ephemeral=True)
        else:
            # General help menu
            embed = discord.Embed(
                title="📰 NewsBot Help",
                color=discord.Color.blue(),
                description=(
                    "**News:** `/news`, `/category`, `/trending`, `/flashnews`, `/search`, `/summarize`\n"
                    "**Local:** `/localnews`\n"
                    "**Bookmarks:** `/bookmark`, `/bookmarks`, `/remove_bookmark`\n"
                    "**Preferences:** `/setcountry`, `/setlang`, `/dailynews`, `/setchannel`\n"
                    "**Help:** `/help`\n\n"
                    "Use `/help <command>` to get detailed help for a specific command.\n"
                    "Example: `/help setcountry`"
                )
            )
            await interaction.response.send_message(embed=embed, view=HelpMenuView(), ephemeral=True)

    # ...continue with your other commands, using the same indentation pattern...

    # Start the cache clearing task
    clear_news_cache.start()

def start_scheduled_tasks(bot):
    """Start all scheduled tasks"""
    pass  # Tasks are started in setup_commands
