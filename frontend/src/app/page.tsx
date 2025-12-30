"use client";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Activity, ArrowUpRight, Files, Shield, Sparkles, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { StatusCard } from "@/components/status-card";
import { ChatBubble } from "@/components/chat-bubble";
import { TenantSelector } from "@/components/tenant-selector";
import { askQuestion, uploadDocuments } from "@/services/api";
import type { Message } from "@/types/api";
import { useChatStore } from "@/store/chat-store";
export default function Home() {
  const { tenantId, apiKey, messages, uploading, isSending, uploadSummary, addMessage, setConversationId, conversationId, setUploadSummary, setUploading, setIsSending, clearMessages } = useChatStore();
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const chatViewportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatViewportRef.current) {
      chatViewportRef.current.scrollTop = chatViewportRef.current.scrollHeight;
    }
  }, [messages]);

  function handleResetConversation() {
    clearMessages();
    setConversationId(null);
    setInput("");
    setError(null);
  }
  const totalDocuments = uploadSummary?.documents.length ?? 0;
  const totalChunks = uploadSummary?.total_chunks ?? 0;
  const heroSubhead = useMemo(() => `${tenantId.toUpperCase()} · ${uploadSummary ? `${totalChunks} chunks synced` : "Awaiting knowledge ingestion"}`, [tenantId, uploadSummary, totalChunks]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      setError(null);
    },
  });
  async function handleUpload(event: FormEvent) {
    event.preventDefault();
    if (!files.length) {
      setError("Select at least one document before ingesting.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const summary = await uploadDocuments({ tenantId, files, apiKey });
      setUploadSummary(summary);
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }
  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    addMessage(userMessage);
    setInput("");
    setIsSending(true);
    setError(null);
    try {
      const response = await askQuestion({
        tenantId,
        message: userMessage.content,
        apiKey,
        conversationId,
      });
      setConversationId(response.conversation_id ?? null);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        citations: response.citations,
        latencyMs: response.latency_ms,
      };
      addMessage(assistantMessage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch answer.");
    } finally {
      setIsSending(false);
    }
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#222222] text-[#f5f5f5]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(119,119,119,0.25),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(68,68,68,0.35),_transparent_55%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-12">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-[#999999]">
            Multi-Tenant Intelligence Fabric
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[#f7f7f7] sm:text-5xl">
                RAG Command Center
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-[#bbbbbb]">
                Upload internal documents per tenant, keep namespaces isolated,
                and interrogate your knowledge base with grounded answers and
                inline citations.
              </p>
            </div>
            <div className="rounded-full border border-[#383838] bg-[#2d2d2d] px-4 py-2 text-sm text-[#d4d4d4]">
              {heroSubhead}
            </div>
          </div>
        </header>
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="rounded-3xl border border-[#333333] bg-[#292929] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#9c9c9c]">Knowledge Dialogue</p>
                  <h2 className="text-2xl font-semibold text-[#f5f5f5]">Tenant Chat Stream</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={handleResetConversation} className="rounded-full border border-[#3c3c3c] px-3 py-1 text-xs text-[#cfcfcf] transition hover:border-[#5a5a5a]">
                    Reset
                  </button>
                  <span className="rounded-full border border-[#3d3d3d] bg-[#2f2f2f] px-3 py-1 text-xs text-[#c7c7c7]">{messages.length} turns</span>
                </div>
              </div>
              <div className="mt-5 flex h-[420px] flex-col gap-4 overflow-y-auto pr-2">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-[#a3a3a3]">
                    <Sparkles className="mb-3 h-7 w-7 text-[#dcdcdc]" />
                    <p className="text-lg font-medium text-[#f0f0f0]">
                      Upload files, then ask about onboarding playbooks,
                      architectures, or internal FAQs.
                    </p>
                    <p className="text-sm text-[#9a9a9a]">All responses cite Pinecone chunks for traceable context.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <ChatBubble key={message.id} {...message} />
                  ))
                )}
              </div>
              <form onSubmit={handleSend} className="mt-5 space-y-3">
                <div className="rounded-2xl border border-[#3a3a3a] bg-[#1f1f1f] px-4 py-3">
                  <textarea className="w-full resize-none bg-transparent text-base text-[#f5f5f5] outline-none placeholder:text-[#7d7d7d]" rows={3} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about incident response, compliance workflows, or internal Q&A..." />
                </div>
                <div className="flex items-center justify-between gap-3 text-sm text-[#a5a5a5]">
                  <span>Responses powered by OpenAI + Pinecone. Streaming disabled in demo mode.</span>
                  <button type="submit" disabled={isSending} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#333333] via-[#444444] to-[#555555] px-5 py-2 font-semibold text-[#f9f9f9] shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:from-[#3b3b3b] hover:to-[#5f5f5f] disabled:cursor-not-allowed disabled:opacity-50">
                    Send prompt
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
            {error ? (
              <div className="rounded-2xl border border-[#5a2f2f] bg-[#2e1b1b] px-4 py-3 text-sm text-[#ffbaba]">
                {error}
              </div>
            ) : null}
          </div>
          <aside className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatusCard icon={Files} label="Documents Ingested" value={totalDocuments.toString().padStart(2, "0")} hint="Per-tenant Pinecone namespaces" accent="emerald" />
              <StatusCard icon={Activity} label="Latency (p95)" value={messages.length ? "~280 ms" : "—"} hint="FastAPI + OpenAI completions" accent="sky" />
              <StatusCard icon={Shield} label="Isolation" value="Namespace keys" hint="Tenant aware API key" accent="violet" />
              <StatusCard icon={Sparkles} label="Citations" value={messages.some((m) => m.citations?.length) ? "Active" : "None yet"} hint="Inline references per chunk" accent="amber" />
            </div>
            <TenantSelector />
            <form onSubmit={handleUpload} className="space-y-4 rounded-3xl border border-dashed border-[#3a3a3a] bg-gradient-to-b from-[#2a2a2a] to-[#252525] p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#333333] p-3">
                  <UploadCloud className="h-6 w-6 text-[#f0f0f0]" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#969696]">Document ingestion</p>
                  <h3 className="text-xl font-semibold">Upload PDFs & docs</h3>
                </div>
              </div>
              <div
                {...getRootProps({
                  className: `flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-10 text-center transition ${isDragActive
                    ? "border-[#666666] bg-[#333333] text-white"
                    : "border-[#3b3b3b] bg-[#1f1f1f] text-[#cfcfcf] hover:border-[#5f5f5f]"
                    }`,
                })} >
                <input {...getInputProps()} />
                <p className="text-base font-semibold">
                  {isDragActive ? "Release to upload" : "Drop files or click to browse"}
                </p>
                <p className="text-sm text-[#9c9c9c]">Supports PDF, Markdown, plain text, DOCX</p>
                {files.length ? (
                  <p className="mt-2 rounded-full bg-[#3f3f3f] px-3 py-1 text-xs text-white">
                    {files.length} file(s) selected
                  </p>
                ) : null}
              </div>
              <button type="submit" disabled={uploading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f0f0f0] text-[#1f1f1f] py-3 font-semibold transition hover:bg-[#dcdcdc] disabled:cursor-not-allowed disabled:opacity-50">
                Ingest to Pinecone
                <ArrowUpRight className="h-4 w-4" />
              </button>
              {uploadSummary ? (
                <div className="rounded-2xl border border-[#3a3a3a] bg-[#2b2b2b] p-4 text-sm text-[#dadada]">
                  <p className="font-semibold">Latest sync</p>
                  <p className="text-white">
                    {uploadSummary.documents.length} docs → {uploadSummary.total_chunks} chunks
                  </p>
                </div>
              ) : null}
            </form>
          </aside>
        </section>
      </div>
    </div>
  );
}
