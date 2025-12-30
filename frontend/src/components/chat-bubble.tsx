import type { ChatCardProps } from "@/types/api";
const roleConfig = {
    user: {
        bg: "bg-[#2b2b2b] border-[#3a3a3a]",
        chip: "border-[#4a4a4a] bg-[#3a3a3a] text-[#f3f3f3]",
        label: "You",
    },
    assistant: {
        bg: "bg-gradient-to-r from-[#2d2d2d] via-[#343434] to-[#3a3a3a] border-[#454545]",
        chip: "border-[#565656] bg-[#404040] text-[#f9f9f9]",
        label: "RAG Assistant",
    },
};

export function ChatBubble({ role, content, citations, latencyMs, footnotePrefix }: ChatCardProps) {
    const config = roleConfig[role];
    return (
        <div className={`w-full rounded-2xl border ${config.bg} px-5 py-4 text-[#f5f5f5] shadow-[0_10px_30px_rgba(0,0,0,0.35)]`}>
            <div className="mb-2 flex items-center justify-between text-sm text-[#c7c7c7]">
                <span className="font-semibold tracking-wide">{config.label}</span>
                {latencyMs ? (
                    <span className="text-xs uppercase tracking-[0.2em] text-[#9d9d9d]">{latencyMs}ms</span>
                ) : null}
            </div>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-[#f7f7f7]">{content}</p>
            {citations?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {citations.map((citation, index) => {
                        const label = `#${citation.source_id} · chunk ${citation.chunk_index}`;
                        const footnoteId = footnotePrefix ? `${footnotePrefix}-${index}` : undefined;
                        return footnoteId ? (
                            <a
                                key={footnoteId}
                                href={`#${footnoteId}`}
                                className={`rounded-full border px-3 py-1 text-xs transition hover:border-[#777777] hover:text-[#ffffff] ${config.chip}`}
                            >
                                {label}
                            </a>
                        ) : (
                            <span
                                key={`${citation.source_id}-${citation.chunk_index}`}
                                className={`rounded-full border px-3 py-1 text-xs ${config.chip}`}
                            >
                                {label}
                            </span>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
