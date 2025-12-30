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
        <div className="rounded-3xl border border-[#343434] bg-[#282828] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#9a9a9a]">Tenant Selector</p>
                    <h3 className="text-xl font-semibold text-[#f5f5f5]">Login Simulation</h3>
                </div>
                <span className="rounded-full border border-[#3d3d3d] px-3 py-1 text-xs text-[#cfcfcf]">Header auth</span>
            </div>

            <label className="mb-4 block text-sm text-[#c5c5c5]">
                Tenant Namespace
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#3b3b3b] bg-[#1f1f1f] px-4 py-3">
                    <Building2 className="h-4 w-4 text-[#b6b6b6]" />
                    <input
                        className="w-full bg-transparent text-[#f7f7f7] outline-none placeholder:text-[#7b7b7b]"
                        value={tenantId}
                        onChange={(event) => handleTenantChange(event.target.value)}
                        list="tenant-presets"
                        placeholder="tenant-alpha"
                    />
                    <datalist id="tenant-presets">
                        {TENANT_PRESETS.map((tenant) => (
                            <option key={tenant.value} value={tenant.value}>
                                {tenant.label}
                            </option>
                        ))}
                    </datalist>
                </div>
            </label>

            <label className="mb-6 block text-sm text-[#c5c5c5]">
                X-API-Key
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#3b3b3b] bg-[#1f1f1f] px-4 py-3">
                    <KeyRound className="h-4 w-4 text-[#b6b6b6]" />
                    <input
                        type="password"
                        className="w-full bg-transparent text-[#f7f7f7] outline-none placeholder:text-[#7b7b7b]"
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                        placeholder="optional demo key"
                    />
                </div>
            </label>

            <div className="flex flex-wrap gap-2 text-xs">
                {TENANT_PRESETS.map((tenant) => (
                    <button
                        key={tenant.value}
                        type="button"
                        onClick={() => handleTenantChange(tenant.value)}
                        className={`rounded-full border px-3 py-1 transition ${tenantId === tenant.value
                                ? "border-[#707070] bg-[#454545] text-white"
                                : "border-[#3d3d3d] text-[#c6c6c6] hover:border-[#5c5c5c]"
                            }`}
                    >
                        {tenant.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
