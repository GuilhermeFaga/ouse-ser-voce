import { CloudOff, RefreshCw } from "lucide-react";
import { useAuth } from "@/app/auth";
import { useCloud, type CloudApi } from "@/app/sync";
import { formatRelativeTime } from "@/lib/dates";
import { Action, Card, CardTitle, Pill } from "@/components/ds";

type PillTone = "neutral" | "success" | "warning" | "danger";

function statusView(cloud: CloudApi): {
  tone: PillTone;
  label: string;
  detail: string;
} {
  if (cloud.status === "error") {
    return {
      tone: "danger",
      label: "Não salvou",
      detail: cloud.error ?? "Não foi possível salvar na nuvem.",
    };
  }
  if (!cloud.online) {
    return {
      tone: "warning",
      label: "Sem conexão",
      detail:
        "Suas mudanças ficam neste aparelho e sobem quando a internet voltar.",
    };
  }
  if (cloud.status === "linking" || cloud.status === "off") {
    return {
      tone: "neutral",
      label: "Conectando",
      detail: "Buscando o que já está salvo na sua conta…",
    };
  }
  if (cloud.status === "syncing") {
    return {
      tone: "warning",
      label: "Salvando",
      detail: "Gravando suas últimas mudanças na nuvem…",
    };
  }
  return {
    tone: "success",
    label: "Em dia",
    detail: cloud.lastSyncedAt
      ? `Sincronizado ${formatRelativeTime(cloud.lastSyncedAt)}.`
      : "Sua jornada está salva na nuvem. Tudo o que você escrever sobe em seguida.",
  };
}

function Avatar({ photoURL, name }: { photoURL: string; name: string }) {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt=""
        referrerPolicy="no-referrer"
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-line-strong"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft font-serif text-lg text-brand-ink ring-1 ring-line-strong"
    >
      {(name.trim().charAt(0) || "?").toUpperCase()}
    </span>
  );
}

/**
 * The account surface on Settings: whose account this is, whether the record
 * reached the cloud, a manual sync and signing out.
 */
export default function CloudAccountCard() {
  const { configured, user, signingIn, error, signOut } = useAuth();
  const cloud = useCloud();

  if (!configured || !user) return null;

  const view = statusView(cloud);

  return (
    <Card>
      <CardTitle hint={<Pill tone={view.tone}>{view.label}</Pill>}>
        Sua conta
      </CardTitle>

      <div className="flex items-center gap-3">
        <Avatar
          photoURL={user.photoURL}
          name={user.displayName || user.email}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {user.displayName || "Sua conta Google"}
          </p>
          {user.email && (
            <p className="truncate text-xs text-ink-muted">{user.email}</p>
          )}
        </div>
      </div>

      <p
        aria-live="polite"
        className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-ink-soft"
      >
        {cloud.status === "error" && (
          <CloudOff
            className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
            aria-hidden
          />
        )}
        <span>{view.detail}</span>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-4">
        <Action
          variant="secondary"
          size="sm"
          onClick={cloud.syncNow}
          disabled={cloud.status === "linking" || cloud.status === "syncing"}
          icon={<RefreshCw className="h-3.5 w-3.5" aria-hidden />}
        >
          Sincronizar agora
        </Action>
        <Action
          variant="quiet"
          size="sm"
          onClick={signOut}
          disabled={signingIn}
        >
          {signingIn ? "Saindo…" : "Sair"}
        </Action>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 text-xs font-medium leading-relaxed text-destructive"
        >
          {error}
        </p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Sair não apaga nada: o registro continua neste aparelho e na sua conta.
      </p>
    </Card>
  );
}
