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
        self.style = "default"  # default, compact, detailed
        self.sort_by = "date"  # date, title, source
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

    def get_embed(self):
        if not self.articles:
            return discord.Embed(title="No Articles", description="No articles to display.")
        art = self.articles[self.index]
        return create_news_embed(art, style=self.style)

    async def update_message(self, interaction):
        embed = self.get_embed()
        embed.set_footer(text=f"Article {self.index + 1} of {len(self.articles)}")
        await interaction.response.edit_message(embed=embed, view=self)

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
            number = TextInput(
                label="Article Number",
                placeholder=f"Enter a number between 1 and {len(self.articles)}",
                min_length=1,
                max_length=2
            )
            
            async def on_submit(self, interaction: discord.Interaction):
                try:
                    num = int(self.number.value)
                    if 1 <= num <= len(self.articles):
                        self.index = num - 1
                        await self.update_message(interaction)
                    else:
                        await interaction.response.send_message(
                            f"Please enter a number between 1 and {len(self.articles)}",
                            ephemeral=True
                        )
                except ValueError:
                    await interaction.response.send_message(
                        "Please enter a valid number",
                        ephemeral=True
                    )
        
        await interaction.response.send_modal(JumpModal())

    async def summarize_article(self, interaction: discord.Interaction):
        art = self.articles[self.index]
        url = art.get("url") or art.get("link")
        
        # Create a modal for summary options
        class SummaryModal(Modal, title="Summary Options"):
            length = TextInput(
                label="Length",
                placeholder="short, medium, or long",
                default="medium",
                required=True
            )
            style = TextInput(
                label="Style",
                placeholder="paragraph, bullet, or numbered",
                default="paragraph",
                required=True
            )
            
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
                    await interaction.message.edit(embed=progress_embed)
                    
                    # Translate summary
                    langs = art.get("language_codes") or ["en"]
                    translated = translate_text(result["summary"], langs[0])
                    
                    # Create final embed
                    embed = create_info_embed(
                        "Article Summary",
                        translated
                    )
                    if result["metadata"] and result["metadata"]["top_image"]:
                        embed.set_image(url=result["metadata"]["top_image"])
                    
                    # Update with final result
                    await interaction.message.edit(embed=embed)
                else:
                    await interaction.message.edit(
                        embed=create_error_embed("Summary Failed", result["error"])
                    )
        
        await interaction.response.send_modal(SummaryModal())

    async def bookmark_article(self, interaction: discord.Interaction):
        art = self.articles[self.index]
        url = art.get("url") or art.get("link")
        title = art.get("title", "No Title")
        
        # Create confirmation modal
        class BookmarkModal(Modal, title="Add Bookmark"):
            note = TextInput(
                label="Note (optional)",
                placeholder="Add a note to this bookmark",
                required=False,
                max_length=200
            )
            
            async def on_submit(self, interaction: discord.Interaction):
                add_bookmark(interaction.user.id, url, title, self.note.value)
                await interaction.response.send_message(
                    embed=create_success_embed(
                        "Bookmark Added",
                        f"✅ Added '{title}' to your bookmarks" + 
                        (f"\nNote: {self.note.value}" if self.note.value else "")
                    ),
                    ephemeral=True
                )
        
        await interaction.response.send_modal(BookmarkModal())

    async def share_article(self, interaction: discord.Interaction):
        art = self.articles[self.index]
        url = art.get("url") or art.get("link")
        title = art.get("title", "No Title")
        
        # Create a share menu
        class ShareMenu(View):
            def __init__(self):
                super().__init__(timeout=60)
                
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
                    note = TextInput(
                        label="Note",
                        placeholder="Add a note to share with the article",
                        required=True,
                        max_length=200
                    )
                    
                    async def on_submit(self, interaction: discord.Interaction):
                        await interaction.response.send_message(
                            f"📰 **{title}**\n{self.note.value}\n\n{url}",
                            allowed_mentions=discord.AllowedMentions.none()
                        )
                
                await button_interaction.response.send_modal(ShareNoteModal())
        
        await interaction.response.send_message(
            "Choose how to share this article:",
            view=ShareMenu(),
            ephemeral=True
        )

    async def change_style(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return
        self.style = interaction.data["values"][0]
        await self.update_message(interaction)

    async def change_sort(self, interaction: discord.Interaction):
        if interaction.user.id != self.user_id:
            await interaction.response.send_message("Not your paginator.", ephemeral=True)
            return
            
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
            def __init__(self):
                super().__init__(timeout=30)
                
            @discord.ui.button(label="Confirm", style=discord.ButtonStyle.danger)
            async def confirm(self, button_interaction: discord.Interaction, button: discord.ui.Button):
                if button_interaction.user.id != self.user_id:
                    await button_interaction.response.send_message("Not your message.", ephemeral=True)
                    return
                try:
                    await interaction.message.delete()
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
                await button_interaction.message.delete()
        
        await interaction.response.send_message(
            embed=confirm_embed,
            view=ConfirmDelete(),
            ephemeral=True
        )

class HelpMenuView(View):
    def __init__(self):
        super().__init__(timeout=300)  # 5 minutes timeout
        
        # Main category buttons
        self.show_all_btn = Button(label="Show All", style=discord.ButtonStyle.primary, row=0)
        self.news_btn = Button(label="News Commands", style=discord.ButtonStyle.secondary, row=0)
        self.bookmark_btn = Button(label="Bookmark Commands", style=discord.ButtonStyle.secondary, row=0)
        self.prefs_btn = Button(label="Preferences", style=discord.ButtonStyle.secondary, row=0)
        self.local_btn = Button(label="Local/RSS", style=discord.ButtonStyle.secondary, row=0)
        
        # Additional help buttons
        self.examples_btn = Button(label="Examples", style=discord.ButtonStyle.secondary, row=1)
        self.tips_btn = Button(label="Tips & Tricks", style=discord.ButtonStyle.secondary, row=1)
        self.faq_btn = Button(label="FAQ", style=discord.ButtonStyle.secondary, row=1)
        self.search_btn = Button(label="Search Help", style=discord.ButtonStyle.secondary, row=1)

        # Set callbacks
        self.show_all_btn.callback = self.show_all
        self.news_btn.callback = self.show_news
        self.bookmark_btn.callback = self.show_bookmark
        self.prefs_btn.callback = self.show_prefs
        self.local_btn.callback = self.show_local
        self.examples_btn.callback = self.show_examples
        self.tips_btn.callback = self.show_tips
        self.faq_btn.callback = self.show_faq
        self.search_btn.callback = self.show_search

        # Add items
        self.add_item(self.show_all_btn)
        self.add_item(self.news_btn)
        self.add_item(self.bookmark_btn)
        self.add_item(self.prefs_btn)
        self.add_item(self.local_btn)
        self.add_item(self.examples_btn)
        self.add_item(self.tips_btn)
        self.add_item(self.faq_btn)
        self.add_item(self.search_btn)

    def get_help_embed(self, section):
        embed = discord.Embed(title="📰 NewsBot Help", color=discord.Color.blue())
        
        if section == "all":
            embed.description = (
                "**News Commands:**\n"
                "• `/news [count]` — Get top headlines\n"
                "• `/category <cat>` — Get category news\n"
                "• `/trending` — Get trending news\n"
                "• `/flashnews` — Get breaking news\n"
                "• `/search <query>` — Search news\n"
                "• `/summarize <url>` — Summarize article\n\n"
                "**Local News:**\n"
                "• `/localnews <place>` — Get local news\n\n"
                "**Bookmark Commands:**\n"
                "• `/bookmark <url> <title>` — Save article\n"
                "• `/bookmarks` — List bookmarks\n"
                "• `/remove_bookmark <index>` — Remove bookmark\n\n"
                "**Preferences:**\n"
                "• `/setcountry <code>` — Set country\n"
                "• `/setlang <codes>` — Set language(s)\n"
                "• `/dailynews <on/off>` — Toggle daily news\n"
                "• `/setchannel <channel>` — Set news channel"
            )
        elif section == "news":
            embed.description = (
                "**News Commands:**\n\n"
                "`/news [count]`\n"
                "• Get today's top headlines\n"
                "• Optional: specify number of articles (default: 5)\n"
                "• Example: `/news 10` for 10 articles\n\n"
                "`/category <cat> [count]`\n"
                "• Get news by category\n"
                "• Categories: business, tech, sports, etc.\n"
                "• Optional: specify number of articles\n"
                "• Example: `/category technology 3`\n\n"
                "`/trending`\n"
                "• Get currently trending news\n"
                "• Shows most popular articles\n"
                "• Updates every hour\n\n"
                "`/flashnews`\n"
                "• Get breaking news\n"
                "• Shows latest urgent updates\n"
                "• Real-time updates\n\n"
                "`/search <query> [count]`\n"
                "• Search news by keyword\n"
                "• Optional: specify number of results\n"
                "• Example: `/search AI 5`\n\n"
                "`/summarize <url> [length] [style]`\n"
                "• Summarize any news article\n"
                "• Length: short, medium, long\n"
                "• Style: paragraph, bullet, numbered\n"
                "• Example: `/summarize https://example.com/article length:long style:bullet`"
            )
        elif section == "bookmark":
            embed.description = (
                "**Bookmark Commands:**\n\n"
                "`/bookmark <url> <title>`\n"
                "• Save an article for later\n"
                "• Add a custom title\n"
                "• Works with any news URL\n"
                "• Example: `/bookmark https://example.com/article My Article`\n\n"
                "`/bookmarks`\n"
                "• List all your bookmarks\n"
                "• Shows titles and links\n"
                "• Click to open articles\n"
                "• Sorted by date added\n\n"
                "`/remove_bookmark <index>`\n"
                "• Remove a bookmark\n"
                "• Use index from /bookmarks list\n"
                "• Example: `/remove_bookmark 3`"
            )
        elif section == "prefs":
            embed.description = (
                "**Preference Settings:**\n\n"
                "`/setcountry <code>`\n"
                "• Set your news country\n"
                "• Examples: us, gb, in, au\n"
                "• Affects all news commands\n"
                "• Example: `/setcountry us`\n\n"
                "`/setlang <codes>`\n"
                "• Set preferred language(s)\n"
                "• Comma-separated codes\n"
                "• Example: en,es,fr\n"
                "• Supports multiple languages\n\n"
                "`/dailynews <on/off>`\n"
                "• Toggle daily news digest\n"
                "• Get news in your DMs\n"
                "• Customizable delivery time\n"
                "• Example: `/dailynews on`\n\n"
                "`/setchannel <channel>`\n"
                "• Set server news channel\n"
                "• Admin only command\n"
                "• For server-wide news\n"
                "• Example: `/setchannel #news`"
            )
        elif section == "local":
            embed.description = (
                "**Local News Commands:**\n\n"
                "`/localnews <place>`\n"
                "• Get local news for a place\n"
                "• City or region name\n"
                "• Uses RSS feeds\n"
                "• Auto-translated to your language\n"
                "• Example: `/localnews New York`\n\n"
                "Features:\n"
                "• Real-time local updates\n"
                "• Multiple sources\n"
                "• Customizable region\n"
                "• Language support"
            )
        elif section == "examples":
            embed.description = (
                "**Command Examples:**\n\n"
                "1. Get 3 top headlines:\n"
                "`/news 3`\n\n"
                "2. Get tech news:\n"
                "`/category technology`\n\n"
                "3. Search AI news:\n"
                "`/search artificial intelligence`\n\n"
                "4. Set multiple languages:\n"
                "`/setlang en,es,fr`\n\n"
                "5. Summarize with style:\n"
                "`/summarize https://example.com/article length:long style:bullet`\n\n"
                "6. Get local news:\n"
                "`/localnews Tokyo`\n\n"
                "7. Save a bookmark:\n"
                "`/bookmark https://example.com/article Important News`"
            )
        elif section == "tips":
            embed.description = (
                "**Tips & Tricks:**\n\n"
                "• Use `/news` with different counts to get more or fewer articles\n"
                "• Combine `/search` with categories for better results\n"
                "• Use `/summarize` with different styles for better readability\n"
                "• Set multiple languages to get news in different languages\n"
                "• Use `/bookmark` to save interesting articles for later\n"
                "• Enable daily news to never miss important updates\n"
                "• Use `/localnews` to stay updated with your area\n"
                "• Try different summary lengths for different needs\n"
                "• Use bookmarks to create your own news collection\n"
                "• Combine commands for better results"
            )
        elif section == "faq":
            embed.description = (
                "**Frequently Asked Questions:**\n\n"
                "Q: How do I change my country?\n"
                "A: Use `/setcountry` followed by the country code\n\n"
                "Q: Can I get news in multiple languages?\n"
                "A: Yes! Use `/setlang` with comma-separated language codes\n\n"
                "Q: How do I get daily news updates?\n"
                "A: Use `/dailynews on` to enable daily news in your DMs\n\n"
                "Q: Can I summarize any news article?\n"
                "A: Yes! Use `/summarize` with any news URL\n\n"
                "Q: How do I remove a bookmark?\n"
                "A: Use `/bookmarks` to see the list, then `/remove_bookmark` with the number\n\n"
                "Q: What's the difference between /news and /trending?\n"
                "A: /news shows latest articles, while /trending shows most popular ones\n\n"
                "Q: Can I get news from multiple sources?\n"
                "A: Yes! The bot aggregates news from various reliable sources"
            )
        elif section == "search":
            embed.description = (
                "**Search Help:**\n\n"
                "Basic Search:\n"
                "• `/search <query>` - Search for news\n"
                "• Example: `/search AI`\n\n"
                "Advanced Search:\n"
                "• Use quotes for exact phrases\n"
                "• Example: `/search \"artificial intelligence\"`\n\n"
                "Filtering:\n"
                "• Add category: `/search AI category:technology`\n"
                "• Add date: `/search AI date:today`\n"
                "• Add source: `/search AI source:techcrunch`\n\n"
                "Tips:\n"
                "• Use specific keywords\n"
                "• Combine filters\n"
                "• Try different phrasings\n"
                "• Use quotes for exact matches"
            )
        
        return embed

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

    async def show_examples(self, interaction):
        await interaction.response.edit_message(embed=self.get_help_embed("examples"), view=self)

    async def show_tips(self, interaction):
        await interaction.response.edit_message(embed=self.get_help_embed("tips"), view=self)

    async def show_faq(self, interaction):
        await interaction.response.edit_message(embed=self.get_help_embed("faq"), view=self)
        
    async def show_search(self, interaction):
        await interaction.response.edit_message(embed=self.get_help_embed("search"), view=self)
