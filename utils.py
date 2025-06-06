import discord
from database import get_all_categories
from discord import Interaction, app_commands
from database import is_registered
from datetime import datetime
import re
import json
from typing import Optional, List, Dict, Union
import asyncio
import logging

def require_registration():
    async def predicate(interaction: Interaction) -> bool:
        if not is_registered(interaction.user.id):
            await interaction.response.send_message(
                "🚫 You need to register first! Use `/start` to begin.",
                ephemeral=True
            )
            return False
        return True
    return app_commands.check(predicate)

def format_date(date_str: str) -> str:
    """Format date string to a consistent format"""
    try:
        # Try different date formats
        formats = [
            "%Y-%m-%dT%H:%M:%SZ",
            "%Y-%m-%dT%H:%M:%S.%fZ",
            "%a, %d %b %Y %H:%M:%S %z",
            "%Y-%m-%d %H:%M:%S",
            "%d %b %Y %H:%M:%S",
            "%B %d, %Y %H:%M:%S"
        ]
        for fmt in formats:
            try:
                date = datetime.strptime(date_str, fmt)
                return date.strftime("%B %d, %Y at %I:%M %p")
            except ValueError:
                continue
        return date_str
    except:
        return date_str

def truncate_text(text: str, max_length: int = 2048) -> str:
    """Safely truncate text to fit Discord's limits"""
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."

def clean_url(url: str) -> Optional[str]:
    """Clean and validate URL"""
    if not url:
        return None
    # Remove any whitespace
    url = url.strip()
    # Add https:// if no protocol specified
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url

def extract_metadata(article: Dict) -> Dict:
    """Extract and clean article metadata"""
    metadata = {
        "title": article.get("title", "No Title"),
        "url": clean_url(article.get("url") or article.get("link")),
        "description": article.get("description") or article.get("summary", ""),
        "source": article.get("source", {}).get("name", "Unknown"),
        "author": article.get("author"),
        "published": format_date(article.get("publishedAt") or article.get("published", "")),
        "image": article.get("urlToImage"),
        "category": article.get("category"),
        "keywords": article.get("keywords", [])[:5]  # Limit to top 5 keywords
    }
    return metadata

async def create_news_embed(article, title_prefix):
    try:
        metadata = article
        description = metadata.get('description', '')
        if asyncio.iscoroutine(description):
            description = await description
        description = truncate_text(description)
        
        embed = discord.Embed(
            title=f"{title_prefix} {metadata.get('title', 'No Title')}",
            description=description,
            color=discord.Color.blue()
        )
        
        if metadata.get('url'):
            embed.url = metadata['url']
        if metadata.get('image'):
            embed.set_image(url=metadata['image'])
        if metadata.get('source'):
            embed.set_footer(text=f"Source: {metadata['source']}")
            
        return embed
    except Exception as e:
        logging.error(f"Error creating news embed: {e}")
        return discord.Embed(
            title="Error",
            description="Failed to create news embed",
            color=discord.Color.red()
        )

async def get_country_choices(interaction: discord.Interaction, current: str) -> List[discord.app_commands.Choice]:
    """Get country choices for autocomplete"""
    items = [
        ("us", "United States"),
        ("in", "India"),
        ("gb", "United Kingdom"),
        ("au", "Australia"),
        ("ca", "Canada"),
        ("de", "Germany"),
        ("fr", "France"),
        ("jp", "Japan"),
        ("br", "Brazil"),
        ("mx", "Mexico"),
        ("es", "Spain"),
        ("it", "Italy"),
        ("ru", "Russia"),
        ("cn", "China"),
        ("kr", "South Korea")
    ]
    return [
        discord.app_commands.Choice(name=f"{name} ({code})", value=code)
        for code, name in items
        if current.lower() in name.lower() or current.lower() in code.lower()
    ]

async def get_category_choices(interaction: discord.Interaction, current: str) -> List[discord.app_commands.Choice]:
    """Get category choices for autocomplete"""
    categories = get_all_categories()
    return [
        discord.app_commands.Choice(name=f"{cat.capitalize()} - {desc[:50]}...", value=cat)
        for cat, desc in categories.items()
        if current.lower() in cat.lower() or current.lower() in desc.lower()
    ]

def create_error_embed(title: str, description: str) -> discord.Embed:
    """Create a standardized error embed"""
    return discord.Embed(
        title=f"❌ {title}",
        description=description,
        color=discord.Color.red()
    )

def create_success_embed(title: str, description: str) -> discord.Embed:
    """Create a standardized success embed"""
    return discord.Embed(
        title=f"✅ {title}",
        description=description,
        color=discord.Color.green()
    )

def create_info_embed(title: str, description: str) -> discord.Embed:
    """Create a standardized info embed"""
    return discord.Embed(
        title=f"ℹ️ {title}",
        description=description,
        color=discord.Color.blue()
    )

def create_warning_embed(title: str, description: str) -> discord.Embed:
    """Create a standardized warning embed"""
    return discord.Embed(
        title=f"⚠️ {title}",
        description=description,
        color=discord.Color.yellow()
    )

def create_pagination_embed(items: List[Dict], page: int, per_page: int = 10, 
                          title: str = "Results", color: discord.Color = discord.Color.blue()) -> discord.Embed:
    """Create a paginated embed for lists of items"""
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    current_items = items[start_idx:end_idx]
    
    embed = discord.Embed(
        title=title,
        color=color
    )
    
    for i, item in enumerate(current_items, start=start_idx + 1):
        embed.add_field(
            name=f"{i}. {item.get('title', 'No Title')}",
            value=item.get('description', 'No description'),
            inline=False
        )
    
    total_pages = (len(items) + per_page - 1) // per_page
    embed.set_footer(text=f"Page {page} of {total_pages} • {len(items)} items total")
    
    return embed

def create_progress_embed(title: str, description: str, progress: float, 
                         color: discord.Color = discord.Color.blue()) -> discord.Embed:
    """Create a progress bar embed"""
    progress = max(0, min(1, progress))  # Clamp between 0 and 1
    bar_length = 20
    filled_length = int(bar_length * progress)
    bar = '█' * filled_length + '░' * (bar_length - filled_length)
    
    embed = discord.Embed(
        title=title,
        description=f"{description}\n\n`{bar}` {progress:.1%}",
        color=color
    )
    
    return embed

def create_confirmation_embed(title: str, description: str, 
                            confirm_label: str = "Confirm", 
                            cancel_label: str = "Cancel") -> discord.Embed:
    """Create a confirmation dialog embed"""
    embed = discord.Embed(
        title=f"⚠️ {title}",
        description=f"{description}\n\nClick the buttons below to confirm or cancel.",
        color=discord.Color.yellow()
    )
    
    return embed
