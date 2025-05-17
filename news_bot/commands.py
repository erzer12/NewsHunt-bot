import discord
from discord import app_commands
from discord.ext import tasks
from news_api import (
    fetch_top_headlines, fetch_news_by_category, fetch_news_by_query,
    fetch_trending_news
)
from database import (
    set_user_country, get_user_country, get_all_categories, add_bookmark,
    get_bookmarks, remove_bookmark, get_user_preferences, set_user_preferences,
    get_guild_news_channel, set_guild_news_channel, get_daily_news_users,
    add_user_to_daily_news, remove_user_from_daily_news,
)
from summarizer import summarize_article
from views import NewsPaginator, HelpMenuView
from utils import create_news_embed, get_country_choices, get_category_choices

async def setup_commands(bot: discord.Client):
    tree = bot.tree

    @tree.command(name="help", description="Show all available commands")
    async def help_command(interaction: discord.Interaction):
        embed = discord.Embed(
            title="📰 NewsBot Help",
            color=discord.Color.blue(),
            description=(
                "Welcome to NewsBot! Use the buttons below to explore commands by category, "
                "or click 'Show All' to list everything."
            )
        )
        await interaction.response.send_message(embed=embed, view=HelpMenuView(), ephemeral=True)

    @tree.command(name="news", description="Get today's top headlines")
    async def news(interaction: discord.Interaction, count: int = 5):
        await interaction.response.defer()
        country = get_user_country(interaction.user.id) or "us"
        articles = fetch_top_headlines(country, count)
        if articles:
            view = NewsPaginator(articles, interaction.user.id)
            embed = create_news_embed(articles[0], f"Article 1/{len(articles)}")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No news found.")

    @tree.command(name="category", description="Get news by category")
    @app_commands.autocomplete(category=get_category_choices)
    async def category(interaction: discord.Interaction, category: str, count: int = 5):
        await interaction.response.defer()
        articles = fetch_news_by_category(category, count)
        if articles:
            view = NewsPaginator(articles, interaction.user.id)
            embed = create_news_embed(articles[0], f"Category: {category}")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No news found in this category.")

    @tree.command(name="search", description="Search news by keyword")
    async def search(interaction: discord.Interaction, query: str, count: int = 5):
        await interaction.response.defer()
        articles = fetch_news_by_query(query, count)
        if articles:
            view = NewsPaginator(articles, interaction.user.id)
            embed = create_news_embed(articles[0], f"Search Results: {query}")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No results found.")

    @tree.command(name="flashnews", description="Get breaking news")
    async def flashnews(interaction: discord.Interaction):
        await interaction.response.defer()
        country = get_user_country(interaction.user.id) or "us"
        articles = fetch_top_headlines(country, 5, breaking=True)
        if articles:
            embed = create_news_embed(articles[0], "🚨 BREAKING NEWS")
            await interaction.followup.send(embed=embed)
        else:
            await interaction.followup.send("❌ No breaking news available.")

    @tree.command(name="trending", description="Get trending news")
    async def trending(interaction: discord.Interaction, count: int = 5):
        await interaction.response.defer()
        articles = fetch_trending_news(count)
        if articles:
            view = NewsPaginator(articles, interaction.user.id)
            embed = create_news_embed(articles[0], f"Trending News")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No trending news found.")

    @tree.command(name="bookmark", description="Bookmark the current article")
    async def bookmark(interaction: discord.Interaction, url: str, title: str):
        add_bookmark(interaction.user.id, url, title)
        await interaction.response.send_message("✅ Article bookmarked!", ephemeral=True)

    @tree.command(name="bookmarks", description="List your bookmarks")
    async def bookmarks(interaction: discord.Interaction):
        marks = get_bookmarks(interaction.user.id)
        if not marks:
            await interaction.response.send_message("You have no bookmarks.", ephemeral=True)
            return
        embed = discord.Embed(
            title="🔖 Your Bookmarks",
            color=discord.Color.teal(),
            description="\n\n".join(
                f"{i+1}. [{title}]({url})"
                for i, (url, title) in enumerate(marks)
            )
        )
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @tree.command(name="remove_bookmark", description="Remove a bookmark")
    async def remove_bookmark_cmd(interaction: discord.Interaction, index: int):
        marks = get_bookmarks(interaction.user.id)
        if 0 < index <= len(marks):
            removed = remove_bookmark(interaction.user.id, index-1)
            await interaction.response.send_message("✅ Bookmark removed.", ephemeral=True)
        else:
            await interaction.response.send_message("❌ Invalid bookmark index.", ephemeral=True)

    @tree.command(name="setcountry", description="Set your preferred country")
    @app_commands.autocomplete(country=get_country_choices)
    async def setcountry(interaction: discord.Interaction, country: str):
        set_user_country(interaction.user.id, country)
        await interaction.response.send_message(f"✅ Country preference set to: {country}", ephemeral=True)

    @tree.command(name="dailynews", description="Toggle your daily news DM digest")
    async def dailynews(interaction: discord.Interaction, enabled: bool):
        if enabled:
            add_user_to_daily_news(interaction.user.id)
            await interaction.response.send_message("✅ Daily news enabled! You'll get news in your DMs.", ephemeral=True)
        else:
            remove_user_from_daily_news(interaction.user.id)
            await interaction.response.send_message("✅ Daily news disabled.", ephemeral=True)

    @tree.command(name="setchannel", description="Set channel for daily news (Admin only)")
    @app_commands.checks.has_permissions(administrator=True)
    async def setchannel(interaction: discord.Interaction, channel: discord.TextChannel):
        set_guild_news_channel(interaction.guild_id, channel.id)
        await interaction.response.send_message(f"✅ Daily news channel set to: {channel.mention}")

def start_scheduled_tasks(bot):
    @tasks.loop(hours=24)
    async def send_daily_news():
        users = get_daily_news_users()
        for user_id in users:
            user = await bot.fetch_user(user_id)
            country = get_user_country(user_id) or "us"
            articles = fetch_top_headlines(country, 5)
            if articles and user:
                embed = create_news_embed(articles[0], "Your Daily News Digest (Top 5)")
                await user.send(embed=embed)
    send_daily_news.start()
