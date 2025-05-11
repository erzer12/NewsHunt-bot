import os
import json
import discord
from discord import app_commands
from discord.ext import tasks, commands
import requests
from newspaper import Article
from datetime import datetime
import sqlite3
from typing import Optional, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CHANNEL_ID_STR = os.getenv("CHANNEL_ID")

if not DISCORD_TOKEN:
    raise EnvironmentError("❌ DISCORD_TOKEN not set in environment variables.")
if not NEWS_API_KEY:
    raise EnvironmentError("❌ NEWS_API_KEY not set in environment variables.")

# Country mapping
COUNTRY_MAPPING = {
    "united states": "us",
    "india": "in",
    "united kingdom": "gb",
    "australia": "au",
    "canada": "ca"
    # Add more mappings as needed
}

# News categories and their descriptions
def init_categories_db():
    conn = sqlite3.connect('newsbot.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS categories
                 (name TEXT PRIMARY KEY, description TEXT)''')

    default_categories = {
        'business': 'Business, finance, stocks, markets, cryptocurrencies, startups, and company news',
        'entertainment': 'Movies, TV shows, music, celebrities, gaming, streaming, and arts',
        'technology': 'AI, software, hardware, gadgets, cybersecurity, and tech company updates',
        'sports': 'Football, basketball, cricket, tennis, F1, Olympics, and athlete updates',
        'science': 'Space exploration, physics, biology, climate change, and research breakthroughs',
        'health': 'Medical research, wellness, nutrition, fitness, mental health, and healthcare',
        'politics': 'Government policies, elections, international relations, and political events',
        'environment': 'Climate change, sustainability, renewable energy, and conservation',
        'education': 'Learning trends, academic research, education tech, and student news',
        'automotive': 'Cars, EVs, automotive industry, and future mobility',
        'gaming': 'Video games, esports, gaming hardware, and industry updates',
        'food': 'Culinary trends, restaurants, recipes, and food industry news',
        'travel': 'Tourism, destinations, travel tips, and industry updates',
        'fashion': 'Fashion trends, designers, industry news, and lifestyle',
        'crypto': 'Cryptocurrency, blockchain, NFTs, and digital assets',
        'general': 'Top headlines and breaking news from around the world'
    }

    for name, desc in default_categories.items():
        c.execute("INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)",
                 (name, desc))

    conn.commit()
    conn.close()

class NewsPaginator(discord.ui.View):
    def __init__(self, articles):
        super().__init__(timeout=180)
        self.articles = articles
        self.current_page = 0

    @discord.ui.button(label="Previous", style=discord.ButtonStyle.gray)
    async def previous(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.current_page > 0:
            self.current_page -= 1
            await self.update_page(interaction)

    @discord.ui.button(label="Next", style=discord.ButtonStyle.gray)
    async def next(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.current_page < len(self.articles) - 1:
            self.current_page += 1
            await self.update_page(interaction)

    @discord.ui.button(label="Summarize", style=discord.ButtonStyle.primary)
    async def summarize(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.defer()
        article = self.articles[self.current_page]
        summary = await summarize_article(article['url'])
        embed = discord.Embed(title="Article Summary", description=summary, color=discord.Color.blue())
        await interaction.followup.send(embed=embed)

    async def update_page(self, interaction: discord.Interaction):
        article = self.articles[self.current_page]
        embed = create_news_embed(article, f"Article {self.current_page + 1}/{len(self.articles)}")
        await interaction.response.edit_message(embed=embed, view=self)

class NewsBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(command_prefix="!", intents=intents)
        self.db_init()

    async def setup_hook(self):
        try:
            print("Syncing commands...")
            await self.tree.sync()
            print("✅ Commands synced successfully")
            self.post_daily_news.start()
        except Exception as e:
            print(f"❌ Error syncing commands: {e}")

    def db_init(self):
        try:
            conn = sqlite3.connect('newsbot.db')
            c = conn.cursor()
            c.execute('''CREATE TABLE IF NOT EXISTS guild_settings
                        (guild_id INTEGER PRIMARY KEY, news_channel_id INTEGER, daily_news INTEGER)''')
            c.execute('''CREATE TABLE IF NOT EXISTS user_preferences
                        (user_id INTEGER PRIMARY KEY, country TEXT, category TEXT, article_count INTEGER)''')
            c.execute('''CREATE TABLE IF NOT EXISTS custom_categories
                        (category TEXT PRIMARY KEY, description TEXT, usage_count INTEGER DEFAULT 1)''')
            conn.commit()
            print("✅ Database initialized successfully")
        except sqlite3.Error as e:
            print(f"❌ Database initialization error: {e}")
        finally:
            conn.close()

    async def add_custom_category(self, category: str, description: str = "Custom category"):
        conn = sqlite3.connect('newsbot.db')
        c = conn.cursor()
        try:
            c.execute("INSERT OR REPLACE INTO custom_categories (category, description, usage_count) VALUES (?, ?, COALESCE((SELECT usage_count + 1 FROM custom_categories WHERE category = ?), 1))", 
                     (category.lower(), description, category.lower()))
            conn.commit()
        finally:
            conn.close()

    async def get_all_categories(self):
        conn = sqlite3.connect('newsbot.db')
        c = conn.cursor()
        try:
            c.execute("SELECT name, description FROM categories")
            all_categories = {row[0]: row[1] for row in c.fetchall()}
            return all_categories
        finally:
            conn.close()

    @tasks.loop(hours=24)
    async def post_daily_news(self):
        conn = sqlite3.connect('newsbot.db')
        c = conn.cursor()
        c.execute("SELECT guild_id, news_channel_id FROM guild_settings WHERE daily_news = 1")
        guilds = c.fetchall()
        conn.close()

        for guild_id, channel_id in guilds:
            channel = self.get_channel(channel_id)
            if channel:
                await send_news_to_channel(channel)

client = NewsBot()
init_categories_db()

def create_news_embed(article, title_prefix=""):
    embed = discord.Embed(
        title=f"{title_prefix} {article['title']}",
        url=article['url'],
        description=article['description'],
        color=discord.Color.blue()
    )
    if article.get('urlToImage'):
        embed.set_image(url=article['urlToImage'])
    embed.add_field(name="Source", value=article['source']['name'])
    embed.set_footer(text=f"Published at: {article['publishedAt']}")
    return embed

@client.tree.command(name="help", description="Show all available commands")
async def help_command(interaction: discord.Interaction):
    embed = discord.Embed(title="📰 NewsBot Commands", color=discord.Color.blue())
    commands = {
        "/search": "Search news by keyword",
        "/category": "Get news by category",
        "/flashnews": "Get breaking news",
        "/setcountry": "Set your preferred country",
        "/setchannel": "Set channel for daily news (Admin only)",
        "/dailynews": "Toggle daily news updates"
    }
    for cmd, desc in commands.items():
        embed.add_field(name=cmd, value=desc, inline=False)
    await interaction.response.send_message(embed=embed)

@client.tree.command(name="news", description="Get today's top headlines")
async def news(interaction: discord.Interaction, count: int = 5):
    await interaction.response.defer()

    conn = sqlite3.connect('newsbot.db')
    c = conn.cursor()
    c.execute("SELECT country FROM user_preferences WHERE user_id = ?", (interaction.user.id,))
    result = c.fetchone()
    country = result[0] if result else "us"
    conn.close()

    url = f'https://newsapi.org/v2/top-headlines?country={country}&apiKey={NEWS_API_KEY}'
    try:
        response = requests.get(url)
        data = response.json()

        if data['status'] == 'ok' and data['articles']:
            articles = data['articles'][:count]
            view = NewsPaginator(articles)
            embed = create_news_embed(articles[0], "Article 1/{len(articles)}")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No news found.")
    except Exception as e:
        await interaction.followup.send(f"❌ Error fetching news: {str(e)}")

@client.tree.command(name="setcountry", description="Set your preferred country")
async def setcountry(interaction: discord.Interaction, country: str):
    country_code = country.lower()
    if country_code in COUNTRY_MAPPING.values():
        pass
    elif country.lower() in COUNTRY_MAPPING:
        country_code = COUNTRY_MAPPING[country.lower()]
    else:
        await interaction.response.send_message("❌ Invalid country. Please use a valid country code or name.")
        return

    conn = sqlite3.connect('newsbot.db')
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO user_preferences (user_id, country) VALUES (?, ?)",
              (interaction.user.id, country_code))
    conn.commit()
    conn.close()

    await interaction.response.send_message(f"✅ Country preference set to: {country_code}")

@client.tree.command(name="search", description="Search news by keyword")
async def search(interaction: discord.Interaction, query: str, count: int = 5):
    await interaction.response.defer()

    url = f'https://newsapi.org/v2/everything?q={query}&sortBy=relevancy&apiKey={NEWS_API_KEY}'
    try:
        response = requests.get(url)
        data = response.json()

        if data['status'] == 'ok' and data['articles']:
            # If search successful, add query as custom category
            await client.add_custom_category(query, f"News related to {query}")
            articles = data['articles'][:count]
            view = NewsPaginator(articles)
            embed = create_news_embed(articles[0], f"Search Results: {query}")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No results found.")
    except Exception as e:
        await interaction.followup.send(f"❌ Error searching news: {str(e)}")

async def category_autocomplete(interaction: discord.Interaction, current: str) -> List[app_commands.Choice[str]]:
    all_categories = await client.get_all_categories()
    return [
        app_commands.Choice(name=f"{cat.capitalize()} - {desc[:50]}...", value=cat)
        for cat, desc in all_categories.items()
        if current.lower() in cat.lower() or current.lower() in desc.lower()
    ]

@client.tree.command(name="category", description="Get news by category")
@app_commands.autocomplete(category=category_autocomplete)
async def category(interaction: discord.Interaction, category: str, count: int = 5):
    all_categories = await client.get_all_categories()

    if category.lower() not in all_categories.keys():
        embed = discord.Embed(title="📰 Available News Categories", color=discord.Color.blue())
        for cat, desc in all_categories.items():
            embed.add_field(name=cat.capitalize(), value=desc, inline=False)
        await interaction.response.send_message(embed=embed)
        return

    await interaction.response.defer()
    url = f'https://newsapi.org/v2/top-headlines?category={category.lower()}&apiKey={NEWS_API_KEY}'

    try:
        response = requests.get(url)
        data = response.json()

        if data['status'] == 'ok' and data['articles']:
            articles = data['articles'][:count]
            view = NewsPaginator(articles)
            embed = create_news_embed(articles[0], f"Category: {category}")
            await interaction.followup.send(embed=embed, view=view)
        else:
            await interaction.followup.send("❌ No news found in this category.")
    except Exception as e:
        await interaction.followup.send(f"❌ Error fetching category news: {str(e)}")

@client.tree.command(name="flashnews", description="Get breaking news")
async def flashnews(interaction: discord.Interaction):
    await interaction.response.defer()
    
    # Get user's country preference
    conn = sqlite3.connect('newsbot.db')
    c = conn.cursor()
    c.execute("SELECT country FROM user_preferences WHERE user_id = ?", (interaction.user.id,))
    result = c.fetchone()
    country = result[0] if result else "us"
    conn.close()

    # Get breaking news with relevancy sorting
    url = f'https://newsapi.org/v2/top-headlines?country={country}&sortBy=relevancy&apiKey={NEWS_API_KEY}'

    try:
        response = requests.get(url)
        data = response.json()

        if data['status'] == 'ok' and data['articles']:
            articles = [a for a in data['articles'] if a.get('description') and 'breaking' in a.get('description', '').lower()]
            if not articles:
                articles = data['articles']  # Fallback to regular news if no breaking news
            
            article = articles[0]  # Get the most relevant breaking news
            embed = create_news_embed(article, "🚨 BREAKING NEWS")
            await interaction.followup.send(embed=embed)
        else:
            await interaction.followup.send("❌ No breaking news available.")
    except Exception as e:
        await interaction.followup.send(f"❌ Error fetching breaking news: {str(e)}")

@client.tree.command(name="setchannel", description="Set channel for daily news (Admin only)")
@app_commands.checks.has_permissions(administrator=True)
async def setchannel(interaction: discord.Interaction, channel: discord.TextChannel):
    conn = sqlite3.connect('newsbot.db')
    c = conn.cursor()
    c.execute("INSERT OR REPLACE INTO guild_settings (guild_id, news_channel_id) VALUES (?, ?)",
              (interaction.guild_id, channel.id))
    conn.commit()
    conn.close()

    await interaction.response.send_message(f"✅ Daily news channel set to: {channel.mention}")

@client.tree.command(name="dailynews", description="Toggle daily news updates")
@app_commands.checks.has_permissions(administrator=True)
async def dailynews(interaction: discord.Interaction, enabled: bool):
    conn = sqlite3.connect('newsbot.db')
    c = conn.cursor()
    c.execute("UPDATE guild_settings SET daily_news = ? WHERE guild_id = ?",
              (1 if enabled else 0, interaction.guild_id))
    conn.commit()
    conn.close()

    status = "enabled" if enabled else "disabled"
    await interaction.response.send_message(f"✅ Daily news {status}")

import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
nltk.download('punkt')
nltk.download('stopwords')

async def local_summarize(text, num_sentences=3):
    sentences = sent_tokenize(text)
    if len(sentences) <= num_sentences:
        return ' '.join(sentences)

    # Calculate sentence scores based on word frequency
    word_freq = {}
    stop_words = set(stopwords.words('english'))

    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word not in stop_words and word.isalnum():
                word_freq[word] = word_freq.get(word, 0) + 1

    sentence_scores = {}
    for sentence in sentences:
        score = 0
        for word in word_tokenize(sentence.lower()):
            if word in word_freq:
                score += word_freq[word]
        sentence_scores[sentence] = score

    # Get top sentences
    summary_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:num_sentences]
    summary_sentences = [s[0] for s in summary_sentences]

    return ' '.join(summary_sentences)

async def summarize_article(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        content = article.text

        if not content:
            return "❌ Couldn't extract article content."

        # Split into sentences and remove empty ones
        sentences = [s.strip() for s in content.split('.') if s.strip()]

        # Calculate sentence scores based on word frequency
        word_freq = {}
        for sentence in sentences:
            for word in sentence.lower().split():
                if word.isalnum():
                    word_freq[word] = word_freq.get(word, 0) + 1

        # Score sentences based on word importance
        sentence_scores = []
        for sentence in sentences:
            score = sum(word_freq.get(word.lower(), 0) 
                       for word in sentence.split() 
                       if word.isalnum())
            sentence_scores.append((score, sentence))

        # Get top 3 sentences
        sentence_scores.sort(reverse=True)
        summary_sentences = [s[1] for s in sentence_scores[:3]]

        return "📰 Summary:\n" + '. '.join(summary_sentences) + '.'

    except Exception as e:
        return f"❌ Error processing article: {str(e)}"

@client.event
async def on_ready():
    print(f'✅ Logged in as {client.user.name}')
    try:
        synced = await client.tree.sync()
        print(f"Synced {len(synced)} command(s)")
    except Exception as e:
        print(f"❌ Failed to sync commands: {e}")

def main():
    print("🤖 Starting News Bot...")
    client.run(DISCORD_TOKEN)

if __name__ == "__main__":
    main()