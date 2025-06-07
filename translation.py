import os
from googletrans import Translator
import asyncio
from functools import partial

translator = Translator()

async def translate_text(text, dest_lang="en", timeout=5):
    if not text:
        return ""
    try:
        # Run translation in a thread pool with timeout
        loop = asyncio.get_running_loop()
        result = await asyncio.wait_for(
            loop.run_in_executor(
                None,
                partial(translator.translate, text, dest=dest_lang)
            ),
            timeout=timeout
        )
        return result.text
    except asyncio.TimeoutError:
        print(f"Translation timeout for text: {text[:50]}...")
        return text  # Return original text if translation times out
    except Exception as e:
        print(f"Translation error: {str(e)}")
        return text  # Return original text if translation fails
