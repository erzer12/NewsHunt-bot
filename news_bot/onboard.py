import discord
from database import has_onboarded, mark_onboarded

ONBOARD_MSG = (
    "👋 **Welcome to NewsBot!**\n\n"
    "**Quick Setup:**\n"
    "• Set your country: `/setcountry <country_code>`\n"
    "• Set your language(s): `/setlang <lang_codes>`\n\n"
    "**Try these commands:**\n"
    "• `/news` — Top headlines\n"
    "• `/localnews <place>` — Local news via RSS\n"
    "• `/category <category>` — Category news\n"
    "• `/search <keyword>` — Search for news\n"
    "• `/bookmark <url> <title>` — Bookmark an article\n"
    "• `/dailynews <on|off>` — Daily news in DMs\n\n"
    "_Use `/help` any time to see all commands!_\n"
)

async def send_onboarding(user: discord.User):
    if has_onboarded(user.id):
        return
    try:
        await user.send(ONBOARD_MSG)
        mark_onboarded(user.id)
    except Exception:
        pass  # User may have DMs closed
