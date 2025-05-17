import discord
from summarizer import summarize_article
from utils import create_news_embed

class NewsPaginator(discord.ui.View):
    def __init__(self, articles, user_id):
        super().__init__(timeout=180)
        self.articles = articles
        self.current_page = 0
        self.user_id = user_id

    @discord.ui.button(label="Previous", style=discord.ButtonStyle.gray)
    async def previous(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Only the command invoker can use the paginator.", ephemeral=True)
            return
        if self.current_page > 0:
            self.current_page -= 1
            await self.update_page(interaction)

    @discord.ui.button(label="Next", style=discord.ButtonStyle.gray)
    async def next(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Only the command invoker can use the paginator.", ephemeral=True)
            return
        if self.current_page < len(self.articles) - 1:
            self.current_page += 1
            await self.update_page(interaction)

    @discord.ui.button(label="Summarize", style=discord.ButtonStyle.primary)
    async def summarize(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.defer()
        article = self.articles[self.current_page]
        summary = summarize_article(article['url'])
        embed = discord.Embed(title="Article Summary", description=summary, color=discord.Color.blue())
        await interaction.followup.send(embed=embed, ephemeral=True)

    @discord.ui.button(label="Bookmark", style=discord.ButtonStyle.success)
    async def bookmark(self, interaction: discord.Interaction, button: discord.ui.Button):
        from database import add_bookmark
        article = self.articles[self.current_page]
        add_bookmark(interaction.user.id, article['url'], article['title'])
        await interaction.response.send_message("✅ Article bookmarked!", ephemeral=True)

    async def update_page(self, interaction: discord.Interaction):
        article = self.articles[self.current_page]
        embed = create_news_embed(article, f"Article {self.current_page + 1}/{len(self.articles)}")
        await interaction.response.edit_message(embed=embed, view=self)

class HelpMenuView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=120)

    @discord.ui.button(label="General", style=discord.ButtonStyle.primary)
    async def general(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="General Commands",
            color=discord.Color.blue(),
            description=(
                "/news [count] - Get today's top headlines\n"
                "/category [category] [count] - Get news by category\n"
                "/search [query] [count] - Search news by keyword\n"
                "/trending - Get trending news\n"
                "/flashnews - Get breaking news"
            )
        )
        await interaction.response.edit_message(embed=embed, view=self)

    @discord.ui.button(label="Bookmarks", style=discord.ButtonStyle.success)
    async def bookmarks(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="Bookmark Commands",
            color=discord.Color.green(),
            description=(
                "/bookmark - Bookmark the current article\n"
                "/bookmarks - List your bookmarks\n"
                "/remove_bookmark [index] - Remove a bookmark"
            )
        )
        await interaction.response.edit_message(embed=embed, view=self)

    @discord.ui.button(label="Preferences", style=discord.ButtonStyle.secondary)
    async def preferences(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="Preferences & Notifications",
            color=discord.Color.purple(),
            description=(
                "/setcountry [country] - Set your preferred country\n"
                "/dailynews [on|off] - Daily news DM digest\n"
                "/setchannel [channel] - Set daily news channel (Admin)"
            )
        )
        await interaction.response.edit_message(embed=embed, view=self)

    @discord.ui.button(label="Show All", style=discord.ButtonStyle.gray)
    async def show_all(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="All Commands",
            color=discord.Color.teal(),
            description=(
                "/news [count] - Get today's top headlines\n"
                "/category [category] [count] - Get news by category\n"
                "/search [query] [count] - Search news by keyword\n"
                "/trending - Get trending news\n"
                "/flashnews - Get breaking news\n"
                "/bookmark - Bookmark the current article\n"
                "/bookmarks - List your bookmarks\n"
                "/remove_bookmark [index] - Remove a bookmark\n"
                "/setcountry [country] - Set your preferred country\n"
                "/dailynews [on|off] - Daily news DM digest\n"
                "/setchannel [channel] - Set daily news channel (Admin)"
            )
        )
        await interaction.response.edit_message(embed=embed, view=self)
