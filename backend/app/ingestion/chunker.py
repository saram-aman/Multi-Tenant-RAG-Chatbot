from typing import List, Optional

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings


def build_splitter(
    chunk_size: Optional[int] = None,
    chunk_overlap: Optional[int] = None,
) -> RecursiveCharacterTextSplitter:
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size or settings.default_chunk_size,
        chunk_overlap=chunk_overlap or settings.default_chunk_overlap,
        length_function=len,
    )


def get_chunks(
    text: str,
    chunk_size: Optional[int] = None,
    chunk_overlap: Optional[int] = None,
) -> List[str]:
    splitter = build_splitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return [chunk.strip() for chunk in splitter.split_text(text) if chunk.strip()]