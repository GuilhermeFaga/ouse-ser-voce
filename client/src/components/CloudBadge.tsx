import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { useCloud } from "@/app/sync";
import { useNavigation } from "@/app/navigation";
import { focusRing } from "@/components/ds";
import { cn } from "@/lib/utils";

/**
 * The one-line answer to "is my record safe?" — and the way into the account
 * settings. Only rendered for the signed-in account (the app requires login).
 */
export default function CloudBadge({ className }: { className?: string }) {
  const { enabled, signedIn, status, online } = useCloud();
  const { navigate } = useNavigation();

  if (!enabled || !signedIn) return null;

  const view =
    status === "error"
      ? {
          label: "Erro ao salvar",
          icon: CloudOff,
          iconClass: "text-destructive",
        }
      : !online
        ? {
            label: "Offline — salvo aqui",
            icon: CloudOff,
            iconClass: "text-amber-700",
          }
        : status === "linking" || status === "syncing" || status === "off"
          ? {
              label: status === "syncing" ? "Salvando…" : "Conectando…",
              icon: RefreshCw,
              iconClass: "text-ink-subtle",
            }
          : {
              label: "Salvo na nuvem",
              icon: Cloud,
              iconClass: "text-emerald-600",
            };

  const Icon = view.icon;

  return (
    <button
      type="button"
      onClick={() => navigate("settings")}
      aria-label={`${view.label}. Abrir configurações da conta.`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-2.5 py-1 text-[11px] font-medium text-ink-muted transition-colors hover:bg-surface-soft hover:text-ink",
        focusRing,
        className
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", view.iconClass)} aria-hidden />
      <span aria-hidden>{view.label}</span>
    </button>
  );
}
