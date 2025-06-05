from newspaper import Article
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
import nltk
import re

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

def clean_text(text):
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    return text.strip()

def extract_metadata(article):
    metadata = {
        "title": article.title,
        "authors": article.authors,
        "publish_date": article.publish_date,
        "top_image": article.top_image,
        "keywords": article.keywords,
        "summary": article.summary
    }
    return metadata

def local_summarize(text, num_sentences=3, style="paragraph"):
    # Clean the text first
    text = clean_text(text)
    sentences = sent_tokenize(text)
    
    if len(sentences) <= num_sentences:
        if style == "paragraph":
            return ' '.join(sentences)
        elif style == "bullet":
            return '\n• ' + '\n• '.join(sentences)
        elif style == "numbered":
            return '\n'.join(f"{i+1}. {s}" for i, s in enumerate(sentences))
        return ' '.join(sentences)
    
    # Calculate word frequencies
    word_freq = {}
    stop_words = set(stopwords.words('english'))
    
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word not in stop_words and word.isalnum():
                word_freq[word] = word_freq.get(word, 0) + 1
    
    # Score sentences based on word frequency and position
    sentence_scores = {}
    for i, sentence in enumerate(sentences):
        score = 0
        # Give higher weight to sentences at the beginning
        position_weight = 1.0 if i < len(sentences) * 0.3 else 0.8
        
        for word in word_tokenize(sentence.lower()):
            if word in word_freq:
                score += word_freq[word] * position_weight
        
        sentence_scores[sentence] = score
    
    # Get top sentences
    summary_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:num_sentences]
    summary_sentences = [s[0] for s in summary_sentences]
    
    # Sort sentences in original order
    summary_sentences.sort(key=lambda x: sentences.index(x))
    
    # Format based on style
    if style == "paragraph":
        return ' '.join(summary_sentences)
    elif style == "bullet":
        return '\n• ' + '\n• '.join(summary_sentences)
    elif style == "numbered":
        return '\n'.join(f"{i+1}. {s}" for i, s in enumerate(summary_sentences))
    return ' '.join(summary_sentences)

def summarize_article(url, length="medium", style="paragraph"):
    try:
        # Map length options to number of sentences
        length_map = {
            "short": 2,
            "medium": 3,
            "long": 5
        }
        num_sentences = length_map.get(length, 3)
        
        # Download and parse article
        article = Article(url)
        article.download()
        article.parse()
        
        if not article.text:
            return {
                "success": False,
                "error": "Couldn't extract article content.",
                "metadata": None
            }
        
        # Get metadata
        metadata = extract_metadata(article)
        
        # Generate summary
        summary = local_summarize(article.text, num_sentences, style)
        
        return {
            "success": True,
            "summary": summary,
            "metadata": metadata
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Error processing article: {str(e)}",
            "metadata": None
        }
