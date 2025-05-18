# NewsBot

A modular Discord bot for international and local news with automatic translation, country/language preferences, bookmarks, daily news, onboarding, and Render deployment support.

---

## Features
- Get top headlines from NewsAPI in your preferred language.
- Fetch local/city news via Google News RSS, translated to your language.
- Set country and preferred languages.
- Bookmarks, daily news, onboarding, and more.
- Interactive paginator for browsing news.
- Admin channel setup for daily news.
- Summarize articles.
- Search, trending, flash/breaking news.
- Runs as a web service for Render deployment (Flask for health checks).

---

## Setup

1. Copy `.env.example` to `.env` and fill out credentials.
2. `pip install -r requirements.txt`
3. `python bot.py`

**Python version:**  
Tested on **Python 3.10+**

**Main dependencies:**  
- discord.py ≥ 2.3
- pymongo ≥ 4.5
- requests ≥ 2.31
- feedparser ≥ 6.0
- googletrans == 4.0.0rc1
- flask ≥ 2.2
- newspaper3k ≥ 0.2
- nltk ≥ 3.8

See `requirements.txt` for details.

---

## Commands

- `/news` — Top headlines (auto-translated)
- `/localnews <place>` — Local news (auto-translated)
- `/setcountry <country>` — Set country
- `/setlang <codes>` — Set preferred language codes (comma-separated)
- `/bookmark <url> <title>` — Bookmark an article
- `/bookmarks` — List bookmarks
- `/remove_bookmark <index>` — Remove bookmark by index (starts at 1)
- `/dailynews <true|false>` — Enable/disable daily news DM
- `/category <cat>` — Category news
- `/trending` — Trending news
- `/flashnews` — Breaking news
- `/search <keyword>` — Search news
- `/summarize <url>` — Summarize article
- `/setchannel <channel>` — Set server channel for daily news (admin)
- `/help` — Show all bot commands (also triggers onboarding once per user)

---

## Environment

- **MongoDB**: Used for all user data and preferences.
- **Flask**: For web server/health check on Render.
- **Render**: Deploy with `render.yaml` in root.

---

## Version History & Logs

### v1.3.0 (2025-05-18)
- Full modular rewrite
- One-time onboarding per user
- Slash command autocomplete (category/country)
- Interactive paginator for news browsing
- Summarizer command and button
- Admin-only `/setchannel`
- Trending, flash, category, and search commands
- Command logging (see below)

### v1.2.0
- Bookmarks overhaul (add/remove/list)
- Daily news scheduling with MongoDB
- Local news via RSS

### v1.1.0
- Automatic translation for all news
- Per-user country/language preferences

### v1.0.0
- Initial version
- Top headlines, onboarding, basic commands

---

## Command Logs

- Logs are printed to stdout (console) for each command executed, user, and relevant arguments.
- For persistent logs, run with e.g. `python bot.py > logs.txt 2>&1`
- For advanced logging, you can add Python logging (see below for a starter snippet):

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    filename="newsbot.log",
    format="%(asctime)s %(levelname)s %(message)s"
)
logging.info("Bot started.")
```

---

## Render

Keep `render.yaml` in the root for automatic deployment.

---

## License

MIT (add your details here)

---
