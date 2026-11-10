import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, PenLine, Plus, Trash2 } from "lucide-react";
import { useApp } from "@/app/store";
import { hasWriting, writtenDaysOf, type DayRecord } from "@/app/state";
import { DAY_COUNT, getDay, MOOD_SCALE, moodEmoji, moodLabel } from "@/journey";
import { dateOfDay, formatLongDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  Action,
  Card,
  CardTitle,
  EmptyState,
  Field,
  fieldInputClass,
  focusRing,
  Pill,
  Screen,
  ScreenHeader,
  Stat,
} from "@/components/ds";
import MoodChart from "@/components/MoodChart";

/** The prompts of that day that actually have an answer. */
function answeredPrompts(record: DayRecord) {
  return getDay(record.day)
    .journalPrompts.map((prompt, index) => ({
      key: `p${index}`,
      prompt,
      answer: record.prompts[`p${index}`] ?? "",
    }))
    .filter(item => item.answer.trim() !== "");
}

export default function Journal() {
  const { state, currentDay, saveDay, clearDayWriting } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [newMood, setNewMood] = useState(3);
  const [newText, setNewText] = useState("");
  const reduceMotion = useReducedMotion();

  const written = writtenDaysOf(state);
  const newestFirst = [...written].reverse();
  const todayRecord = state.days[currentDay];
  const todayWritten = todayRecord ? hasWriting(todayRecord) : false;
  const day = getDay(currentDay);
  const lastWrittenDay = newestFirst[0]?.day;

  const openEditor = () => {
    const record = state.days[currentDay];
    setNewMood(record?.mood ?? 3);
    setNewText(record?.notes ?? "");
    setShowNew(true);
  };

  const closeEditor = () => setShowNew(false);

  const handleSave = () => {
    if (!newText.trim()) return;
    saveDay(currentDay, { mood: newMood, notes: newText });
    setNewText("");
    setNewMood(3);
    setShowNew(false);
  };

  const handleDelete = (dayNumber: number) => {
    clearDayWriting(dayNumber);
    setExpandedDay(null);
  };

  return (
    <Screen>
      <ScreenHeader
        kicker={`Diário emocional · dia ${currentDay} de ${DAY_COUNT}`}
        title={
          todayWritten
            ? "Sua entrada de hoje está guardada"
            : "O que você quer guardar de hoje?"
        }
        description="Uma entrada por dia, no seu ritmo. O que você escreve fica salvo neste dispositivo, para reler quando quiser."
        actions={
          showNew ? (
            <Action variant="quiet" onClick={closeEditor}>
              Fechar
            </Action>
          ) : written.length > 0 ? (
            <Action
              onClick={openEditor}
              icon={<Plus className="h-4 w-4" aria-hidden />}
            >
              Nova entrada
            </Action>
          ) : undefined
        }
      />

      {showNew && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <Card>
            <div>
              <p className="font-serif text-lg text-ink">
                {todayWritten ? "Sua entrada de hoje" : "Nova entrada"}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                Dia {currentDay} de {DAY_COUNT} · {day.title}
              </p>
            </div>

            <fieldset className="mt-5">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Seu humor agora
              </legend>
              <div className="mt-2 grid grid-cols-5 gap-1.5 sm:gap-2">
                {MOOD_SCALE.map(step => {
                  const selected = newMood === step.value;
                  return (
                    <button
                      key={step.value}
                      type="button"
                      aria-pressed={selected}
                      aria-label={`Humor ${step.value} de ${MOOD_SCALE.length}: ${step.label}`}
                      onClick={() => setNewMood(step.value)}
                      className={cn(
                        "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 transition-colors",
                        focusRing,
                        selected
                          ? "border-brand bg-brand-soft"
                          : "border-line bg-white hover:bg-surface-soft"
                      )}
                    >
                      <span aria-hidden className="text-2xl leading-none">
                        {step.emoji}
                      </span>
                      <span
                        className={cn(
                          "text-center text-[10px] leading-tight",
                          selected ? "font-semibold text-ink" : "text-ink-muted"
                        )}
                      >
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Field
              label="O que você quer guardar deste dia"
              htmlFor="journal-new-text"
              hint={
                todayWritten
                  ? "Sua escrita de hoje já está aqui. Salvar substitui o texto."
                  : "Uma frase já basta. Fica salvo neste dispositivo — ninguém mais lê."
              }
              className="mt-5"
            >
              <textarea
                id="journal-new-text"
                autoFocus
                value={newText}
                onChange={event => setNewText(event.target.value)}
                aria-describedby="journal-new-text-hint"
                rows={6}
                placeholder="O que está no seu coração hoje?"
                className={cn(
                  fieldInputClass(),
                  "min-h-[132px] resize-y py-3 leading-relaxed text-ink-soft"
                )}
              />
            </Field>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
              <Action
                size="lg"
                block
                onClick={handleSave}
                disabled={!newText.trim()}
                className="sm:flex-1"
              >
                {todayWritten ? "Salvar a entrada de hoje" : "Salvar entrada"}
              </Action>
              <Action
                size="lg"
                variant="secondary"
                block
                onClick={closeEditor}
                className="sm:w-auto"
              >
                Cancelar
              </Action>
            </div>
          </Card>
        </motion.div>
      )}

      {written.length > 0 && (
        <Card tone="warm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <Stat
              label="Dias com escrita"
              value={written.length}
              unit={`de ${DAY_COUNT}`}
              emphasis
              hint={
                written.length > 1
                  ? `do dia ${written[0].day} ao dia ${lastWrittenDay}`
                  : `primeira entrada no dia ${written[0].day}`
              }
            />
            {todayWritten && <Pill tone="success">escrito hoje</Pill>}
          </div>
          <p className="mt-4 border-t border-line-strong pt-3 text-xs leading-relaxed text-ink-soft">
            Sua constância fica guardada aqui — é o registro que você vai reler
            no fim da jornada.
          </p>
        </Card>
      )}

      {written.length > 0 && <MoodChart records={written} />}

      {newestFirst.length === 0 ? (
        !showNew && (
          <EmptyState
            icon={PenLine}
            title="Nenhuma entrada ainda"
            body="O diário guarda o que você sente em cada dia da jornada. Uma frase hoje começa o registro que você vai reler no fim dos 30 dias."
            action={
              <Action
                size="lg"
                onClick={openEditor}
                icon={<Plus className="h-4 w-4" aria-hidden />}
              >
                Nova entrada
              </Action>
            }
          />
        )
      ) : (
        <section className="space-y-3" aria-labelledby="journal-entries-title">
          <CardTitle
            id="journal-entries-title"
            hint={
              <span className="text-ink-subtle">mais recente primeiro</span>
            }
          >
            Suas entradas
          </CardTitle>
          {newestFirst.map(record => (
            <JournalCard
              key={record.day}
              record={record}
              startDate={state.startDate}
              isToday={record.day === currentDay}
              isExpanded={expandedDay === record.day}
              onToggle={() =>
                setExpandedDay(expandedDay === record.day ? null : record.day)
              }
              onDelete={() => handleDelete(record.day)}
            />
          ))}
        </section>
      )}
    </Screen>
  );
}

function JournalCard({
  record,
  startDate,
  isToday,
  isExpanded,
  onToggle,
  onDelete,
}: {
  record: DayRecord;
  startDate: string | null;
  isToday: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const answers = answeredPrompts(record);
  const firstAnswer = answers[0];
  const preview = record.notes.trim() || firstAnswer?.answer || "";
  const entryDate = record.completedAt
    ? formatLongDate(record.completedAt)
    : startDate
      ? dateOfDay(startDate, record.day).toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "long",
        })
      : "";

  return (
    <Card as="article" padding="none">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`journal-entry-${record.day}`}
        className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-surface-soft focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand/60 sm:px-5"
      >
        <span aria-hidden className="mt-0.5 text-2xl leading-none">
          {moodEmoji(record.mood)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Dia {record.day}
            </span>
            {entryDate && (
              <span className="text-xs text-ink-muted">{entryDate}</span>
            )}
            {isToday && <Pill tone="warm">hoje</Pill>}
          </span>
          {firstAnswer && (
            <span className="mt-1 block truncate text-xs text-ink-muted">
              {firstAnswer.prompt}
            </span>
          )}
          <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {preview}
          </span>
          <span className="sr-only">
            {isExpanded ? "Recolher a entrada" : "Abrir a entrada"}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-ink-subtle transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      <div
        id={`journal-entry-${record.day}`}
        hidden={!isExpanded}
        className="border-t border-line px-4 pb-5 pt-4 sm:px-5"
      >
        {isExpanded && (
          <JournalEntryDetail record={record} onDelete={onDelete} />
        )}
      </div>
    </Card>
  );
}

function JournalEntryDetail({
  record,
  onDelete,
}: {
  record: DayRecord;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const answers = answeredPrompts(record);

  return (
    <div className="space-y-4">
      {record.notes.trim() && (
        <div className="rounded-xl bg-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Sua escrita
          </p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
            {record.notes}
          </p>
        </div>
      )}

      {answers.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Perguntas respondidas
          </p>
          {answers.map(item => (
            <div key={item.key} className="rounded-xl bg-surface p-3">
              <p className="text-xs leading-relaxed text-ink-muted">
                {item.prompt}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <p className="text-xs text-ink-muted">
          Humor do dia:{" "}
          <span className="font-medium text-ink">{moodLabel(record.mood)}</span>
        </p>
        {confirming ? (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-ink-muted">
              Apagar a escrita do dia {record.day}?
            </p>
            <Action
              size="md"
              variant="danger"
              onClick={onDelete}
              className="border border-destructive/30"
            >
              Apagar entrada
            </Action>
            <Action
              size="md"
              variant="quiet"
              onClick={() => setConfirming(false)}
            >
              Manter
            </Action>
          </div>
        ) : (
          <Action
            size="md"
            variant="quiet"
            onClick={() => setConfirming(true)}
            icon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
          >
            Excluir escrita
          </Action>
        )}
      </div>
    </div>
  );
}
