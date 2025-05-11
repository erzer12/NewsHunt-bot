# Discord News Bot 🤖

A powerful Discord bot built with Python that delivers customizable news updates using NewsAPI integration. Stay informed with real-time news directly in your Discord server!

## Technologies Used 🛠️
- **Python 3.12** - Core programming language
- **discord.py** - Discord API wrapper for Python
- **SQLite3** - Local database for storing preferences and settings
- **NLTK** - Natural Language Processing for article summarization
- **NewsAPI** - Real-time news data source
- **newspaper3k** - Article extraction and parsing

## Features 📰

### News Delivery
- Real-time news updates
- Breaking news alerts
- Daily news automation
- Customizable news preferences
- Category-based filtering
- Country-specific news

### Article Management
- Smart article summarization
- Interactive navigation
- Article search functionality
- Source credibility tracking

### Customization
- Configurable news channels
- User preference management
- Custom category creation
- Adjustable update frequency

### Commands
- `/news` - Get today's top headlines
- `/search` - Search news by keyword
- `/category` - Get news by category
- `/flashnews` - Get breaking news
- `/setcountry` - Set preferred country
- `/setchannel` - Set channel for daily news
- `/dailynews` - Toggle daily news updates
- `/help` - Show all available commands

## Setup 🚀
1. Clone this repository
2. Install requirements: `pip install -r requirements.txt`
3. Create `.env` file with required API keys:
   - DISCORD_TOKEN
   - NEWS_API_KEY
   - CHANNEL_ID
4. Run the bot: `python news_bot/bot.py`

## Database Structure 💾
- Guild settings for server preferences
- User preferences for personalization
- Custom categories tracking
- News categories management

## Contributing 🤝
Feel free to fork this repository and submit pull requests to contribute to this project!
