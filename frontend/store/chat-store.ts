import type { StateCreator } from "zustand";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message, UploadSummary, ChatState } from "@/types/api";
const chatStoreCreator: StateCreator<ChatState> = (set) => ({
    tenantId: "tenant-alpha",
    apiKey: "",
    messages: [],
    conversationId: null,
    uploadSummary: null,
    uploading: false,
    isSending: false,
    setTenantId: (tenantId: string) => set({ tenantId, messages: [], conversationId: null }),
    setApiKey: (apiKey: string) => set({ apiKey }),
    addMessage: (message: Message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),
    clearMessages: () => set({ messages: [], conversationId: null }),
    setConversationId: (conversationId: string | null) => set({ conversationId }),
    setUploadSummary: (uploadSummary: UploadSummary | null) => set({ uploadSummary }),
    setUploading: (uploading: boolean) => set({ uploading }),
    setIsSending: (isSending: boolean) => set({ isSending }),
});
export const useChatStore = create<ChatState>()(
    persist(chatStoreCreator, {
        name: "rag-chat-store",
        partialize: (state) =>
            ({
                tenantId: state.tenantId,
                apiKey: state.apiKey,
            }) as Partial<ChatState>,
    }),
);
