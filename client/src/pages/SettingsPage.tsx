import { useState } from "react";
import { ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/app/store";
import { writtenDaysOf } from "@/app/state";
import { formatLongDate } from "@/lib/dates";
import { DAY_COUNT } from "@/journey";
import { cn } from "@/lib/utils";
import {
  Action,
  Card,
  CardTitle,
  Field,
  ProgressRail,
  Screen,
  ScreenHeader,
  Stat,
  fieldInputClass,
} from "@/components/ds";

/** One thing the reset destroys, in its own unit. */
interface Loss {
  count: number;
  one: string;
  many: string;
}

const joinWords = (words: string[]) =>
  words.length <= 1
    ? (words[0] ?? "")
    : `${words.slice(0, -1).join(", ")} e ${words[words.length - 1]}`;

/** "12 dias concluídos, 8 entradas no diário e 5 anotações" — numbers in ink. */
function LossList({ items }: { items: Loss[] }) {
  return (
    <>
      {items.map((item, index) => (
        <span key={item.many}>
          {index > 0 && (index === items.length - 1 ? " e " : ", ")}
          <span className="font-medium tabular-nums text-ink">
            {item.count}
          </span>{" "}
          {item.count === 1 ? item.one : item.many}
        </span>
      ))}
    </>
  );
}

export default function SettingsPage() {
  const { state, completedDays, progressPercent, updateName, resetAll } =
    useApp();
  const [name, setName] = useState(state.userName);
  const [triedSave, setTriedSave] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [confirmSeen, setConfirmSeen] = useState(false);

  const trimmed = name.trim();
  const unchanged = trimmed === state.userName.trim();
  const nameError =
    triedSave && trimmed === "" ? "Escreva seu nome para salvar." : null;

  const journalEntries = writtenDaysOf(state).length;
  const achievements = state.unlockedAchievements.length;

  const losses: Loss[] = [
    {
      count: completedDays.length,
      one: "dia concluído",
      many: "dias concluídos",
    },
    {
      count: journalEntries,
      one: "entrada no diário",
      many: "entradas no diário",
    },
    { count: state.notes.length, one: "anotação", many: "anotações" },
    { count: achievements, one: "conquista", many: "conquistas" },
  ].filter(loss => loss.count > 0);

  const otherLosses = [
    state.scanner ? "do diagnóstico" : null,
    state.initialAssessment || state.finalAssessment ? "das avaliações" : null,
    state.favoriteAudioDays.length > 0 ? "dos áudios favoritos" : null,
  ].filter((item): item is string => item !== null);

  const hasRecord = losses.length > 0 || otherLosses.length > 0;

  const handleSaveName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (trimmed === "") {
      setTriedSave(true);
      return;
    }
    updateName(trimmed);
    setTriedSave(false);
    toast.success("Nome atualizado");
  };

  const handleReset = () => {
    resetAll();
    setConfirmingReset(false);
    setName("");
    setTriedSave(false);
    toast.success("Dados apagados. A jornada recomeça do dia 1.");
  };

  return (
    <Screen>
      <ScreenHeader
        kicker="Seus dados"
        title="Configurações"
        description="Seu nome, o que a jornada já guardou e o que fica neste dispositivo."
      />

      {/* The one decision on this screen, and the one primary action. */}
      <Card>
        <CardTitle>Seu nome</CardTitle>
        <form onSubmit={handleSaveName} className="space-y-3">
          <Field
            label="Como você quer ser chamada"
            htmlFor="settings-name"
            hint="Aparece na sua saudação e no menu do app."
            error={nameError}
            required
          >
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={event => {
                setName(event.target.value);
                if (triedSave) setTriedSave(false);
              }}
              className={cn(fieldInputClass(Boolean(nameError)), "h-11")}
              autoComplete="given-name"
              maxLength={40}
              enterKeyHint="done"
            />
          </Field>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Action type="submit" disabled={unchanged}>
              Salvar nome
            </Action>
            <p className="text-xs text-ink-muted">
              {unchanged && trimmed !== ""
                ? "Este nome já está salvo."
                : "Fica salvo neste dispositivo, sem enviar para servidor."}
            </p>
          </div>
        </form>
      </Card>

      {/* The accumulated record, shown as the thing worth keeping. */}
      <Card>
        <CardTitle>Seu registro</CardTitle>

        {hasRecord ? (
          <>
            <div className="flex flex-wrap items-start gap-x-8 gap-y-5">
              <Stat
                emphasis
                label="Dias concluídos"
                value={completedDays.length}
                unit={`de ${DAY_COUNT}`}
              />
              <div className="grid w-full grid-cols-3 gap-4 border-t border-line pt-4 sm:w-auto sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                <Stat
                  label="Diário"
                  value={journalEntries}
                  unit={journalEntries === 1 ? "entrada" : "entradas"}
                />
                <Stat label="Anotações" value={state.notes.length} />
                <Stat label="Conquistas" value={achievements} />
              </div>
            </div>

            <ProgressRail
              className="mt-5"
              value={progressPercent}
              label="Trilha completa"
              valueLabel={`${completedDays.length} de ${DAY_COUNT}`}
            />
          </>
        ) : (
          <div className="space-y-1.5">
            <p className="text-sm leading-relaxed text-ink-soft">
              Nada guardado ainda. Cada dia concluído, entrada no diário e
              anotação aparece aqui.
            </p>
            <p className="text-xs text-ink-muted">
              O primeiro registro nasce no dia 1.
            </p>
          </div>
        )}

        {state.startDate && (
          <p className="mt-4 text-xs text-ink-muted">
            Jornada iniciada em {formatLongDate(state.startDate)}
          </p>
        )}
      </Card>

      <Card tone="warm" padding="sm" className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-ink"
          aria-hidden
        >
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Privacidade
          </p>
          <p className="text-sm leading-relaxed text-ink-soft">
            Tudo o que você escreve fica neste dispositivo — nada é enviado para
            servidor.
          </p>
        </div>
      </Card>

      {/* Isolated, named, and only offered when there is something to lose. */}
      <Card tone="outline" className="border-destructive/30">
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            aria-hidden
          >
            <Trash2 className="h-4 w-4" />
          </span>
          <div className="min-w-0 space-y-1.5">
            <h2 className="font-serif text-lg text-ink">Apagar meus dados</h2>
            {hasRecord ? (
              <p className="text-sm leading-relaxed text-ink-muted">
                Apagar remove{" "}
                {losses.length > 0 ? (
                  <>
                    <LossList items={losses} /> deste dispositivo
                    {otherLosses.length > 0 && (
                      <>, além {joinWords(otherLosses)}</>
                    )}
                  </>
                ) : (
                  <>
                    o que está guardado neste dispositivo, incluindo{" "}
                    {joinWords(otherLosses)}
                  </>
                )}
                . Não há como recuperar, e a jornada recomeça do zero.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-ink-muted">
                Nada guardado ainda, então não há o que apagar aqui.
              </p>
            )}
          </div>
        </div>

        {hasRecord && (
          <div className="mt-4">
            {confirmingReset ? (
              <div
                role="group"
                aria-labelledby="apagar-confirmar"
                onKeyDown={event => {
                  if (event.key === "Escape") setConfirmingReset(false);
                }}
                className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 sm:p-4"
              >
                <div className="space-y-1">
                  <p
                    id="apagar-confirmar"
                    className="text-sm font-medium text-ink"
                  >
                    Apagar tudo agora?
                  </p>
                  <p className="text-xs leading-relaxed text-ink-muted">
                    Seu registro e seu diário somem deste dispositivo.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Action
                    variant="danger"
                    className="border border-destructive/30"
                    onClick={handleReset}
                  >
                    Apagar e recomeçar
                  </Action>
                  <Action
                    variant="secondary"
                    autoFocus
                    onClick={() => setConfirmingReset(false)}
                  >
                    Manter meus dados
                  </Action>
                </div>
              </div>
            ) : (
              <Action
                variant="danger"
                className="border border-destructive/30"
                icon={<Trash2 className="h-4 w-4" aria-hidden />}
                autoFocus={confirmSeen}
                onClick={() => {
                  setConfirmSeen(true);
                  setConfirmingReset(true);
                }}
              >
                Apagar tudo
              </Action>
            )}
          </div>
        )}
      </Card>
    </Screen>
  );
}
