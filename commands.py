import logging
import discord
from discord import app_commands
from discord.ext import commands, tasks
from database import (
    set_user_country, get_user_country, set_user_languages, get_user_languages,
    get_all_categories, is_registered, register_user,
    set_guild_news_channel, get_guild_news_channel
)
from news_api import (
    fetch_top_headlines, fetch_news_by_category, fetch_news_by_query, fetch_trending_news, clear_cache
)
from views import NewsPaginator, HelpMenuView
from utils import create_news_embed, get_country_choices, get_category_choices, require_registration
from onboard import ONBOARD_MSG

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
            try:
                await interaction.response.send_message(
                    "You are already registered! Use `/help` to see available commands.",
                    ephemeral=True
                )
            except discord.errors.NotFound:
                try:
                    await interaction.edit_original_response(
                        content="You are already registered! Use `/help` to see available commands."
                    )
                except Exception:
                    await interaction.followup.send(
                        "You are already registered! Use `/help` to see available commands.",
                        ephemeral=True
                    )
            return
        register_user(interaction.user.id)
        try:
            await interaction.user.send(ONBOARD_MSG)
        except Exception:
            pass  # DM might fail
        try:
            await interaction.response.send_message(
                "✅ You are registered! Check your DMs for a quick setup guide.",
                ephemeral=True
            )
        except discord.errors.NotFound:
            try:
                await interaction.edit_original_response(
                    content="✅ You are registered! Check your DMs for a quick setup guide."
                )
            except Exception:
                await interaction.followup.send(
                    "✅ You are registered! Check your DMs for a quick setup guide.",
                    ephemeral=True
                )

    @tree.command(name="help", description="Show all available commands or get help for a specific command")
    @require_registration()
    async def help_command(interaction: discord.Interaction, command: str = None):
        if command:
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
                        "Set your preferred language(s) for news.\n\n"
                        "**Usage:** `/setlang <language_codes>`\n\n"
                        "**Reliable Language Codes:**\n"
                        "• English (en)\n"
                        "• Spanish (es)\n"
                        "• French (fr)\n"
                        "• German (de)\n"
                        "• Italian (it)\n"
                        "• Portuguese (pt)\n"
                        "• Russian (ru)\n"
                        "• Japanese (ja)\n"
                        "• Korean (ko)\n"
                        "• Chinese (zh)\n\n"
                        "**Examples:**\n"
                        "• `/setlang en` - English only\n"
                        "• `/setlang es,fr` - Spanish and French\n"
                        "• `/setlang ja,ko` - Japanese and Korean"
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
                        "• business\n"
                        "• entertainment\n"
                        "• technology\n"
                        "• sports\n"
                        "• science\n"
                        "• health\n"
                        "• politics\n"
                        "• environment\n"
                        "• education\n"
                        "• automotive\n"
                        "• gaming\n"
                        "• food\n"
                        "• travel\n"
                        "• fashion\n"
                        "• crypto\n"
                        "• general\n\n"
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
            else:
                embed = discord.Embed(
                    title="❌ Command Not Found",
                    color=discord.Color.red(),
                    description=f"Command `{command}` not found. Use `/help` to see all available commands."
                )
            await interaction.response.send_message(embed=embed, ephemeral=True)
        else:
            embed = discord.Embed(
                title="📰 NewsBot Help",
                color=discord.Color.blue(),
                description=(
                    "**News:** `/news`, `/category`, `/trending`, `/flashnews`, `/search`\n"
                    "**Preferences:** `/setcountry`, `/setlang`, `/dailynews`, `/setchannel`\n"
                    "**Help:** `/help`\n\n"
                    "Use `/help <command>` to get detailed help for a specific command.\n"
                    "Example: `/help setcountry`"
                )
            )
            await interaction.response.send_message(embed=embed, view=HelpMenuView(), ephemeral=True)

    # Start the cache clearing task
    clear_news_cache.start()

def start_scheduled_tasks(bot):
    """Start all scheduled tasks"""
    pass  # Tasks are started in setup_commands
