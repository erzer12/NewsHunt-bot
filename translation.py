from googletrans import Translator

translator = Translator()

def translate_text(text, dest_lang):
    if not text or not dest_lang:
        return text
    try:
        result = translator.translate(text, dest=dest_lang)
        return result.text
    except Exception:
        return text
