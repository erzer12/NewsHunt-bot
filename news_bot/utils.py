import discord
from database import get_all_categories

COUNTRY_MAPPING = {
    "united states": "us",
    "india": "in",
    "united kingdom": "gb",
    "australia": "au",
    "canada": "ca"
    # Add more mappings as needed
}

def create_news_embed(article, title_prefix=""):
    embed = discord.Embed(
        title=f"{title_prefix} {article['title']}",
        url=article['url'],
        description=article.get('description', '') or '',
        color=discord.Color.blue()
    )
    if article.get('urlToImage'):
        embed.set_image(url=article['urlToImage'])
    source = article.get('source', {}).get('name', 'Unknown')
    embed.add_field(name="Source", value=source)
    embed.set_footer(text=f"Published at: {article.get('publishedAt', 'Unknown')}")
    return embed

async def get_country_choices(interaction: discord.Interaction, current: str):
    # For autocomplete
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
