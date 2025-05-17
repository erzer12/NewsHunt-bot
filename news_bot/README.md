# News Bot

A Discord news bot using MongoDB for cloud database storage.

## Features

- Top headlines, search, categories, trending, breaking news
- Summarization
- Bookmarks and user preferences
- Interactive help
- Daily news via DMs or channel

## Setup

1. Copy `.env.example` to `.env` and fill in your API keys and MongoDB connection string.
2. Install dependencies: `pip install -r requirements.txt`
3. Run: `python bot.py`

## Environment variables

- `DISCORD_TOKEN`: Your Discord bot token
- `NEWS_API_KEY`: NewsAPI key
- `OPENAI_API_KEY`: OpenAI key (if used)
- `CHANNEL_ID`: Default channel for daily news
- `MONGODB_URI`: Your cloud MongoDB connection string
- `MONGODB_DB`: Database name (default: `newsbot`)

## MongoDB

This bot now uses MongoDB Atlas or any cloud MongoDB for storing user data, bookmarks, and preferences.
