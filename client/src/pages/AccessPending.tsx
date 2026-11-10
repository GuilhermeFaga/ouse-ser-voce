import { MessageCircle, ShieldAlert, UserX } from "lucide-react";
import { useAccess } from "@/app/accessProvider";
import { useAuth } from "@/app/auth";
import AuthShell from "@/components/AuthShell";
import { Action, Card, ScreenHeader, focusRing } from "@/components/ds";
import { sorayaWhatsAppUrl } from "@/share/messages";

/**
 * Shown when the Google account is valid but the e-mail is not on the access
 * list, or when the list cannot be checked (offline). The app itself is not
 * mounted here, so nothing from the previous account is displayed.
 */
export default function AccessPending() {
  const { status, email, error, retry } = useAccess();
  const { signOut, signingIn } = useAuth();
  const denied = status === "denied";
  const requestMessage = `Olá, Soraya! Quero liberar meu acesso à jornada Ouse Ser Você. Meu e-mail do Google é ${email || "(meu e-mail)"}.`;

  return (
    <AuthShell>
      <ScreenHeader
        size="display"
        kicker="Acesso restrito"
        title={
          denied
            ? "Seu e-mail ainda não está liberado."
            : "Não conseguimos confirmar seu acesso."
        }
        description={
          denied
            ? "Cada acesso é liberado pela administração. Confira se o e-mail abaixo é o mesmo que foi autorizado."
            : (error ??
              "Pode ser a conexão. Verifique sua internet e tente de novo.")
        }
      />

      <Card className="mt-6" padding="sm">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-ink-muted"
          >
            {denied ? (
              <UserX className="h-4 w-4" />
            ) : (
              <ShieldAlert className="h-4 w-4" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Conta conectada
            </p>
            <p className="truncate text-sm font-medium text-ink">
              {email || "Conta do Google"}
            </p>
          </div>
        </div>

        {!denied && error && (
          <p
            role="alert"
            aria-live="polite"
            className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800"
          >
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row">
          <Action onClick={retry} disabled={signingIn}>
            {denied ? "Já pedi. Verificar de novo" : "Tentar de novo"}
          </Action>
          <Action variant="secondary" onClick={signOut} disabled={signingIn}>
            {signingIn ? "Saindo…" : "Trocar de conta"}
          </Action>
        </div>
      </Card>

      {denied && (
        <div className="mt-5 space-y-2 text-center">
          <p className="text-xs leading-relaxed text-ink-muted">
            Se este é o e-mail certo, peça a liberação para a Soraya no
            WhatsApp.
          </p>
          <a
            href={sorayaWhatsAppUrl(requestMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded text-sm font-medium text-brand-ink underline underline-offset-4 ${focusRing}`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Pedir liberação no WhatsApp
          </a>
        </div>
      )}
    </AuthShell>
  );
}
