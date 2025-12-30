import os
from typing import Generator

import pytest
from fastapi.testclient import TestClient


@pytest.fixture(scope="session", autouse=True)
def set_test_env() -> None:
    os.environ.setdefault("OPENAI_API_KEY", "test-openai-key")
    os.environ.setdefault("PINECONE_API_KEY", "test-pinecone-key")
    os.environ.setdefault("PINECONE_INDEX_NAME", "test-index")
    os.environ.setdefault("INTERNAL_API_KEY", "test-api-key")


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    from app.main import app

    with TestClient(app) as test_client:
        yield test_client
