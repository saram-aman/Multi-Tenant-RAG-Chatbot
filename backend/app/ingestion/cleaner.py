import re
from typing import List

WHITESPACE_PATTERN = re.compile(r"\s+")


def normalize_whitespace(text: str) -> str:
    return WHITESPACE_PATTERN.sub(" ", text).strip()


def clean_text(text: str) -> str:
    """
    Lightweight normalization that removes duplicated whitespace and
    non-printable characters while preserving semantic content.
    """
    sanitized = text.replace("\u00a0", " ")
    sanitized = sanitized.replace("\r", " ").replace("\t", " ")
    return normalize_whitespace(sanitized)


def clean_chunks(chunks: List[str]) -> List[str]:
    return [clean_text(chunk) for chunk in chunks if chunk.strip()]
