from functools import lru_cache
from typing import List, Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_prefix: str = Field(default="/api", alias="API_PREFIX")
    app_name: str = Field(default="Multi-Tenant RAG Chatbot", alias="APP_NAME")

    openai_api_key: str = Field(alias="OPENAI_API_KEY")
    pinecone_api_key: str = Field(alias="PINECONE_API_KEY")
    pinecone_index_name: str = Field(alias="PINECONE_INDEX_NAME")
    pinecone_environment: Optional[str] = Field(default=None, alias="PINECONE_ENVIRONMENT")
    redis_url: Optional[str] = Field(default=None, alias="REDIS_URL")
    postgres_dsn: Optional[str] = Field(default=None, alias="POSTGRES_DSN")
    rate_limit_per_minute: int = Field(default=60, alias="RATE_LIMIT_PER_MINUTE")
    cors_origins: List[str] = Field(default_factory=lambda: ["*"], alias="CORS_ORIGINS")
    internal_api_key: Optional[str] = Field(default=None, alias="INTERNAL_API_KEY")

    openai_chat_model: str = Field(default="gpt-4o-mini", alias="OPENAI_CHAT_MODEL")
    openai_embedding_model: str = Field(default="text-embedding-3-large", alias="OPENAI_EMBEDDING_MODEL")
    default_chunk_size: int = Field(default=800, alias="DEFAULT_CHUNK_SIZE")
    default_chunk_overlap: int = Field(default=100, alias="DEFAULT_CHUNK_OVERLAP")
    retrieval_top_k: int = Field(default=5, alias="RETRIEVAL_TOP_K")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
