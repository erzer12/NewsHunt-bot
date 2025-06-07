import discord
from discord.ui import View, Button, Select, Modal, TextInput
from summarizer import summarize_article
from database import add_bookmark
from translation import translate_text
from utils import (
    create_error_embed, create_success_embed, create_info_embed,
    create_progress_embed,
    create_confirmation_embed, create_news_embed
)

class NewsPaginator(View):
    def __init__(self, articles, user_id, is_rss=False):
        super().__init__(timeout=300)  # 5 minutes timeout
        self.articles = articles
        self.user_id = user_id
        self.is_rss = is_rss
        self.index = 0
        self.style = "default"
        self.sort_by = "date"
        self.filter_category = None

        # Navigation buttons
        self.prev_btn = Button(emoji="⬅️", style=discord.ButtonStyle.secondary, row=0)
        self.next_btn = Button(emoji="➡️", style=discord.ButtonStyle.secondary, row=0)
        self.jump_btn = Button(label="Jump to...", style=discord.ButtonStyle.secondary, row=0)
        self.first_btn = Button(emoji="⏮️", style=discord.ButtonStyle.secondary, row=0)
        self.last_btn = Button(emoji="⏭️", style=discord.ButtonStyle.secondary, row=0)
        
        # Action buttons
        self.summarize_btn = Button(label="Summarize", style=discord.ButtonStyle.primary, row=1)
        self.bookmark_btn = Button(emoji="🔖", style=discord.ButtonStyle.success, row=1)
        self.share_btn = Button(emoji="📤", style=discord.ButtonStyle.secondary, row=1)
        self.trash_btn = Button(emoji="🗑️", style=discord.ButtonStyle.danger, row=1)
        
        # Style selector
        self.style_select = Select(
            placeholder="Display Style",
            options=[
                discord.SelectOption(label="Default", value="default", description="Standard view"),
                discord.SelectOption(label="Compact", value="compact", description="Minimal view"),
                discord.SelectOption(label="Detailed", value="detailed", description="Full metadata")
            ],
            row=2
        )
        
        # Sort selector
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
        self.summarize_btn.callback = self.summarize_article
        self.bookmark_btn.callback = self.bookmark_article
        self.share_btn.callback = self.share_article
        self.trash_btn.callback = self.delete_msg
        self.style_select.callback = self.change_style
        self.sort_select.callback = self.change_sort

        # Add items
        self.add_item(self.first_btn)
        self.add_item(self.prev_btn)
        self.add_item(self.next_btn)
        self.add_item(self.last_btn)
        self.add_item(self.jump_btn)
        self.add_item(self.summarize_btn)
        self.add_item(self.bookmark_btn)
        self.add_item(self.share_btn)
        self.add_item(self.trash_btn)
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
            
        # Create a modal for article selection
        class JumpModal(Modal, title="Jump to Article"):
            def __init__(self, parent):
                super().__init__()
                self.parent = parent
                self.number = TextInput(
                    label="Article Number",
                    placeholder=f"Enter a number between 1 and {len(parent.articles)}",
                    min_length=1,
                    max_length=2
                )
                self.add_item(self.number)
            
            async def on_submit(self, interaction: discord.Interaction):
                try:
                    num = int(self.number.value)
                    if 1 <= num <= len(self.parent.articles):
                        self.parent.index = num - 1
                        await self.parent.update_message(interaction)
                    else:
                        await interaction.response.send_message(
                            f"Please enter a number between 1 and {len(self.parent.articles)}",
                            ephemeral=True
                        )
                except ValueError:
                    await interaction.response.send_message(
                        "Please enter a valid number",
                        ephemeral=True
                    )
        
        await interaction.response.send_modal(JumpModal(self))

    async def summarize_article(self, interaction: discord.Interaction):
        art = self.articles[self.index]
        url = art.get("url") or art.get("link")
        
        # Create a modal for summary options
        class SummaryModal(Modal, title="Summary Options"):
            def __init__(self, parent):
                super().__init__()
                self.parent = parent
                self.length = TextInput(
                    label="Length",
                    placeholder="short, medium, or long",
                    default="medium",
                    required=True
                )
                self.style = TextInput(
                    label="Style",
                    placeholder="paragraph, bullet, or numbered",
                    default="paragraph",
                    required=True
                )
                self.add_item(self.length)
                self.add_item(self.style)
            
            async def on_submit(self, interaction: discord.Interaction):
                # Show progress embed
                progress_embed = create_progress_embed(
                    "Summarizing Article",
                    "Please wait while we summarize the article...",
                    0.0
                )
                await interaction.response.send_message(embed=progress_embed, ephemeral=True)
                
                # Get summary
                result = summarize_article(url, self.length.value, self.style.value)
                
                if result["success"]:
                    # Update progress
                    progress_embed = create_progress_embed(
                        "Summarizing Article",
                        "Translating summary...",
                        0.5
                    )
                    await interaction.edit_original_response(embed=progress_embed)
                    
                    # Translate summary
                    langs = art.get("language_codes") or ["en"]
                    summary = result["summary"]
                    translated = await translate_text(summary, langs[0]) if summary else summary
                    translated_text = translated if translated else summary
                    if not isinstance(translated_text, str):
                        translated_text = str(translated_text) if translated_text else "No summary available"
                    
                    # Create final embed
                    embed = create_info_embed(
                        "Article Summary",
                        translated_text
                    )
                    metadata = result.get("metadata")
                    if isinstance(metadata, dict) and metadata.get("top_image"):
                        embed.set_image(url=metadata["top_image"])
                    
                    # Update with final result
                    await interaction.edit_original_response(embed=embed)
                else:
                    await interaction.edit_original_response(
                        embed=create_error_embed("Summary Failed", str(result.get("error", "Unknown error")))
                    )
        
        await interaction.response.send_modal(SummaryModal(self))

    async def bookmark_article(self, interaction: discord.Interaction):
        art = self.articles[self.index]
        url = art.get("url") or art.get("link")
        title = art.get("title", "No Title")
        
        # Create confirmation modal
        class BookmarkModal(Modal, title="Add Bookmark"):
            def __init__(self, url, title):
                super().__init__()
                self.url = url
                self.title = title
                self.note = TextInput(
                    label="Note (optional)",
                    placeholder="Add a note to this bookmark",
                    required=False,
                    max_length=200
                )
                self.add_item(self.note)
            
            async def on_submit(self, interaction: discord.Interaction):
                add_bookmark(interaction.user.id, self.url, self.title)
                await interaction.response.send_message(
                    embed=create_success_embed(
                        "Bookmark Added",
                        f"✅ Added '{self.title}' to your bookmarks" + 
                        (f"\nNote: {self.note.value}" if self.note.value else "")
                    ),
                    ephemeral=True
                )
        
        await interaction.response.send_modal(BookmarkModal(url, title))

    async def share_article(self, interaction: discord.Interaction):
        art = self.articles[self.index]
        url = art.get("url") or art.get("link")
        title = art.get("title", "No Title")
        
        # Create a share menu
        class ShareMenu(View):
            def __init__(self, user_id):
                super().__init__(timeout=60)
                self.user_id = user_id
                
            @discord.ui.button(label="Share in Channel", style=discord.ButtonStyle.primary)
            async def share_channel(self, button_interaction: discord.Interaction, button: discord.ui.Button):
                if button_interaction.user.id != self.user_id:
                    await button_interaction.response.send_message("Not your share menu.", ephemeral=True)
                    return
                await button_interaction.response.send_message(
                    f"📰 **{title}**\n{url}",
                    allowed_mentions=discord.AllowedMentions.none()
                )
                
            @discord.ui.button(label="Copy Link", style=discord.ButtonStyle.secondary)
            async def copy_link(self, button_interaction: discord.Interaction, button: discord.ui.Button):
                if button_interaction.user.id != self.user_id:
                    await button_interaction.response.send_message("Not your share menu.", ephemeral=True)
                    return
                await button_interaction.response.send_message(
                    f"Here's the link to share:\n{url}",
                    ephemeral=True
                )
                
            @discord.ui.button(label="Share with Note", style=discord.ButtonStyle.secondary)
            async def share_note(self, button_interaction: discord.Interaction, button: discord.ui.Button):
                if button_interaction.user.id != self.user_id:
                    await button_interaction.response.send_message("Not your share menu.", ephemeral=True)
                    return
                    
                class ShareNoteModal(Modal, title="Share with Note"):
                    def __init__(self):
                        super().__init__()
                        self.note = TextInput(
                            label="Note",
                            placeholder="Add a note to share with the article",
                            required=True,
                            max_length=200
                        )
                        self.add_item(self.note)
                    
                    async def on_submit(self, interaction: discord.Interaction):
                        await interaction.response.send_message(
                            f"📰 **{title}**\n{self.note.value}\n\n{url}",
                            allowed_mentions=discord.AllowedMentions.none()
                        )
                
                await button_interaction.response.send_modal(ShareNoteModal())
        
        await interaction.response.send_message(
            "Choose how to share this article:",
            view=ShareMenu(interaction.user.id),
            ephemeral=True
        )

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

    async def delete_msg(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return
            
        # Create confirmation dialog
        confirm_embed = create_confirmation_embed(
            "Delete Message",
            "Are you sure you want to delete this message?"
        )
        
        class ConfirmDelete(View):
            def __init__(self, user_id):
                super().__init__(timeout=30)
                self.user_id = user_id
                
            @discord.ui.button(label="Confirm", style=discord.ButtonStyle.danger)
            async def confirm(self, button_interaction: discord.Interaction, button: discord.ui.Button):
                if button_interaction.user.id != self.user_id:
                    await button_interaction.response.send_message("Not your message.", ephemeral=True)
                    return
                if button_interaction.message:
                    try:
                        await button_interaction.message.delete()
                    except discord.HTTPException:
                        await button_interaction.response.send_message(
                            "Message already deleted.",
                            ephemeral=True
                        )
                
            @discord.ui.button(label="Cancel", style=discord.ButtonStyle.secondary)
            async def cancel(self, button_interaction: discord.Interaction, button: discord.ui.Button):
                if button_interaction.user.id != self.user_id:
                    await button_interaction.response.send_message("Not your message.", ephemeral=True)
                    return
                if button_interaction.message:
                    await button_interaction.message.delete()
        
        await interaction.response.send_message(
            embed=confirm_embed,
            view=ConfirmDelete(interaction.user.id),
            ephemeral=True
        )

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
        # You can add more buttons (FAQ, Docs, etc.) if needed!
