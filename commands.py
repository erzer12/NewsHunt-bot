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
    fetch_top_headlines, fetch_news_by_category, fetch_news_by_query, fetch_trending_news
)
from local_news import fetch_rss_news
from translation import translate_text
from summarizer import summarize_article
from views import NewsPaginator, HelpMenuView
from utils import create_news_embed, get_country_choices, get_category_choices, require_registration
from onboard import ONBOARD_MSG

async def setup_commands(bot: commands.Bot):
    tree = bot.tree

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

    @tree.command(name="news", description="Get today's top headlines")
    @require_registration()
    async def news(interaction: discord.Interaction, count: int = 5):
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
    @require_registration()
    async def category(interaction: discord.Interaction, category: str, count: int = 5):
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
    @require_registration()
    async def trending(interaction: discord.Interaction, count: int = 5):
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
    @require_registration()
    async def flashnews(interaction: discord.Interaction):
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
    @require_registration()
    async def search(interaction: discord.Interaction, query: str, count: int = 5):
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
    @require_registration()
    async def summarize(interaction: discord.Interaction, url: str, length: str = "medium"):
        await interaction.response.defer()
        
        # Validate length parameter
        valid_lengths = ["short", "medium", "long"]
        if length not in valid_lengths:
            await interaction.followup.send(
                "❌ Invalid length. Please choose from: short, medium, long",
                ephemeral=True
            )
            return
        
        # Get user's preferred language
        langs = get_user_languages(interaction.user.id)
        language = langs[0]
        
        # Get summary
        result = summarize_article(url, length)
        
        if not result["success"]:
            await interaction.followup.send(
                f"❌ {result['error']}",
                ephemeral=True
            )
            return
        
        # Create main summary embed
        embed = discord.Embed(
            title="📰 Article Summary",
            color=discord.Color.blue(),
            url=url
        )
        
        # Add metadata if available
        if result["metadata"]:
            meta = result["metadata"]
            if meta["title"]:
                embed.add_field(
                    name="Title",
                    value=meta["title"],
                    inline=False
                )
            if meta["authors"]:
                embed.add_field(
                    name="Authors",
                    value=", ".join(meta["authors"]),
                    inline=True
                )
            if meta["publish_date"]:
                embed.add_field(
                    name="Published",
                    value=meta["publish_date"].strftime("%Y-%m-%d %H:%M"),
                    inline=True
                )
            if meta["keywords"]:
                embed.add_field(
                    name="Keywords",
                    value=", ".join(meta["keywords"][:5]),
                    inline=False
                )
        
        # Add summary
        translated_summary = translate_text(result["summary"], language)
        embed.add_field(
            name=f"Summary ({length})",
            value=translated_summary,
            inline=False
        )
        
        # Add image if available
        if result["metadata"] and result["metadata"]["top_image"]:
            embed.set_image(url=result["metadata"]["top_image"])
        
        # Add footer with length info
        embed.set_footer(text=f"Summary length: {length} | Translated to: {language}")
        
        await interaction.followup.send(embed=embed, ephemeral=True)

    @tree.command(name="localnews", description="Get the latest local news via RSS")
    @require_registration()
    async def localnews(interaction: discord.Interaction, place: str):
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
    @require_registration()
    async def bookmark(interaction: discord.Interaction, url: str, title: str):
        add_bookmark(interaction.user.id, url, title)
        await interaction.response.send_message("✅ Article bookmarked!", ephemeral=True)

    @tree.command(name="bookmarks", description="List your bookmarks")
    @require_registration()
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

    @tree.command(name="remove_bookmark", description="Remove a bookmark by index (starts at 1)")
    @require_registration()
    async def remove_bookmark_cmd(interaction: discord.Interaction, index: int):
        marks = get_bookmarks(interaction.user.id)
        if 0 < index <= len(marks):
            removed = remove_bookmark(interaction.user.id, index-1)
            await interaction.response.send_message("✅ Bookmark removed.", ephemeral=True)
        else:
            await interaction.response.send_message("❌ Invalid bookmark index.", ephemeral=True)

    @tree.command(name="setcountry", description="Set your preferred country")
    @app_commands.autocomplete(country=get_country_choices)
    @require_registration()
    async def setcountry(interaction: discord.Interaction, country: str):
        set_user_country(interaction.user.id, country)
        await interaction.response.send_message(f"✅ Country set to: {country}", ephemeral=True)

    @tree.command(name="setlang", description="Set your preferred news language(s) (comma-separated codes)")
    @require_registration()
    async def setlang(interaction: discord.Interaction, languages: str):
        langs = [l.strip() for l in languages.split(",") if l.strip()]
        
        # List of recommended languages with detailed accuracy info
        recommended_langs = {
            "en": {
                "name": "English",
                "accuracy": "Most accurate",
                "best_for": "All content types",
                "sample": "Breaking news: Major developments in technology sector"
            },
            "es": {
                "name": "Spanish",
                "accuracy": "Very accurate",
                "best_for": "General news, politics, sports",
                "sample": "Noticias de última hora: Grandes avances en el sector tecnológico"
            },
            "fr": {
                "name": "French",
                "accuracy": "Very accurate",
                "best_for": "General news, culture, politics",
                "sample": "Dernières nouvelles : Progrès majeurs dans le secteur technologique"
            },
            "de": {
                "name": "German",
                "accuracy": "Very accurate",
                "best_for": "Technical news, business, science",
                "sample": "Eilmeldung: Wichtige Entwicklungen im Technologiesektor"
            },
            "it": {
                "name": "Italian",
                "accuracy": "Very accurate",
                "best_for": "General news, culture, sports",
                "sample": "Ultime notizie: Grandi sviluppi nel settore tecnologico"
            },
            "pt": {
                "name": "Portuguese",
                "accuracy": "Very accurate",
                "best_for": "General news, business, sports",
                "sample": "Últimas notícias: Grandes avanços no setor tecnológico"
            },
            "ru": {
                "name": "Russian",
                "accuracy": "Good accuracy",
                "best_for": "Politics, international news",
                "sample": "Срочные новости: Крупные достижения в технологическом секторе"
            },
            "ja": {
                "name": "Japanese",
                "accuracy": "Good accuracy",
                "best_for": "Technology, business news",
                "sample": "速報：技術セクターでの大きな進展"
            },
            "ko": {
                "name": "Korean",
                "accuracy": "Good accuracy",
                "best_for": "Technology, entertainment news",
                "sample": "속보: 기술 부문의 주요 발전"
            },
            "zh": {
                "name": "Chinese",
                "accuracy": "Good accuracy",
                "best_for": "Business, technology news",
                "sample": "突发新闻：技术领域重大进展"
            }
        }
        
        # Check for non-recommended languages
        non_recommended = [lang for lang in langs if lang not in recommended_langs]
        
        if non_recommended:
            warning_embed = discord.Embed(
                title="⚠️ Warning: Non-Recommended Languages",
                color=discord.Color.yellow(),
                description=(
                    "The following languages are not in our recommended list and may have varying translation accuracy:\n"
                    f"• {', '.join(non_recommended)}\n\n"
                    "**Why We Recommend These Languages:**\n"
                    "• Extensive testing with news content\n"
                    "• High accuracy for technical terms\n"
                    "• Reliable translation of idioms and expressions\n"
                    "• Consistent quality across different news categories\n\n"
                    "**Recommended Languages with Sample Translations:**\n"
                )
            )
            
            # Add fields for each recommended language
            for code, info in recommended_langs.items():
                warning_embed.add_field(
                    name=f"{info['name']} ({code}) - {info['accuracy']}",
                    value=f"Best for: {info['best_for']}\nSample: {info['sample']}",
                    inline=False
                )
            
            warning_embed.add_field(
                name="Would you like to:",
                value=(
                    "1️⃣ **Test Translation** - See how your selected languages perform\n"
                    "2️⃣ **Proceed Anyway** - Set these languages despite the warning\n"
                    "3️⃣ **Cancel** - Choose different languages"
                ),
                inline=False
            )
            
            # Create enhanced confirmation view
            class LangConfirmView(discord.ui.View):
                def __init__(self):
                    super().__init__(timeout=300)  # 5 minutes timeout
                
                @discord.ui.button(label="Test Translation", style=discord.ButtonStyle.primary, emoji="1️⃣")
                async def test(self, button_interaction: discord.Interaction, button: discord.ui.Button):
                    if button_interaction.user.id != interaction.user.id:
                        await button_interaction.response.send_message("This is not your confirmation.", ephemeral=True)
                        return
                    
                    # Test translation
                    test_text = "Breaking news: Major developments in technology sector. New AI models show promising results in medical research."
                    test_embed = discord.Embed(
                        title="🔍 Translation Test Results",
                        color=discord.Color.blue(),
                        description="Here's how your selected languages translate this sample news text:"
                    )
                    
                    for lang in langs:
                        try:
                            translated = translate_text(test_text, lang)
                            test_embed.add_field(
                                name=f"{recommended_langs.get(lang, {}).get('name', lang)} ({lang})",
                                value=translated,
                                inline=False
                            )
                        except Exception as e:
                            test_embed.add_field(
                                name=f"{lang}",
                                value=f"❌ Translation failed: {str(e)}",
                                inline=False
                            )
                    
                    test_embed.add_field(
                        name="Would you like to proceed with these languages?",
                        value="Use the buttons below to confirm or cancel.",
                        inline=False
                    )
                    
                    await button_interaction.response.edit_message(embed=test_embed, view=self)
                
                @discord.ui.button(label="Proceed", style=discord.ButtonStyle.green, emoji="2️⃣")
                async def confirm(self, button_interaction: discord.Interaction, button: discord.ui.Button):
                    if button_interaction.user.id != interaction.user.id:
                        await button_interaction.response.send_message("This is not your confirmation.", ephemeral=True)
                        return
                    set_user_languages(interaction.user.id, langs)
                    await button_interaction.response.edit_message(
                        content=f"✅ Language(s) set to: {', '.join(langs)}",
                        embed=None,
                        view=None
                    )
                
                @discord.ui.button(label="Cancel", style=discord.ButtonStyle.red, emoji="3️⃣")
                async def cancel(self, button_interaction: discord.Interaction, button: discord.ui.Button):
                    if button_interaction.user.id != interaction.user.id:
                        await button_interaction.response.send_message("This is not your confirmation.", ephemeral=True)
                        return
                    await button_interaction.response.edit_message(
                        content="❌ Language setting cancelled.",
                        embed=None,
                        view=None
                    )
            
            await interaction.response.send_message(embed=warning_embed, view=LangConfirmView(), ephemeral=True)
        else:
            set_user_languages(interaction.user.id, langs)
            await interaction.response.send_message(f"✅ Language(s) set to: {', '.join(langs)}", ephemeral=True)

    @tree.command(name="dailynews", description="Toggle your daily news DM digest")
    @require_registration()
    async def dailynews(interaction: discord.Interaction, enabled: bool):
        if enabled:
            add_user_to_daily_news(interaction.user.id)
            await interaction.response.send_message("✅ Daily news enabled! You'll get news in your DMs.", ephemeral=True)
        else:
            remove_user_from_daily_news(interaction.user.id)
            await interaction.response.send_message("✅ Daily news disabled.", ephemeral=True)

    @tree.command(name="setchannel", description="Set channel for daily news (Admin only)")
    @app_commands.checks.has_permissions(administrator=True)
    @require_registration()
    async def setchannel(interaction: discord.Interaction, channel: discord.TextChannel):
        set_guild_news_channel(interaction.guild_id, channel.id)
        await interaction.response.send_message(f"✅ Daily news channel set to: {channel.mention}")

def start_scheduled_tasks(bot):
    @tasks.loop(hours=24)
    async def send_daily_news():
        users = get_daily_news_users()
        for user_id in users:
            try:
                user = await bot.fetch_user(user_id)
                if not user:
                    continue
                    
                country = get_user_country(user_id)
                langs = get_user_languages(user_id)
                language = langs[0] if langs else "en"
                
                articles = fetch_top_headlines(country, 5)
                if articles and user:
                    for article in articles:
                        # Translate title and description
                        article["title"] = translate_text(article["title"], language)
                        article["description"] = translate_text(article.get("description", ""), language)
                        
                        # Create embed with daily news format
                        embed = create_news_embed(article, is_daily=True)
                        
                        try:
                            await user.send(embed=embed)
                        except discord.Forbidden:
                            # User has DMs disabled
                            remove_user_from_daily_news(user_id)
                        except Exception as e:
                            print(f"Error sending daily news to {user_id}: {e}")
            except Exception as e:
                print(f"Error processing daily news for user {user_id}: {e}")
                
    send_daily_news.start()
