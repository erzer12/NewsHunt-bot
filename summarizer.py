from newspaper import Article
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
import nltk
import re
import logging
import requests
from typing import Dict, Optional, Union

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def ensure_nltk_data():
    """Ensure required NLTK data is downloaded"""
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')

ensure_nltk_data()

def clean_text(text: str) -> str:
    """Clean and normalize text"""
    if not text:
        return ""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    # Remove multiple periods
    text = re.sub(r'\.+', '.', text)
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_metadata(article: Article) -> Dict:
    """Extract metadata from article"""
    try:
        metadata = {
            "title": article.title or "No Title",
            "authors": article.authors or [],
            "publish_date": article.publish_date,
            "top_image": article.top_image,
            "keywords": article.keywords or [],
            "summary": article.summary or ""
        }
        return metadata
    except Exception as e:
        logger.error(f"Error extracting metadata: {e}")
        return {
            "title": "No Title",
            "authors": [],
            "publish_date": None,
            "top_image": None,
            "keywords": [],
            "summary": ""
        }

def local_summarize(text: str, num_sentences: int = 3, style: str = "paragraph") -> str:
    """Generate a summary of the text"""
    if not text:
        return "No content to summarize."
        
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

def summarize_article(url: str, length: str = "medium", style: str = "paragraph") -> Dict[str, Union[bool, str, Optional[Dict]]]:
    """Summarize an article from a URL"""
    try:
        # Map length options to number of sentences
        length_map = {
            "short": 2,
            "medium": 3,
            "long": 5
        }
        num_sentences = length_map.get(length, 3)
        
        # Configure article with custom headers
        article = Article(url)
        article.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Download and parse article with timeout
        article.download()
        article.parse()
        
        if not article.text:
            logger.warning(f"No content extracted from {url}")
            return {
                "success": False,
                "error": "Couldn't extract article content.",
                "metadata": None
            }
        
        # Get metadata
        metadata = extract_metadata(article)
        
        # Generate summary
        summary = local_summarize(article.text, num_sentences, style)
        
        if not summary:
            logger.warning(f"Failed to generate summary for {url}")
            return {
                "success": False,
                "error": "Failed to generate summary.",
                "metadata": metadata
            }
        
        return {
            "success": True,
            "summary": summary,
            "metadata": metadata
        }
        
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP error for {url}: {e}")
        return {
            "success": False,
            "error": f"HTTP error: {str(e)}",
            "metadata": None
        }
    except Exception as e:
        logger.error(f"Error processing article {url}: {e}")
        return {
            "success": False,
            "error": f"Error processing article: {str(e)}",
            "metadata": None
        }
