from __future__ import annotations

import time
from functools import lru_cache
from typing import List

from openai import OpenAI

from app.core.config import settings
from app.models.chat import ChatRequest, ChatResponse, Citation
from app.ingestion.embedder import embed_query
from app.services.vector_store import get_vector_store
from app.utils.logger import get_logger

logger = get_logger(__name__)


class RAGService:
    def __init__(self) -> None:
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.vector_store = get_vector_store()

    def answer_question(self, request: ChatRequest) -> ChatResponse:
        started = time.perf_counter()
        embedding = embed_query(request.message)
        matches = self.vector_store.similarity_search(
            tenant_id=request.tenant_id,
            embedding=embedding,
            top_k=settings.retrieval_top_k,
        )
        context = self._build_context(matches)
        answer = self._generate_answer(request.message, context)
        citations = self._build_citations(matches)

        latency_ms = int((time.perf_counter() - started) * 1000)
        return ChatResponse(
            tenant_id=request.tenant_id,
            conversation_id=request.conversation_id,
            answer=answer,
            citations=citations,
            latency_ms=latency_ms,
        )

    def _build_context(self, matches: List[dict]) -> str:
        if not matches:
            return "No relevant documents found."
        snippets = []
        for match in matches:
            metadata = match.get("metadata") or {}
            snippet = metadata.get("text") or ""
            source_id = metadata.get("source_id") or "unknown"
            snippets.append(f"[Source {source_id}] {snippet}")
        return "\n\n".join(snippets)

    def _generate_answer(self, question: str, context: str) -> str:
        system_prompt = (
            "You are an internal documentation assistant. "
            "Use the provided context to answer the question. "
            "If the context does not contain the answer, say you don't know. "
            "Cite sources inline using [source_id] notation when relevant."
        )
        try:
            completion = self.client.chat.completions.create(
                model=settings.openai_chat_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": f"Context:\n{context}\n\nQuestion:\n{question}",
                    },
                ],
                temperature=0.2,
            )
            content = completion.choices[0].message.content
            if content is None:
                return "I'm sorry, I could not generate a response at this time."
            return content.strip()
        except Exception as exc:
            logger.error("LLM generation failed", exc_info=exc)
            return "I'm sorry, I could not generate a response at this time."

    def _build_citations(self, matches: List[dict]) -> List[Citation]:
        citations: List[Citation] = []
        for match in matches:
            metadata = match.get("metadata") or {}
            citations.append(
                Citation(
                    source_id=str(metadata.get("source_id") or "unknown"),
                    chunk_index=int(metadata.get("chunk_index") or 0),
                    text_snippet=(metadata.get("text") or "")[:200],
                    score=float(match.get("score") or 0.0),
                )
            )
        return citations


@lru_cache()
def get_rag_service() -> RAGService:
    return RAGService()
