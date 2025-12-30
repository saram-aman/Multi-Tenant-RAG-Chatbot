from unittest.mock import MagicMock, patch


def test_chat_endpoint_returns_response(client):
    mock_response = MagicMock(
        tenant_id="tenant-123",
        conversation_id="conv-1",
        answer="Here is the answer.",
        citations=[],
        latency_ms=42,
    )

    with patch("app.api.chat.get_rag_service", return_value=MagicMock(answer_question=lambda _: mock_response)):
        payload = {"tenant_id": "tenant-123", "message": "What is the policy?"}
        response = client.post(
            "/api/chat/ask",
            json=payload,
            headers={"x-api-key": "test-api-key"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["answer"] == "Here is the answer."
    assert body["tenant_id"] == "tenant-123"
    assert body["latency_ms"] == 42


def test_chat_endpoint_requires_api_key(client):
    payload = {"tenant_id": "tenant-123", "message": "Ping"}
    response = client.post("/api/chat/ask", json=payload)
    assert response.status_code == 401
