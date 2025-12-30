from unittest.mock import patch


def test_upload_documents_success(client):
    file_content = b"Some internal documentation here."
    files = {"files": ("test.txt", file_content, "text/plain")}

    with patch("app.ingestion.pipeline.ingest_document", return_value=3):
        response = client.post(
            "/api/upload/documents?tenant_id=tenant-123",
            files=files,
            headers={"x-api-key": "test-api-key"},
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["tenant_id"] == "tenant-123"
    assert payload["total_chunks"] == 3
    assert len(payload["documents"]) == 1
    doc = payload["documents"][0]
    assert doc["chunks_ingested"] == 3
    assert doc["metadata"]["filename"] == "test.txt"
