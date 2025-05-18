import discord
from discord import app_commands
from discord.ext import commands, tasks
from database import (
    set_user_country, get_user_country, set_user_languages, get_user_languages,
    add_bookmark, get_bookmarks, remove_bookmark,
    add_user_to_daily_news, remove_user_from_daily_news, get_daily_news_users,
    set_guild_news_channel, get_guild_news_channel,
    get_all_categories
)
from news_api import (
    fetch_top_headlines, fetch_news_by_category, fetch_news_by_query, fetch_trending_news
)
from local_news import fetch_rss_news
from translation import translate_text
from summarizer import summarize_article
from views import NewsPaginator, HelpMenuView
from utils import create_news_embed, get_country_choices, get_category_choices
from onboard import send_onboarding

async def setup_commands(bot: commands.Bot):
    tree = bot.tree

    @tree.command(name="help", description="Show all available commands")
    async def help_command(interaction: discord.Interaction):
        await send_onboarding(interaction.user)
        embed = discord.Embed(
            title="📰 NewsBot Help",
            color=discord.Color.blue(),
            description=(
                "**News:** `/news`, `/category`, `/trending`, `/flashnews`, `/search`, `/summarize`\n"
                "**Local:** `/localnews`\n"
                "**Bookmarks:** `/bookmark`, `/bookmarks`, `/remove_bookmark`\n"
                "**Preferences:** `/setcountry`, `/setlang`, `/dailynews`, `/setchannel`\n"
                "**Help:** `/help`"
            )
        )
        await interaction.response.send_message(embed=embed, view=HelpMenuView(), ephemeral=True)

    @tree.command(name="news", description="Get today's top headlines")
    async def news(interaction: discord.Interaction, count: int = 5):
        await send_onboarding(interaction.user)
        await interaction.response.defer()
        country = get_user_country(interaction.user.id) or "us"
        langs = get_user_languages(interaction.user.id)
        language = langs[0]
        articles = fetch_top_headlines(country, count)
        if articles:
            for art in articles:
                art["title"] = translate_text(art["title"], language)
                art["description"] = translate_text(art.get("description", ""), language)
            view = NewsPaginator(articles, interaction.user.id)
            embed = create_news_embed(articles[0], f"Article 1/{len(articles)}")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No news found.")

    @tree.command(name="category", description="Get news by category")
    @app_commands.autocomplete(category=get_category_choices)
    async def category(interaction: discord.Interaction, category: str, count: int = 5):
        await send_onboarding(interaction.user)
        await interaction.response.defer()
        langs = get_user_languages(interaction.user.id)
        language = langs[0]
        articles = fetch_news_by_category(category, count)
        if articles:
            for art in articles:
                art["title"] = translate_text(art["title"], language)
                art["description"] = translate_text(art.get("description", ""), language)
            view = NewsPaginator(articles, interaction.user.id)
            embed = create_news_embed(articles[0], f"Category: {category}")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No news found in this category.")

    @tree.command(name="trending", description="Get trending news")
    async def trending(interaction: discord.Interaction, count: int = 5):
        await send_onboarding(interaction.user)
        await interaction.response.defer()
        langs = get_user_languages(interaction.user.id)
        language = langs[0]
        articles = fetch_trending_news(count)
        if articles:
            for art in articles:
                art["title"] = translate_text(art["title"], language)
                art["description"] = translate_text(art.get("description", ""), language)
            view = NewsPaginator(articles, interaction.user.id)
            embed = create_news_embed(articles[0], f"Trending News")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No trending news found.")

    @tree.command(name="flashnews", description="Get breaking news")
    async def flashnews(interaction: discord.Interaction):
        await send_onboarding(interaction.user)
        await interaction.response.defer()
        country = get_user_country(interaction.user.id) or "us"
        langs = get_user_languages(interaction.user.id)
        language = langs[0]
        articles = fetch_top_headlines(country, 5, breaking=True)
        if articles:
            for art in articles:
                art["title"] = translate_text(art["title"], language)
                art["description"] = translate_text(art.get("description", ""), language)
            embed = create_news_embed(articles[0], "🚨 BREAKING NEWS")
            await interaction.followup.send(embed=embed)
        else:
            await interaction.followup.send("❌ No breaking news available.")

    @tree.command(name="search", description="Search news by keyword")
    async def search(interaction: discord.Interaction, query: str, count: int = 5):
        await send_onboarding(interaction.user)
        await interaction.response.defer()
        langs = get_user_languages(interaction.user.id)
        language = langs[0]
        articles = fetch_news_by_query(query, count)
        if articles:
            for art in articles:
                art["title"] = translate_text(art["title"], language)
                art["description"] = translate_text(art.get("description", ""), language)
            view = NewsPaginator(articles, interaction.user.id)
            embed = create_news_embed(articles[0], f"Search Results: {query}")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No results found.")

    @tree.command(name="summarize", description="Summarize a news article (auto-translated)")
    async def summarize(interaction: discord.Interaction, url: str):
        await send_onboarding(interaction.user)
        await interaction.response.defer()
        langs = get_user_languages(interaction.user.id)
        language = langs[0]
        summary = summarize_article(url)
        translated = translate_text(summary, language)
        embed = discord.Embed(title="Article Summary", description=translated, color=discord.Color.blue())
        await interaction.followup.send(embed=embed, ephemeral=True)

    @tree.command(name="localnews", description="Get the latest local news via RSS")
    async def localnews(interaction: discord.Interaction, place: str):
        await send_onboarding(interaction.user)
        await interaction.response.defer()
        langs = get_user_languages(interaction.user.id)
        language = langs[0]
        articles = fetch_rss_news(place)
        if articles:
            for art in articles:
                art["title"] = translate_text(art["title"], language)
                art["summary"] = translate_text(art.get("summary", ""), language)
            view = NewsPaginator(articles, interaction.user.id, is_rss=True)
            embed = create_news_embed(articles[0], f"Local News: {place}", is_rss=True)
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send(f"❌ No local news found for '{place}'.")

    @tree.command(name="bookmark", description="Bookmark an article")
    async def bookmark(interaction: discord.Interaction, url: str, title: str):
        await send_onboarding(interaction.user)
        add_bookmark(interaction.user.id, url, title)
        await interaction.response.send_message("✅ Article bookmarked!", ephemeral=True)

    @tree.command(name="bookmarks", description="List your bookmarks")
    async def bookmarks(interaction: discord.Interaction):
        await send_onboarding(interaction.user)
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

    @tree.command(name="remove_bookmark", description="Remove a bookmark by index (starts at 1)")
    async def remove_bookmark_cmd(interaction: discord.Interaction, index: int):
        await send_onboarding(interaction.user)
        marks = get_bookmarks(interaction.user.id)
        if 0 < index <= len(marks):
            removed = remove_bookmark(interaction.user.id, index-1)
            await interaction.response.send_message("✅ Bookmark removed.", ephemeral=True)
        else:
            await interaction.response.send_message("❌ Invalid bookmark index.", ephemeral=True)

    @tree.command(name="setcountry", description="Set your preferred country")
    @app_commands.autocomplete(country=get_country_choices)
    async def setcountry(interaction: discord.Interaction, country: str):
        await send_onboarding(interaction.user)
        set_user_country(interaction.user.id, country)
        await interaction.response.send_message(f"✅ Country set to: {country}", ephemeral=True)

    @tree.command(name="setlang", description="Set your preferred news language(s) (comma-separated codes)")
    async def setlang(interaction: discord.Interaction, languages: str):
        await send_onboarding(interaction.user)
        langs = [l.strip() for l in languages.split(",") if l.strip()]
        set_user_languages(interaction.user.id, langs)
        await interaction.response.send_message(f"✅ Language(s) set to: {', '.join(langs)}.", ephemeral=True)

    @tree.command(name="dailynews", description="Toggle your daily news DM digest")
    async def dailynews(interaction: discord.Interaction, enabled: bool):
        await send_onboarding(interaction.user)
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
            country = get_user_country(user_id)
            langs = get_user_languages(user_id)
            language = langs[0]
            articles = fetch_top_headlines(country, 5)
            if articles and user:
                for article in articles:
                    title = translate_text(article["title"], language)
                    desc = translate_text(article.get("description", ""), language)
                    embed = discord.Embed(
                        title=f"Daily News: {title}",
                        url=article["url"],
                        description=desc
                    )
                    await user.send(embed=embed)
    send_daily_news.start()
