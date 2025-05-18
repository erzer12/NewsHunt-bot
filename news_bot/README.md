# News Hunt 🤖

A powerful Discord bot built with Python that delivers customizable news updates using NewsAPI integration, Google News RSS (for local news), and cloud MongoDB storage. Stay informed with real-time news directly in your Discord server!

## Technologies Used 🛠️
- **Python 3.12** - Core programming language
- **discord.py** - Discord API wrapper for Python
- **NLTK** - Natural Language Processing for article summarization
- **NewsAPI** - Real-time news data source (optional, paid for most features)
- **Google News RSS** - Free local & global news source
- **newspaper3k** - Article extraction and parsing
- **MongoDB (Atlas/Cloud)** - Scalable NoSQL cloud database for user data, preferences, and bookmarks
- **pymongo** - MongoDB driver for Python
- **Flask** - Minimal web server for Render deployment
- **feedparser** - For parsing RSS feeds (used for local news)

## Features 📰

### News Delivery
- Real-time news updates (via NewsAPI, if configured)
- Breaking news alerts
- Trending news
- Daily news automation (DM or channel)
- Customizable news preferences
- Category-based filtering
- Country-specific news
- **Local news from any place (via Google News RSS) with the `!news_local` command**

### Article Management
- Smart article summarization
- Interactive navigation (pagination, bookmark, summarize)
- Article search functionality
- Source credibility tracking

### Customization
- Configurable news channels
- User preference management
- Adjustable update frequency

### Commands
- `/news` - Get today's top headlines (NewsAPI)
- `/news_local <place>` - Get latest local news headlines for any place (free via Google News RSS)
- `/search` - Search news by keyword
- `/category` - Get news by category
- `/trending` - Get trending news
- `/flashnews` - Get breaking news
- `/bookmark` - Bookmark an article
- `/bookmarks` - List your bookmarks
- `/remove_bookmark` - Remove a bookmark by index
- `/setcountry` - Set preferred country
- `/setchannel` - Set channel for daily news
- `/dailynews` - Toggle daily news updates
- `/help` - Show all available commands

## Setup 🚀

1. Copy `.env.example` to `.env` and fill in your API keys and MongoDB connection string.
2. Install dependencies:  
   ```bash
   pip install -r requirements.txt
   ```
3. Run:  
   ```bash
   python bot.py
   ```

## Environment Variables

- `DISCORD_TOKEN`: Your Discord bot token
- `NEWS_API_KEY`: NewsAPI key (optional, for extra news features)
- `OPENAI_API_KEY`: OpenAI key (if used)
- `CHANNEL_ID`: Default channel for daily news
- `MONGODB_URI`: Your cloud MongoDB connection string (e.g., from MongoDB Atlas)
- `MONGODB_DB`: Database name (default: `newsbot`)

## MongoDB

This bot uses MongoDB Atlas or any cloud MongoDB for storing user data, bookmarks, and preferences.  
**No local DB files are needed.**

## Local News Fetching (Free)

- Use the `!news_local <place>` command to fetch news headlines for any city, region, or local topic using Google News RSS (no API key required).

## Contributing 🤝

Feel free to fork this repository and submit pull requests to contribute to this project!
