import { API_BASE_URL, DEFAULT_API_KEY } from "@/utils/config";
import type { ChatParams, ChatResponse, UploadParams, UploadSummary } from "@/types/api";
export async function uploadDocuments({ tenantId, files, apiKey }: UploadParams): Promise<UploadSummary> {
    const normalizedFiles = Array.isArray(files) ? files : Array.from(files ?? []);
    if (!normalizedFiles.length) throw new Error("Please select at least one document.");
    const formData = new FormData();
    normalizedFiles.forEach((file) => formData.append("files", file));
    const response = await fetch(
        `${API_BASE_URL}/upload/documents?tenant_id=${encodeURIComponent(tenantId)}`,
        {
            method: "POST",
            headers: {
                "x-api-key": apiKey ?? DEFAULT_API_KEY,
            },
            body: formData,
        },
    );
    if (!response.ok) {
        const details = await response.json().catch(() => ({}));
        throw new Error(details?.detail ?? "Unable to upload documents.");
    }
    return (await response.json()) as UploadSummary;
}
export async function askQuestion({ tenantId, message, apiKey, conversationId }: ChatParams): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey ?? DEFAULT_API_KEY,
        },
        body: JSON.stringify({
            tenant_id: tenantId,
            message,
            conversation_id: conversationId,
        }),
    });
    if (!response.ok) {
        const details = await response.json().catch(() => ({}));
        throw new Error(details?.detail ?? "Chat request failed.");
    }
    return (await response.json()) as ChatResponse;
}
