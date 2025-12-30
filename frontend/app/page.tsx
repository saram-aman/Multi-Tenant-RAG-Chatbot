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
        <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,86,214,0.25),_transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(56,189,248,0.2),_transparent_40%)]" />
            <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-12">
                <header className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.35em] text-white/50">
                        Multi-Tenant Intelligence Fabric
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                                RAG Command Center
                            </h1>
                            <p className="mt-3 max-w-2xl text-lg text-white/70">
                                Upload internal documents per tenant, keep namespaces isolated,
                                and interrogate your knowledge base with grounded answers and
                                inline citations.
                            </p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                            {heroSubhead}
                        </div>
                    </div>
                </header>
                <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Knowledge Dialogue</p>
                                    <h2 className="text-2xl font-semibold">Tenant Chat Stream</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={handleResetConversation} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition hover:border-white">
                                        Reset
                                    </button>
                                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">{messages.length} turns</span>
                                </div>
                            </div>
                            <div className="mt-5 flex h-[420px] flex-col gap-4 overflow-y-auto pr-2">
                                {messages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center text-white/60">
                                        <Sparkles className="mb-3 h-7 w-7 text-white/70" />
                                        <p className="text-lg font-medium">
                                            Upload files, then ask about onboarding playbooks,
                                            architectures, or internal FAQs.
                                        </p>
                                        <p className="text-sm text-white/50">All responses cite Pinecone chunks for traceable context.</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <ChatBubble key={message.id} {...message} />
                                    ))
                                )}
                            </div>
                            <form onSubmit={handleSend} className="mt-5 space-y-3">
                                <div className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3">
                                    <textarea className="w-full resize-none bg-transparent text-base outline-none placeholder:text-white/40" rows={3} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about incident response, compliance workflows, or internal Q&A..." />
                                </div>
                                <div className="flex items-center justify-between gap-3 text-sm text-white/60">
                                    <span>Responses powered by OpenAI + Pinecone. Streaming disabled in demo mode.</span>
                                    <button type="submit" disabled={isSending} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-5 py-2 font-semibold text-white shadow-lg shadow-violet-500/40 transition hover:from-sky-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-50">Send prompt
                                        <ArrowUpRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                        {error ? (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
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
                        <form onSubmit={handleUpload} className="space-y-4 rounded-3xl border border-dashed border-white/20 bg-gradient-to-b from-white/10 to-white/5 p-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-white/10 p-3">
                                    <UploadCloud className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Document ingestion</p>
                                    <h3 className="text-xl font-semibold">Upload PDFs & docs</h3>
                                </div>
                            </div>
                            <div
                                {...getRootProps({
                                    className: `flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-10 text-center transition ${isDragActive
                                        ? "border-sky-400 bg-sky-400/10 text-white"
                                        : "border-white/20 bg-black/20 text-white/70 hover:border-sky-400"
                                    }`,
                                })} >
                                <input {...getInputProps()} />
                                <p className="text-base font-semibold">
                                    {isDragActive ? "Release to upload" : "Drop files or click to browse"}
                                </p>
                                <p className="text-sm text-white/50">Supports PDF, Markdown, plain text, DOCX</p>
                                {files.length ? (
                                    <p className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                                        {files.length} file(s) selected
                                    </p>
                                ) : null}
                            </div>
                            <button type="submit" disabled={uploading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white text-black py-3 font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">Ingest to Pinecone
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                            {uploadSummary ? (
                                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/80">
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
