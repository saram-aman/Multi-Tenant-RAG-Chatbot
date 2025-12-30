import { Building2, KeyRound } from "lucide-react";
import { useChatStore } from "@/store/chat-store";
const TENANT_PRESETS = [
    { label: "Tenant Alpha", value: "tenant-alpha" },
    { label: "Tenant Beta", value: "tenant-beta" },
    { label: "Acme Labs", value: "acme-labs" },
    { label: "Globex Security", value: "globex-security" },
];
export function TenantSelector() {
    const { tenantId, apiKey, setTenantId, setApiKey, clearMessages } = useChatStore();
    function handleTenantChange(value: string) {
        setTenantId(value);
        clearMessages();
    }
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Tenant Selector</p>
                    <h3 className="text-xl font-semibold">Login Simulation</h3>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">
                    Header auth
                </span>
            </div>
            <label className="mb-4 block text-sm text-white/70">
                Tenant Namespace
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/15 bg-black/20 px-4 py-3">
                    <Building2 className="h-4 w-4 text-white/60" />
                    <input className="w-full bg-transparent text-white outline-none placeholder:text-white/40" value={tenantId} onChange={(event) => handleTenantChange(event.target.value)} list="tenant-presets" placeholder="tenant-alpha" />
                    <datalist id="tenant-presets">
                        {TENANT_PRESETS.map((tenant) => (
                            <option key={tenant.value} value={tenant.value}>
                                {tenant.label}
                            </option>
                        ))}
                    </datalist>
                </div>
            </label>
            <label className="mb-6 block text-sm text-white/70">
                X-API-Key
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/15 bg-black/20 px-4 py-3">
                    <KeyRound className="h-4 w-4 text-white/60" />
                    <input type="password" className="w-full bg-transparent text-white outline-none placeholder:text-white/40" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="optional demo key" />
                </div>
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
                {TENANT_PRESETS.map((tenant) => (
                    <button key={tenant.value} type="button" onClick={() => handleTenantChange(tenant.value)} className={`rounded-full border px-3 py-1 transition ${tenantId === tenant.value ? "border-sky-400 bg-sky-400/10 text-white" : "border-white/15 text-white/70 hover:border-white/40"}`} >
                        {tenant.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
