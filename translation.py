from googletrans import Translator
import time

translator = Translator()

def translate_text(text, dest_lang):
    if not text or not dest_lang:
        return text
    try:
        # Add retry logic for stability
        max_retries = 3
        for attempt in range(max_retries):
            try:
                result = translator.translate(text, dest=dest_lang)
                return result.text
            except Exception as e:
                if attempt == max_retries - 1:
                    print(f"Translation failed after {max_retries} attempts: {e}")
                    return text
                time.sleep(1)  # Wait before retrying
    except Exception as e:
        print(f"Translation error: {e}")
        return text
