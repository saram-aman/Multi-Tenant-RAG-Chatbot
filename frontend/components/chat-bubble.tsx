import type { ChatCardProps } from "@/types/api";
const roleConfig = {
    user: {
        bg: "bg-white/10 border-white/20",
        label: "You",
    },
    assistant: {
        bg: "bg-gradient-to-r from-violet-500/20 via-sky-500/10 to-transparent border-white/10",
        label: "RAG Assistant",
    },
};
export function ChatBubble({ role, content, citations, latencyMs, footnotePrefix }: ChatCardProps) {
    const config = roleConfig[role];
    return (
        <div className={`w-full rounded-2xl border ${config.bg} px-5 py-4 text-white shadow-lg`}>
            <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                <span className="font-semibold tracking-wide">{config.label}</span>
                {latencyMs ? (
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                        {latencyMs}ms
                    </span>
                ) : null}
            </div>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-white/90">
                {content}
            </p>
            {citations?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {citations.map((citation, index) => {
                        const label = `#${citation.source_id} · chunk ${citation.chunk_index}`;
                        const footnoteId = footnotePrefix ? `${footnotePrefix}-${index}` : undefined;
                        return footnoteId ? (
                            <a key={footnoteId} href={`#${footnoteId}`} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 hover:border-sky-300 hover:text-sky-200">
                                {label}
                            </a>
                        ) : (
                            <span key={`${citation.source_id}-${citation.chunk_index}`} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80">
                                {label}
                            </span>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
