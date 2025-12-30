import { StatusCardProps } from "@/types/api";
const accentStyles: Record<NonNullable<StatusCardProps["accent"]>, string> = {
    emerald: "from-[#3a3a3a] via-[#2d2d2d] to-transparent text-[#d9ffd6]",
    sky: "from-[#3c3c3c] via-[#2e2e2e] to-transparent text-[#d7e7ff]",
    violet: "from-[#3f3f3f] via-[#303030] to-transparent text-[#e6dbff]",
    amber: "from-[#414141] via-[#323232] to-transparent text-[#ffe9d1]",
};
export function StatusCard({ icon: Icon, label, value, hint, accent = "emerald" }: StatusCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-[#333333] bg-[#2b2b2b] px-5 py-4 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentStyles[accent]}`} />
            <div className="relative flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3a3a3a]">
                    <Icon className="h-5 w-5 text-[#f4f4f4]" />
                </div>
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-[#9b9b9b]">{label}</p>
                    <p className="text-2xl font-semibold text-[#f7f7f7]">{value}</p>
                    {hint ? <p className="mt-1 text-sm text-[#b6b6b6]">{hint}</p> : null}
                </div>
            </div>
        </div>
    );
}
