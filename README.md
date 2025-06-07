# NewsHunt

A modular Discord bot for international news with country/language preferences, daily news, onboarding, and Render deployment support.

---

## Features
- Get top headlines from NewsAPI in your preferred language.
- Set country and preferred languages.
- Daily news, onboarding, and more.
- Interactive paginator for browsing news.
- Admin channel setup for daily news.
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
- flask ≥ 2.2

See `requirements.txt` for details.

---

## Commands

- `/news` — Top headlines
- `/setcountry <country>` — Set country
- `/setlang <codes>` — Set preferred language codes (comma-separated)
- `/dailynews <true|false>` — Enable/disable daily news DM
- `/category <cat>` — Category news
- `/trending` — Trending news
- `/flashnews` — Breaking news
- `/search <keyword>` — Search news
- `/setchannel <channel>` — Set server channel for daily news (admin)
- `/help` — Show all bot commands (also triggers onboarding once per user)

---

## Environment

- **MongoDB**: Used for all user data and preferences.
- **Flask**: For web server/health check on Render.
- **Render**: Deploy with `render.yaml` in root.

---

## Version History & Logs

### v1.4.0 (2025-06-07)
- Removed translation, bookmarks, summarize, and local news features for a simpler codebase.
- Help and onboarding updated.
- Logging shortened by default.

### v1.3.0 (2025-05-18)
- Full modular rewrite, onboarding, autocomplete, paginator, admin-only `/setchannel`, trending, flash, category, and search commands.

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
