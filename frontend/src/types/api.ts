import type { LucideIcon } from "lucide-react";
export type Citation = {
    source_id: string;
    chunk_index: number;
    text_snippet: string;
    score: number;
};
export type ChatResponse = {
    tenant_id: string;
    conversation_id?: string | null;
    answer: string;
    citations: Citation[];
    latency_ms: number;
};
export type UploadSummary = {
    tenant_id: string;
    total_chunks: number;
    documents: {
        source_id: string;
        chunks_ingested: number;
        metadata: {
            filename: string;
            mime_type: string;
            size_bytes: number;
        };
    }[];
};
export type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    citations?: ChatResponse["citations"];
    latencyMs?: number;
};
export type ChatParams = {
    tenantId: string;
    message: string;
    apiKey?: string;
    conversationId?: string | null;
};
export type UploadParams = {
    tenantId: string;
    files: FileList | File[];
    apiKey?: string;
};
export type ChatCardProps = {
    role: "user" | "assistant";
    content: string;
    citations?: Citation[];
    latencyMs?: number;
    footnotePrefix?: string;
};
export type StatusCardProps = {
    icon: LucideIcon;
    label: string;
    value: string;
    hint?: string;
    accent?: "emerald" | "sky" | "violet" | "amber";
};
export type ChatState = {
    tenantId: string;
    apiKey: string;
    messages: Message[];
    conversationId: string | null;
    uploadSummary: UploadSummary | null;
    uploading: boolean;
    isSending: boolean;
    setTenantId: (tenantId: string) => void;
    setApiKey: (apiKey: string) => void;
    addMessage: (message: Message) => void;
    clearMessages: () => void;
    setConversationId: (id: string | null) => void;
    setUploadSummary: (summary: UploadSummary | null) => void;
    setUploading: (value: boolean) => void;
    setIsSending: (value: boolean) => void;
};