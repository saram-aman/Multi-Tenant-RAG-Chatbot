import { StatusCardProps } from "@/types/api";
const accentStyles: Record<NonNullable<StatusCardProps["accent"]>, string> = {
    emerald: "from-emerald-500/20 via-emerald-500/5 to-transparent text-emerald-200",
    sky: "from-sky-500/20 via-sky-500/5 to-transparent text-sky-200",
    violet: "from-violet-500/20 via-violet-500/5 to-transparent text-violet-200",
    amber: "from-amber-500/20 via-amber-500/5 to-transparent text-amber-200",
};
export function StatusCard({ icon: Icon, label, value, hint, accent = "emerald" }: StatusCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentStyles[accent]}`} />
            <div className="relative flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                        {label}
                    </p>
                    <p className="text-2xl font-semibold text-white">{value}</p>
                    {hint ? (
                        <p className="mt-1 text-sm text-white/70">{hint}</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
