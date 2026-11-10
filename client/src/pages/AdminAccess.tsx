import { useEffect, useState, type FormEvent } from "react";
import { MailPlus, ShieldCheck, Trash2, UserX } from "lucide-react";
import { toast } from "sonner";
import {
  ADMIN_EMAILS,
  isAdminEmail,
  normalizeEmail,
  parseEmails,
} from "@/app/access";
import { useAccess } from "@/app/accessProvider";
import { useAuth } from "@/app/auth";
import { loadFirestore } from "@/app/firebase";
import { useNavigation } from "@/app/navigation";
import { formatShortDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  Action,
  Card,
  CardTitle,
  EmptyState,
  Field,
  Pill,
  Screen,
  ScreenHeader,
  Stat,
  fieldInputClass,
  focusRing,
} from "@/components/ds";

interface AccessEntry {
  email: string;
  addedAt: Date | null;
}

function entryFromDoc(
  id: string,
  data: Record<string, unknown>
): AccessEntry | null {
  const email = normalizeEmail(
    typeof data.email === "string" ? data.email : id
  );
  if (!email) return null;

  const addedAt = data.addedAt as { toDate?: () => Date } | null | undefined;
  return {
    email,
    addedAt:
      addedAt && typeof addedAt.toDate === "function" ? addedAt.toDate() : null,
  };
}

function errorCode(cause: unknown): string {
  return String((cause as { code?: unknown } | null)?.code ?? "");
}

function messageForAccessError(cause: unknown): string {
  const code = errorCode(cause);
  if (code.includes("permission-denied")) {
    return "Sua conta não tem permissão para gerenciar acessos.";
  }
  if (code.includes("unavailable") || code.includes("network")) {
    return "Sem conexão com a nuvem. Tente de novo.";
  }
  return "Não foi possível salvar. Tente de novo.";
}

function messageForListError(cause: unknown): string {
  const code = errorCode(cause);
  if (code.includes("permission-denied")) {
    return "Sua conta não tem permissão para ver a lista.";
  }
  if (code.includes("unavailable") || code.includes("network")) {
    return "Sem conexão com a nuvem.";
  }
  return "Não foi possível carregar a lista.";
}

/** Admin-only: the allowlist that decides who can open the journey. */
export default function AdminAccess() {
  const { isAdmin, email: myEmail } = useAccess();
  const { user } = useAuth();
  const { navigate } = useNavigation();

  const [entries, setEntries] = useState<AccessEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const [input, setInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    setLoading(true);
    setListError(null);

    (async () => {
      const services = await loadFirestore();
      if (cancelled) return;
      if (!services) {
        setListError("Não foi possível abrir a lista agora.");
        setLoading(false);
        return;
      }

      const fs = await import("firebase/firestore");
      if (cancelled) return;

      unsubscribe = fs.onSnapshot(
        fs.collection(services.db, "access"),
        snapshot => {
          if (cancelled) return;
          const byEmail = new Map<string, AccessEntry>();
          for (const doc of snapshot.docs) {
            const entry = entryFromDoc(
              doc.id,
              doc.data() as Record<string, unknown>
            );
            if (entry && !isAdminEmail(entry.email)) {
              byEmail.set(entry.email, entry);
            }
          }
          setEntries(
            [...byEmail.values()].sort((a, b) => a.email.localeCompare(b.email))
          );
          setListError(null);
          setLoading(false);
        },
        cause => {
          if (cancelled) return;
          console.error("Falha ao listar acessos", cause);
          setListError(messageForListError(cause));
          setLoading(false);
        }
      );
    })().catch(cause => {
      if (cancelled) return;
      console.error("Falha ao abrir acessos", cause);
      setListError("Não foi possível abrir a lista agora.");
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isAdmin, reload]);

  if (!isAdmin) {
    return (
      <Screen>
        <ScreenHeader
          kicker="Administração"
          title="Acesso restrito"
          description="Esta página é só para as administradoras da jornada."
        />
        <Card>
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-ink-subtle"
              aria-hidden
            />
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-ink">
                Sua conta não administra acessos.
              </p>
              <p className="text-sm leading-relaxed text-ink-muted">
                Você continua com acesso à sua jornada normalmente.
              </p>
            </div>
          </div>
          <Action
            variant="secondary"
            className="mt-4"
            onClick={() => navigate("home")}
          >
            Voltar ao início
          </Action>
        </Card>
      </Screen>
    );
  }

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = parseEmails(input);
    if (parsed.invalid.length > 0) {
      setFormError(
        `${parsed.invalid.length === 1 ? "Este e-mail não parece válido" : "Estes e-mails não parecem válidos"}: ${parsed.invalid.join(", ")}`
      );
      return;
    }
    if (parsed.emails.length === 0) {
      setFormError("Escreva ao menos um e-mail.");
      return;
    }

    const existing = new Set(entries.map(entry => entry.email));
    const fresh = parsed.emails.filter(
      email => !existing.has(email) && !isAdminEmail(email)
    );
    if (fresh.length === 0) {
      toast.info(
        parsed.emails.some(isAdminEmail)
          ? "Administradoras já têm acesso."
          : "Esses e-mails já estão liberados."
      );
      return;
    }

    setSaving(true);
    try {
      const services = await loadFirestore();
      if (!services) throw new Error("sem conexão");
      const fs = await import("firebase/firestore");
      const addedBy = myEmail || normalizeEmail(user?.email);

      await Promise.all(
        fresh.map(email =>
          fs.setDoc(fs.doc(services.db, "access", email), {
            email,
            addedAt: fs.serverTimestamp(),
            addedBy: addedBy || null,
          })
        )
      );

      toast.success(
        fresh.length === 1
          ? "Acesso liberado."
          : `${fresh.length} acessos liberados.`
      );
      setInput("");
    } catch (cause) {
      console.error("Falha ao liberar acesso", cause);
      setFormError(messageForAccessError(cause));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (email: string) => {
    setRemoving(email);
    try {
      const services = await loadFirestore();
      if (!services) throw new Error("sem conexão");
      const fs = await import("firebase/firestore");
      await fs.deleteDoc(fs.doc(services.db, "access", email));
      toast.success(`Acesso de ${email} removido.`);
      setConfirming(null);
    } catch (cause) {
      console.error("Falha ao remover acesso", cause);
      toast.error(messageForAccessError(cause));
    } finally {
      setRemoving(null);
    }
  };

  return (
    <Screen>
      <ScreenHeader
        kicker="Administração"
        title="Quem pode entrar"
        description="A jornada é fechada. Libere o e-mail do Google de cada pessoa que deve ter acesso."
      />

      <Card>
        <div className="flex flex-wrap items-start gap-x-10 gap-y-5">
          <Stat
            emphasis
            label="E-mails liberados"
            value={entries.length}
            unit={entries.length === 1 ? "pessoa" : "pessoas"}
          />
          <div className="border-t border-line pt-4 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0">
            <Stat
              label="Administradoras"
              value={ADMIN_EMAILS.length}
              hint="entram sem estar na lista"
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>Liberar um e-mail</CardTitle>
        <form onSubmit={handleAdd} className="space-y-3">
          <Field
            label="E-mail da conta Google"
            htmlFor="admin-emails"
            hint="Separe vários por vírgula. Cada pessoa entra com a própria conta."
            error={formError}
            required
          >
            <input
              id="admin-emails"
              type="text"
              value={input}
              onChange={event => {
                setInput(event.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="nome@gmail.com"
              className={cn(fieldInputClass(Boolean(formError)), "h-11")}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="email"
              enterKeyHint="done"
            />
          </Field>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Action
              type="submit"
              disabled={saving || input.trim() === ""}
              icon={<MailPlus className="h-4 w-4" aria-hidden />}
            >
              {saving ? "Liberando…" : "Liberar acesso"}
            </Action>
            <p className="text-xs leading-relaxed text-ink-muted">
              A remoção corta o acesso à jornada.
            </p>
          </div>
        </form>
      </Card>

      <Card>
        <CardTitle
          hint={
            <span className="tabular-nums text-ink-muted">
              {entries.length}
            </span>
          }
        >
          Lista de acesso
        </CardTitle>

        {loading ? (
          <p aria-live="polite" className="text-sm text-ink-muted">
            Carregando a lista…
          </p>
        ) : listError ? (
          <div className="space-y-3">
            <p
              role="alert"
              className="text-sm leading-relaxed text-destructive"
            >
              {listError}
            </p>
            <Action
              variant="secondary"
              size="sm"
              onClick={() => setReload(value => value + 1)}
            >
              Tentar de novo
            </Action>
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={UserX}
            title="Ninguém além das administradoras"
            body="Libere o primeiro e-mail acima. A pessoa entra com a conta do Google dela."
            tone="warm"
            className="border-0"
          />
        ) : (
          <ul className="divide-y divide-line">
            {entries.map(entry => {
              const isConfirming = confirming === entry.email;
              const isRemoving = removing === entry.email;

              return (
                <li
                  key={entry.email}
                  className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {entry.email}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {entry.addedAt
                        ? `Liberado em ${formatShortDate(entry.addedAt)}`
                        : "Liberado"}
                    </p>
                  </div>

                  {isConfirming ? (
                    <div className="flex items-center gap-2">
                      <Action
                        variant="danger"
                        size="sm"
                        autoFocus
                        disabled={isRemoving}
                        onClick={() => handleRemove(entry.email)}
                      >
                        {isRemoving ? "Removendo…" : "Remover"}
                      </Action>
                      <Action
                        variant="secondary"
                        size="sm"
                        disabled={isRemoving}
                        onClick={() => setConfirming(null)}
                      >
                        Cancelar
                      </Action>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirming(entry.email)}
                      aria-label={`Remover acesso de ${entry.email}`}
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-destructive/10 hover:text-destructive",
                        focusRing
                      )}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card tone="warm" padding="sm">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-ink"
          >
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div className="min-w-0 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Administradoras
            </p>
            <ul className="space-y-1.5">
              {ADMIN_EMAILS.map(email => (
                <li key={email} className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-ink">{email}</span>
                  <Pill tone="brand">admin</Pill>
                </li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed text-ink-muted">
              Entram mesmo sem estar na lista e são as únicas que podem
              gerenciar acessos.
            </p>
          </div>
        </div>
      </Card>
    </Screen>
  );
}
