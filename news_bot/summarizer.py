from newspaper import Article
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
import nltk

def ensure_nltk_data():
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')

ensure_nltk_data()

def local_summarize(text, num_sentences=3):
    sentences = sent_tokenize(text)
    if len(sentences) <= num_sentences:
        return ' '.join(sentences)
    word_freq = {}
    stop_words = set(stopwords.words('english'))
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word not in stop_words and word.isalnum():
                word_freq[word] = word_freq.get(word, 0) + 1
    sentence_scores = {}
    for sentence in sentences:
        score = 0
        for word in word_tokenize(sentence.lower()):
            if word in word_freq:
                score += word_freq[word]
        sentence_scores[sentence] = score
    summary_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:num_sentences]
    summary_sentences = [s[0] for s in summary_sentences]
    return ' '.join(summary_sentences)

def summarize_article(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        content = article.text
        if not content:
            return "❌ Couldn't extract article content."
        return local_summarize(content)
    except Exception as e:
        return f"❌ Error processing article: {str(e)}"
