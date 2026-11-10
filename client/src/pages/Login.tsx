import { Lock, MessageCircle } from "lucide-react";
import { useAuth } from "@/app/auth";
import { sorayaWhatsAppUrl } from "@/share/messages";
import AuthShell from "@/components/AuthShell";
import { Action, Card, ScreenHeader, focusRing } from "@/components/ds";
import { GoogleMark } from "@/components/GoogleMark";

/** The front door: the journey is only available to approved Google accounts. */
export default function Login() {
  const { signIn, signingIn, error, configured } = useAuth();

  return (
    <AuthShell>
      <ScreenHeader
        size="display"
        kicker="Sua conta"
        title="Entre para continuar."
        description="Use a conta do Google que recebeu acesso. Seu diário, sua sequência e suas conquistas ficam salvos nela."
      />

      <Card className="mt-6" padding="sm">
        {configured ? (
          <Action
            block
            size="lg"
            variant="secondary"
            icon={<GoogleMark />}
            onClick={signIn}
            disabled={signingIn}
          >
            {signingIn ? "Abrindo o Google…" : "Entrar com Google"}
          </Action>
        ) : (
          <p className="rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm leading-relaxed text-ink-muted">
            O login não está configurado neste app. Defina as variáveis
            <code className="mx-1 rounded bg-surface-soft px-1.5 py-0.5 text-[11px] text-ink">
              VITE_FIREBASE_*
            </code>
            e recarregue a página.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-3 text-xs font-medium leading-relaxed text-destructive"
          >
            {error}
          </p>
        )}

        <div className="mt-4 flex items-start gap-2.5 border-t border-line pt-4">
          <Lock
            className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle"
            aria-hidden
          />
          <p className="text-xs leading-relaxed text-ink-muted">
            O acesso é restrito. Só e-mails liberados pela administração entram
            nesta jornada.
          </p>
        </div>
      </Card>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-muted">
        Ainda não tem acesso?{" "}
        <a
          href={sorayaWhatsAppUrl(
            "Olá, Soraya! Quero entrar na jornada Ouse Ser Você e preciso liberar meu e-mail do Google."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded font-medium text-brand-ink underline underline-offset-4 ${focusRing}`}
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          Peça para liberar seu e-mail no WhatsApp
        </a>
        .
      </p>
    </AuthShell>
  );
}
