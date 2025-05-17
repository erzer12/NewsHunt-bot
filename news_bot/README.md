# News Hunt 🤖

A powerful Discord bot built with Python that delivers customizable news updates using NewsAPI integration and cloud MongoDB storage. Stay informed with real-time news directly in your Discord server!

## Technologies Used 🛠️
- **Python 3.12** - Core programming language
- **discord.py** - Discord API wrapper for Python
- **NLTK** - Natural Language Processing for article summarization
- **NewsAPI** - Real-time news data source
- **newspaper3k** - Article extraction and parsing
- **MongoDB (Atlas/Cloud)** - Scalable NoSQL cloud database for user data, preferences, and bookmarks
- **pymongo** - MongoDB driver for Python

## Features 📰

### News Delivery
- Real-time news updates
- Breaking news alerts
- Trending news
- Daily news automation (DM or channel)
- Customizable news preferences
- Category-based filtering
- Country-specific news

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
- `/news` - Get today's top headlines
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
- `NEWS_API_KEY`: NewsAPI key
- `OPENAI_API_KEY`: OpenAI key (if used)
- `CHANNEL_ID`: Default channel for daily news
- `MONGODB_URI`: Your cloud MongoDB connection string (e.g., from MongoDB Atlas)
- `MONGODB_DB`: Database name (default: `newsbot`)

## MongoDB

This bot uses MongoDB Atlas or any cloud MongoDB for storing user data, bookmarks, and preferences.  
**No local DB files are needed.**

## Contributing 🤝

Feel free to fork this repository and submit pull requests to contribute to this project!
