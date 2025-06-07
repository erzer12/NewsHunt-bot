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
        try:
            if command:
                command = command.lower()
                embed = None
                if command == "setcountry":
                    embed = discord.Embed(
                        title="📰 Help: /setcountry",
                        color=discord.Color.blue(),
                        description="Set your preferred country for news.\n\n**Usage:** `/setcountry <country_code>`"
                    )
                elif command == "setlang":
                    embed = discord.Embed(
                        title="📰 Help: /setlang",
                        color=discord.Color.blue(),
                        description=(
                            "Set your preferred language(s) for news.\n\n"
                            "**Usage:** `/setlang <language_codes>`\n"
                            "Examples: `/setlang en` or `/setlang en,fr`"
                        )
                    )
                elif command == "news":
                    embed = discord.Embed(
                        title="📰 Help: /news",
                        color=discord.Color.blue(),
                        description="Get today's top headlines.\n\n**Usage:** `/news [count]`"
                    )
                elif command == "category":
                    embed = discord.Embed(
                        title="📰 Help: /category",
                        color=discord.Color.blue(),
                        description="Get news by category.\n\n**Usage:** `/category <category> [count]`"
                    )
                elif command == "search":
                    embed = discord.Embed(
                        title="📰 Help: /search",
                        color=discord.Color.blue(),
                        description="Search for news articles by keyword.\n\n**Usage:** `/search <query> [count]`"
                    )
                elif command == "trending":
                    embed = discord.Embed(
                        title="📰 Help: /trending",
                        color=discord.Color.blue(),
                        description="Get trending news.\n\n**Usage:** `/trending [count]`"
                    )
                elif command == "flashnews":
                    embed = discord.Embed(
                        title="📰 Help: /flashnews",
                        color=discord.Color.blue(),
                        description="Get breaking news headlines.\n\n**Usage:** `/flashnews [count]`"
                    )
                elif command == "dailynews":
                    embed = discord.Embed(
                        title="📰 Help: /dailynews",
                        color=discord.Color.blue(),
                        description="Toggle daily news digest in your DMs.\n\n**Usage:** `/dailynews <on|off>`"
                    )
                elif command == "setchannel":
                    embed = discord.Embed(
                        title="📰 Help: /setchannel",
                        color=discord.Color.blue(),
                        description="Set the server channel for daily news (admin only).\n\n**Usage:** `/setchannel <channel>`"
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
                        "**Core commands:**\n"
                        "`/news`, `/category`, `/trending`, `/flashnews`, `/search`\n"
                        "**Preferences:**\n"
                        "`/setcountry`, `/setlang`, `/dailynews`, `/setchannel`\n"
                        "`/help` — Show this help menu\n\n"
                        "Use `/help <command>` to get detailed help for a specific command."
                    )
                )
                await interaction.response.send_message(embed=embed, view=HelpMenuView(), ephemeral=True)
        except discord.errors.NotFound:
            try:
                await interaction.edit_original_response(embed=embed, view=HelpMenuView())
            except Exception:
                await interaction.followup.send(embed=embed, view=HelpMenuView(), ephemeral=True)

    # -- Core News Commands Below --

    @tree.command(name="news", description="Get today's top headlines.")
    @require_registration()
    async def news(interaction: discord.Interaction, count: int = 5):
        await interaction.response.defer(thinking=True, ephemeral=True)
        articles = fetch_top_headlines(count=count)
        if not articles:
            await interaction.followup.send("No news found.", ephemeral=True)
            return
        view = NewsPaginator(articles, interaction.user.id)
        embed = await create_news_embed(articles[0], "Top Headline", style="default")
        await interaction.followup.send(embed=embed, view=view, ephemeral=True)

    @tree.command(name="category", description="Get news by category.")
    @require_registration()
    async def category(interaction: discord.Interaction, category: str, count: int = 5):
        await interaction.response.defer(thinking=True, ephemeral=True)
        articles = fetch_news_by_category(category=category, count=count)
        if not articles:
            await interaction.followup.send(f"No news found for category `{category}`.", ephemeral=True)
            return
        view = NewsPaginator(articles, interaction.user.id)
        embed = await create_news_embed(articles[0], f"{category.title()} News", style="default")
        await interaction.followup.send(embed=embed, view=view, ephemeral=True)

    @tree.command(name="search", description="Search for news articles by keyword.")
    @require_registration()
    async def search(interaction: discord.Interaction, query: str, count: int = 5):
        await interaction.response.defer(thinking=True, ephemeral=True)
        articles = fetch_news_by_query(query=query, count=count)
        if not articles:
            await interaction.followup.send(f"No news found for `{query}`.", ephemeral=True)
            return
        view = NewsPaginator(articles, interaction.user.id)
        embed = await create_news_embed(articles[0], f"Results for '{query}'", style="default")
        await interaction.followup.send(embed=embed, view=view, ephemeral=True)

    @tree.command(name="trending", description="Get trending news.")
    @require_registration()
    async def trending(interaction: discord.Interaction, count: int = 5):
        await interaction.response.defer(thinking=True, ephemeral=True)
        articles = fetch_trending_news(count=count)
        if not articles:
            await interaction.followup.send("No trending news found.", ephemeral=True)
            return
        view = NewsPaginator(articles, interaction.user.id)
        embed = await create_news_embed(articles[0], "Trending News", style="default")
        await interaction.followup.send(embed=embed, view=view, ephemeral=True)

    @tree.command(name="flashnews", description="Get breaking/flash news.")
    @require_registration()
    async def flashnews(interaction: discord.Interaction, count: int = 5):
        await interaction.response.defer(thinking=True, ephemeral=True)
        # For simplicity, just call fetch_top_headlines (or your actual flash/breaking news method)
        articles = fetch_top_headlines(count=count)
        if not articles:
            await interaction.followup.send("No breaking news found.", ephemeral=True)
            return
        view = NewsPaginator(articles, interaction.user.id)
        embed = await create_news_embed(articles[0], "Breaking News", style="default")
        await interaction.followup.send(embed=embed, view=view, ephemeral=True)

    # Preferences: setcountry, setlang, dailynews, setchannel, etc.
    @tree.command(name="setcountry", description="Set your preferred country for news.")
    @require_registration()
    async def setcountry(interaction: discord.Interaction, country: str):
        set_user_country(interaction.user.id, country)
        await interaction.response.send_message(f"Country set to `{country}`!", ephemeral=True)

    @tree.command(name="setlang", description="Set your preferred language(s) for news.")
    @require_registration()
    async def setlang(interaction: discord.Interaction, languages: str):
        langs = [lang.strip() for lang in languages.split(",")]
        set_user_languages(interaction.user.id, langs)
        await interaction.response.send_message(f"Languages set to `{', '.join(langs)}`!", ephemeral=True)

    @tree.command(name="dailynews", description="Toggle daily news in your DMs.")
    @require_registration()
    async def dailynews(interaction: discord.Interaction, on_off: str):
        # Add logic to enable/disable daily news if you want
        await interaction.response.send_message(f"Daily news set to `{on_off}` (feature not implemented in this minimal version).", ephemeral=True)

    @tree.command(name="setchannel", description="Set the server channel for daily news (admin only).")
    @require_registration()
    async def setchannel(interaction: discord.Interaction, channel: discord.TextChannel):
        set_guild_news_channel(interaction.guild.id, channel.id)
        await interaction.response.send_message(f"Daily news channel set to {channel.mention}", ephemeral=True)

    clear_news_cache.start()

def start_scheduled_tasks(bot):
    """Start all scheduled tasks"""
    pass  # Tasks are started in setup_commands
