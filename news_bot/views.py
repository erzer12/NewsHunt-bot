import discord
from discord.ui import View, Button
from summarizer import summarize_article
from database import add_bookmark
from translation import translate_text

class NewsPaginator(View):
    def __init__(self, articles, user_id, is_rss=False):
        super().__init__(timeout=180)
        self.articles = articles
        self.user_id = user_id
        self.is_rss = is_rss
        self.index = 0

        self.prev_btn = Button(emoji="⬅️", style=discord.ButtonStyle.secondary)
        self.next_btn = Button(emoji="➡️", style=discord.ButtonStyle.secondary)
        self.summarize_btn = Button(label="Summarize", style=discord.ButtonStyle.primary)
        self.bookmark_btn = Button(emoji="🔖", style=discord.ButtonStyle.success)
        self.trash_btn = Button(emoji="🗑️", style=discord.ButtonStyle.danger)

        self.prev_btn.callback = self.prev_article
        self.next_btn.callback = self.next_article
        self.summarize_btn.callback = self.summarize_article
        self.bookmark_btn.callback = self.bookmark_article
        self.trash_btn.callback = self.delete_msg

        self.add_item(self.prev_btn)
        self.add_item(self.next_btn)
        self.add_item(self.summarize_btn)
        self.add_item(self.bookmark_btn)
        self.add_item(self.trash_btn)

    def get_embed(self):
        art = self.articles[self.index]
        title = art.get("title", "No Title")
        url = art.get("url") or art.get("link")
        desc = art.get("description") or art.get("summary") or ""
        embed = discord.Embed(
            title=f"{title}",
            url=url,
            description=desc[:2048]
        )
        if art.get("published"):
            embed.set_footer(text=art["published"])
        return embed

    async def update_message(self, interaction):
        await interaction.response.edit_message(embed=self.get_embed(), view=self)

    async def prev_article(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return
        self.index = (self.index - 1) % len(self.articles)
        await self.update_message(interaction)

    async def next_article(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return
        self.index = (self.index + 1) % len(self.articles)
        await self.update_message(interaction)

    async def summarize_article(self, interaction: discord.Interaction):
        art = self.articles[self.index]
        url = art.get("url") or art.get("link")
        summary = summarize_article(url)
        langs = art.get("language_codes") or ["en"]
        translated = translate_text(summary, langs[0])
        embed = discord.Embed(
            title="Summary",
            description=translated[:2048],
            url=url
        )
        await interaction.response.send_message(embed=embed, ephemeral=True)

    async def bookmark_article(self, interaction: discord.Interaction):
        art = self.articles[self.index]
        url = art.get("url") or art.get("link")
        title = art.get("title", "No Title")
        add_bookmark(interaction.user.id, url, title)
        await interaction.response.send_message("✅ Bookmarked!", ephemeral=True)

    async def delete_msg(self, interaction: discord.Interaction):
        await interaction.message.delete()

class HelpMenuView(View):
    def __init__(self):
        super().__init__(timeout=120)
        self.show_all_btn = Button(label="Show All", style=discord.ButtonStyle.primary)
        self.news_btn = Button(label="News Commands", style=discord.ButtonStyle.secondary)
        self.bookmark_btn = Button(label="Bookmark Commands", style=discord.ButtonStyle.secondary)
        self.prefs_btn = Button(label="Preferences", style=discord.ButtonStyle.secondary)
        self.local_btn = Button(label="Local/RSS", style=discord.ButtonStyle.secondary)

        self.show_all_btn.callback = self.show_all
        self.news_btn.callback = self.show_news
        self.bookmark_btn.callback = self.show_bookmark
        self.prefs_btn.callback = self.show_prefs
        self.local_btn.callback = self.show_local

        self.add_item(self.show_all_btn)
        self.add_item(self.news_btn)
        self.add_item(self.bookmark_btn)
        self.add_item(self.prefs_btn)
        self.add_item(self.local_btn)

    async def show_all(self, interaction):
        await interaction.response.edit_message(embed=self.get_help_embed("all"), view=self)

    async def show_news(self, interaction):
        await interaction.response.edit_message(embed=self.get_help_embed("news"), view=self)

    async def show_bookmark(self, interaction):
        await interaction.response.edit_message(embed=self.get_help_embed("bookmark"), view=self)

    async def show_prefs(self, interaction):
        await interaction.response.edit_message(embed=self.get_help_embed("prefs"), view=self)

    async def show_local(self, interaction):
        await interaction.response.edit_message(embed=self.get_help_embed("local"), view=self)

    def get_help_embed(self, section):
        embed = discord.Embed(title="📰 NewsBot Help", color=discord.Color.blue())
        if section == "all":
            embed.description = (
                "**News:** `/news`, `/category`, `/trending`, `/flashnews`, `/search`, `/summarize`"
                "\n**Local:** `/localnews`"
                "\n**Bookmarks:** `/bookmark`, `/bookmarks`, `/remove_bookmark`"
                "\n**Preferences:** `/setcountry`, `/setlang`, `/dailynews`, `/setchannel`"
                "\n**Help:** `/help`"
            )
        elif section == "news":
            embed.description = (
                "`/news [count]` — Top headlines\n"
                "`/category <cat>` — Category news\n"
                "`/trending` — Trending\n"
                "`/flashnews` — Breaking news\n"
                "`/search <query>` — Search\n"
                "`/summarize <url>` — Summarize article"
            )
        elif section == "bookmark":
            embed.description = (
                "`/bookmark <url> <title>` — Bookmark\n"
                "`/bookmarks` — List bookmarks\n"
                "`/remove_bookmark <index>` — Remove"
            )
        elif section == "prefs":
            embed.description = (
                "`/setcountry <code>` — Set country\n"
                "`/setlang <codes>` — Set language(s)\n"
                "`/dailynews <on/off>` — Daily news\n"
                "`/setchannel <channel>` — (admin) set news channel"
            )
        elif section == "local":
            embed.description = (
                "`/localnews <place>` — Local/city news via RSS"
            )
        return embed
