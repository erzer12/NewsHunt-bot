import discord
from database import get_all_categories
from database import is_registered

def require_registration():
    def decorator(func):
        async def wrapper(interaction, *args, **kwargs):
            if not is_registered(interaction.user.id):
                await interaction.response.send_message(
                    "🚫 You need to register first! Use `/start` to begin.",
                    ephemeral=True
                )
                return
            return await func(interaction, *args, **kwargs)
        return wrapper
    return decorator

COUNTRY_MAPPING = {
    "united states": "us",
    "india": "in",
    "united kingdom": "gb",
    "australia": "au",
    "canada": "ca"
    # Add more mappings as needed
}

def create_news_embed(article, title_prefix="", is_rss=False):
    title = article.get("title", "No Title")
    url = article.get("url") or article.get("link")
    desc = article.get("description") or article.get("summary") or ""
    embed = discord.Embed(
        title=f"{title_prefix} {title}",
        url=url,
        description=desc[:2048],
        color=discord.Color.blue()
    )
    if article.get("urlToImage"):
        embed.set_image(url=article["urlToImage"])
    source = article.get("source", {}).get("name", "RSS" if is_rss else "Unknown")
    embed.add_field(name="Source", value=source)
    if article.get("publishedAt"):
        embed.set_footer(text=f"Published at: {article['publishedAt']}")
    elif article.get("published"):
        embed.set_footer(text=article["published"])
    return embed

async def get_country_choices(interaction: discord.Interaction, current: str):
    items = [("us", "United States"), ("in", "India"), ("gb", "United Kingdom"), ("au", "Australia"), ("ca", "Canada")]
    return [
        discord.app_commands.Choice(name=f"{name} ({code})", value=code)
        for code, name in items
        if current.lower() in name.lower() or current.lower() in code.lower()
    ]

async def get_category_choices(interaction: discord.Interaction, current: str):
    categories = get_all_categories()
    return [
        discord.app_commands.Choice(name=f"{cat.capitalize()} - {desc[:50]}...", value=cat)
        for cat, desc in categories.items()
        if current.lower() in cat.lower() or current.lower() in desc.lower()
    ]
