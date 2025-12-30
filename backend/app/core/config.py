from functools import lru_cache
from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_prefix: str = "/api"
    app_name: str = "Multi-Tenant RAG Chatbot"

    openai_api_key: str
    pinecone_api_key: str
    pinecone_index_name: str
    pinecone_environment: Optional[str] = None
    redis_url: Optional[str] = None
    postgres_dsn: Optional[str] = None
    rate_limit_per_minute: int = 60
    cors_origins: List[str] = ["*"]
    internal_api_key: Optional[str] = None

    openai_chat_model: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-large"
    default_chunk_size: int = 800
    default_chunk_overlap: int = 100
    retrieval_top_k: int = 5

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
