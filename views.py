import discord
from discord.ui import View, Button, Select

from utils import (
    create_error_embed, create_success_embed, create_info_embed,
    create_progress_embed,
    create_confirmation_embed, create_news_embed
)

class NewsPaginator(View):
    def __init__(self, articles, user_id):
        super().__init__(timeout=300)  # 5 minutes timeout
        self.articles = articles
        self.user_id = user_id
        self.index = 0
        self.style = "default"
        self.sort_by = "date"
        self.filter_category = None

        # Navigation buttons (all on row 0)
        self.prev_btn = Button(emoji="⬅️", style=discord.ButtonStyle.secondary, row=0)
        self.next_btn = Button(emoji="➡️", style=discord.ButtonStyle.secondary, row=0)
        self.jump_btn = Button(label="Jump to...", style=discord.ButtonStyle.secondary, row=0)
        self.first_btn = Button(emoji="⏮️", style=discord.ButtonStyle.secondary, row=0)
        self.last_btn = Button(emoji="⏭️", style=discord.ButtonStyle.secondary, row=0)

        # Style selector (row 1)
        self.style_select = Select(
            placeholder="Display Style",
            options=[
                discord.SelectOption(label="Default", value="default", description="Standard view"),
                discord.SelectOption(label="Compact", value="compact", description="Minimal view"),
                discord.SelectOption(label="Detailed", value="detailed", description="Full metadata")
            ],
            row=1
        )

        # Sort selector (row 2)
        self.sort_select = Select(
            placeholder="Sort By",
            options=[
                discord.SelectOption(label="Date", value="date", description="Sort by publication date"),
                discord.SelectOption(label="Title", value="title", description="Sort alphabetically"),
                discord.SelectOption(label="Source", value="source", description="Group by source")
            ],
            row=2
        )

        # Set callbacks
        self.prev_btn.callback = self.prev_article
        self.next_btn.callback = self.next_article
        self.jump_btn.callback = self.jump_to_article
        self.first_btn.callback = self.first_article
        self.last_btn.callback = self.last_article
        self.style_select.callback = self.change_style
        self.sort_select.callback = self.change_sort

        # Add items, split across rows
        self.add_item(self.first_btn)
        self.add_item(self.prev_btn)
        self.add_item(self.next_btn)
        self.add_item(self.last_btn)
        self.add_item(self.jump_btn)
        self.add_item(self.style_select)
        self.add_item(self.sort_select)

    async def update_message(self, interaction):
        embed = await self.get_embed()
        embed.set_footer(text=f"Article {self.index + 1} of {len(self.articles)}")
        await interaction.response.edit_message(embed=embed, view=self)

    async def get_embed(self):
        if not self.articles:
            return discord.Embed(title="No Articles", description="No articles to display.")
        art = self.articles[self.index]
        return await create_news_embed(art, f"Article {self.index + 1}/{len(self.articles)}", style=self.style)

    async def first_article(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return
        self.index = 0
        await self.update_message(interaction)

    async def last_article(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return
        self.index = len(self.articles) - 1
        await self.update_message(interaction)

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

    async def jump_to_article(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return

        # Prompt user for article number (simplified, no modal for brevity)
        await interaction.response.send_message(
            f"Please enter the article number (1 to {len(self.articles)}):",
            ephemeral=True
        )
        # In practice, you may want to implement a modal or message collector

    async def change_style(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return
        if hasattr(interaction, 'data') and isinstance(interaction.data, dict) and "values" in interaction.data:
            self.style = interaction.data["values"][0]
            await self.update_message(interaction)

    async def change_sort(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return

        if hasattr(interaction, 'data') and isinstance(interaction.data, dict) and "values" in interaction.data:
            sort_by = interaction.data["values"][0]
            if sort_by == "date":
                self.articles.sort(key=lambda x: x.get("publishedAt") or x.get("published", ""), reverse=True)
            elif sort_by == "title":
                self.articles.sort(key=lambda x: x.get("title", "").lower())
            elif sort_by == "source":
                self.articles.sort(key=lambda x: x.get("source", {}).get("name", "").lower())

            self.sort_by = sort_by
            self.index = 0  # Reset to first article
            await self.update_message(interaction)

# --- HelpMenuView for help command ---

class HelpMenuView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=180)
        self.add_item(
            discord.ui.Button(
                label="Support / Report Issue",
                url="https://github.com/erzer12/NewsHunt-bot/issues",
                style=discord.ButtonStyle.link
            )
        )
