from app.ingestion.cleaner import clean_text, clean_chunks


def test_clean_text_removes_extra_whitespace():
    dirty = "Hello,\n\n  world!\tThis   is\u00a0RAG."
    assert clean_text(dirty) == "Hello, world! This is RAG."


def test_clean_chunks_filters_empty_entries():
    chunks = ["   Useful text   ", "", "   "]
    assert clean_chunks(chunks) == ["Useful text"]
