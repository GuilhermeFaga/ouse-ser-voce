import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  PenLine,
  Play,
  type LucideIcon,
} from "lucide-react";
import {
  Action,
  Card,
  Pill,
  ProgressRail,
  Screen,
  ScreenHeader,
} from "@/components/ds";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import { IMAGES } from "@/app/assets";
import MeditationPlayer from "@/components/MeditationPlayer";
import ShareInstagramButton from "@/share/ShareInstagramButton";
import { DAY_COUNT, MOOD_SCALE, getDay, moodLabel, weekOfDay } from "@/journey";
import { formatLongDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

type TabType = "reflexao" | "exercicio" | "diario" | "audio";

const STEPS: { id: TabType; label: string; icon: LucideIcon }[] = [
  { id: "reflexao", label: "Reflexão", icon: BookOpen },
  { id: "exercicio", label: "Exercício", icon: Heart },
  { id: "diario", label: "Diário", icon: PenLine },
  { id: "audio", label: "Áudio", icon: Play },
];

const NEXT_STEP: Record<TabType, { to: TabType; label: string } | null> = {
  reflexao: { to: "exercicio", label: "Fazer o exercício" },
  exercicio: { to: "diario", label: "Escrever no diário" },
  diario: { to: "audio", label: "Ouvir o áudio do dia" },
  audio: null,
};

const tabId = (tab: TabType) => `day-tab-${tab}`;
const panelId = (tab: TabType) => `day-panel-${tab}`;

function joinList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

export default function DayView() {
  const { currentDay } = useApp();
  const { selectedDay } = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>("reflexao");
  const dayNumber = selectedDay ?? currentDay;

  return (
    <DayScreen
      key={dayNumber}
      dayNumber={dayNumber}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}

function DayScreen({
  dayNumber,
  activeTab,
  onTabChange,
}: {
  dayNumber: number;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) {
  const {
    state,
    currentDay,
    currentStreak,
    completedDays,
    completeDay,
    saveDay,
  } = useApp();
  const { navigate, openDay } = useNavigation();
  const reduceMotion = useReducedMotion();
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);
  const tabRefs = useRef<Partial<Record<TabType, HTMLButtonElement | null>>>(
    {}
  );

  const day = getDay(dayNumber);
  const week = weekOfDay(dayNumber);
  const record = state.days[dayNumber];
  const isCompleted = record?.completedAt != null;
  const mood = record?.mood ?? 3;
  const notes = record?.notes ?? "";
  const prompts = record?.prompts ?? {};

  const answeredPrompts = day.journalPrompts.filter(
    (_, index) => (prompts[`p${index}`] ?? "").trim().length > 0
  ).length;
  const exerciseDone = record?.exerciseCompleted ?? false;
  const audioDone = record?.meditationListened ?? false;
  const hasWritten = notes.trim().length > 0 || answeredPrompts > 0;

  const stepDone: Record<TabType, boolean> = {
    // A reflexão abre junto com o dia, então a prática nunca começa em zero.
    reflexao: true,
    exercicio: exerciseDone,
    diario: hasWritten,
    audio: audioDone,
  };
  const doneCount = STEPS.filter(step => stepDone[step.id]).length;
  const remaining = STEPS.length - doneCount;
  const nextDay = day.day < DAY_COUNT ? day.day + 1 : null;
  const nextStep = NEXT_STEP[activeTab];

  const practiceCaption = isCompleted
    ? "Dia concluído. Você pode revisar cada etapa."
    : doneCount === STEPS.length
      ? "Tudo marcado. Conclua o dia para guardar o registro."
      : remaining === 1
        ? "Você já começou hoje. Falta 1 passo."
        : doneCount === 1
          ? `A reflexão de hoje já está aqui. Faltam ${remaining} passos.`
          : `Você já começou hoje. Faltam ${remaining} passos.`;

  const effortPhrases = [
    exerciseDone && "fez o exercício",
    hasWritten && "escreveu no diário",
    audioDone && "ouviu o áudio",
  ].filter((phrase): phrase is string => Boolean(phrase));
  const celebrationLine = effortPhrases.length
    ? `Hoje você ${joinList(effortPhrases)}.`
    : "Dia encerrado. O registro fica salvo no seu calendário.";

  const handleComplete = () => {
    completeDay(dayNumber, {});
    setIsFirstCompletion(true);
    setShowCelebration(true);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = STEPS.findIndex(step => step.id === activeTab);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % STEPS.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + STEPS.length) % STEPS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = STEPS.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const next = STEPS[nextIndex];
    onTabChange(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const continueLabel = nextDay
    ? `Continuar o dia ${nextDay}`
    : "Ver minha jornada";
  const goToNextDay = () => {
    if (nextDay) openDay(nextDay);
    else navigate("journey");
  };

  if (showCelebration) {
    return (
      <Celebration
        kicker={`Dia ${day.day} de ${DAY_COUNT} · ${week.subtitle}`}
        dayNumber={day.day}
        mood={mood}
        line={celebrationLine}
        affirmation={day.affirmation}
        completedCount={completedDays.length}
        streak={currentStreak}
        continueLabel={continueLabel}
        continueHint={
          nextDay
            ? `Abre o dia ${nextDay} · o registro de hoje fica salvo.`
            : "Você concluiu os 30 dias. Sua jornada inteira fica salva."
        }
        dismissLabel={
          isFirstCompletion ? "Ver meu diário" : "Ver o registro do dia"
        }
        onDismiss={
          isFirstCompletion
            ? () => navigate("journal")
            : () => setShowCelebration(false)
        }
        onContinue={goToNextDay}
      />
    );
  }

  return (
    <Screen>
      <div>
        <button
          type="button"
          onClick={() => navigate("journey")}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Todos os dias
        </button>
        <ScreenHeader
          kicker={`Dia ${day.day} de ${DAY_COUNT} · ${week.subtitle} · ${day.theme}`}
          title={day.title}
          description={day.subtitle}
          actions={
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                week.palette.bg,
                week.palette.border,
                week.palette.text
              )}
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full", week.palette.dot)}
                aria-hidden
              />
              {week.shortTitle}
            </span>
          }
        />
      </div>

      <Card padding="sm" className="space-y-3">
        <div
          role="tablist"
          aria-label="Etapas da prática de hoje"
          onKeyDown={handleTabKeyDown}
          className="flex gap-1.5"
        >
          {STEPS.map(step => {
            const done = stepDone[step.id];
            const selected = activeTab === step.id;
            const Icon = done ? Check : step.icon;
            return (
              <button
                key={step.id}
                ref={node => {
                  tabRefs.current[step.id] = node;
                }}
                type="button"
                role="tab"
                id={tabId(step.id)}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => onTabChange(step.id)}
                className={cn(
                  "flex min-h-16 flex-1 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-[11px] font-medium leading-tight transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                  selected
                    ? "border-brand/50 bg-white text-ink shadow-[0_1px_2px_rgba(44,24,16,0.06)]"
                    : done
                      ? "border-transparent bg-brand-soft text-ink hover:bg-brand-soft/70"
                      : "border-transparent bg-transparent text-ink-muted hover:bg-surface-soft hover:text-ink"
                )}
              >
                <Icon
                  className={cn("h-4 w-4", done ? "text-brand-ink" : undefined)}
                  aria-hidden
                />
                {step.label}
                {done && <span className="sr-only"> — concluído</span>}
              </button>
            );
          })}
        </div>
        <div className="space-y-1.5 px-1 pb-1">
          <ProgressRail
            value={doneCount}
            max={STEPS.length}
            size="sm"
            label="Sua prática de hoje"
            valueLabel={`${doneCount} de ${STEPS.length} passos`}
          />
          <p className="text-xs leading-relaxed text-ink-muted">
            {practiceCaption}
          </p>
        </div>
      </Card>

      <motion.div
        key={activeTab}
        id={panelId(activeTab)}
        role="tabpanel"
        aria-labelledby={tabId(activeTab)}
        tabIndex={0}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }
        }
        className="space-y-4 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {activeTab === "reflexao" && (
          <>
            <Card tone="warm" className="border-l-4 border-l-brand">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Soraya Farias
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                {day.soraiaMessage}
              </p>
            </Card>

            <Card>
              <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
                {day.reflection}
              </p>
            </Card>

            <Card tone="outline" className="bg-brand-wash text-center">
              <p className="font-serif text-base italic leading-relaxed text-ink">
                “{day.affirmation}”
              </p>
              <p className="mt-2 text-xs text-ink-subtle">
                Sua afirmação para hoje
              </p>
            </Card>

            {nextStep && (
              <Action
                variant="ghost"
                block
                onClick={() => onTabChange(nextStep.to)}
                className="justify-center"
              >
                {nextStep.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Action>
            )}
          </>
        )}

        {activeTab === "exercicio" && (
          <>
            <Card padding="none" clip>
              <div className="relative h-36 overflow-hidden">
                <img
                  src={IMAGES.journal}
                  alt=""
                  aria-hidden
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent" />
                <h2 className="absolute inset-x-5 bottom-4 font-serif text-lg leading-tight text-white">
                  {day.exercise.title}
                </h2>
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-ink-soft">
                  {day.exercise.description}
                </p>
                <ol className="space-y-3">
                  {day.exercise.steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold tabular-nums text-brand-ink"
                      >
                        {index + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-ink-soft">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
                <Action
                  variant="secondary"
                  block
                  aria-pressed={exerciseDone}
                  onClick={() =>
                    saveDay(dayNumber, { exerciseCompleted: !exerciseDone })
                  }
                  icon={<Check className="h-4 w-4" aria-hidden />}
                  className={cn(
                    exerciseDone && "border-brand/40 bg-brand-soft text-ink"
                  )}
                >
                  {exerciseDone
                    ? "Exercício feito"
                    : "Marcar exercício como feito"}
                </Action>
              </div>
            </Card>

            {nextStep && (
              <Action
                variant="ghost"
                block
                onClick={() => onTabChange(nextStep.to)}
              >
                {nextStep.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Action>
            )}
          </>
        )}

        {activeTab === "diario" && (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Diário de hoje
              </p>
              <p className="text-xs tabular-nums text-ink-muted">
                {answeredPrompts} de {day.journalPrompts.length} respondidas
              </p>
            </div>

            {day.journalPrompts.map((prompt, index) => {
              const key = `p${index}`;
              const fieldId = `day-${dayNumber}-${key}`;
              return (
                <Card key={key}>
                  <label
                    htmlFor={fieldId}
                    className="block text-sm font-medium leading-relaxed text-ink"
                  >
                    {prompt}
                  </label>
                  <Textarea
                    id={fieldId}
                    value={prompts[key] ?? ""}
                    onChange={event =>
                      saveDay(dayNumber, {
                        prompts: { ...prompts, [key]: event.target.value },
                      })
                    }
                    placeholder="Escreva aqui o que vier..."
                    className="mt-3 min-h-[100px] resize-none rounded-xl border-line-strong bg-surface text-sm text-ink placeholder:text-ink-faint focus-visible:border-brand focus-visible:ring-brand/30"
                  />
                </Card>
              );
            })}

            <Card>
              <label
                htmlFor={`day-${dayNumber}-notes`}
                className="block text-sm font-medium leading-relaxed text-ink"
              >
                Anotações livres
              </label>
              <Textarea
                id={`day-${dayNumber}-notes`}
                value={notes}
                onChange={event =>
                  saveDay(dayNumber, { notes: event.target.value })
                }
                placeholder="Qualquer coisa que queira registrar sobre hoje..."
                className="mt-3 min-h-[80px] resize-none rounded-xl border-line-strong bg-surface text-sm text-ink placeholder:text-ink-faint focus-visible:border-brand focus-visible:ring-brand/30"
              />
            </Card>

            {nextStep && (
              <Action
                variant="ghost"
                block
                onClick={() => onTabChange(nextStep.to)}
              >
                {nextStep.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Action>
            )}
          </>
        )}

        {activeTab === "audio" && (
          <>
            <Card>
              <p className="text-sm leading-relaxed text-ink-soft">
                {day.meditationDescription}
              </p>
            </Card>
            <MeditationPlayer
              title={day.meditationTitle}
              duration={day.meditationDuration}
              audioUrl={day.audioUrl}
              dayNumber={day.day}
              completed={audioDone}
              onComplete={() =>
                saveDay(dayNumber, { meditationListened: true })
              }
            />
            <p className="px-1 text-xs leading-relaxed text-ink-muted">
              O áudio não bloqueia a conclusão do dia — você pode voltar a ele
              depois.
            </p>
          </>
        )}
      </motion.div>

      {isCompleted ? (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <Pill tone="success">
                <Check className="h-3 w-3" aria-hidden />
                Concluído
              </Pill>
              <p className="mt-2 font-serif text-lg leading-tight text-ink">
                Dia {day.day} registrado
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                {record?.completedAt
                  ? `${formatLongDate(record.completedAt)} · humor ${moodLabel(mood).toLowerCase()}`
                  : `humor ${moodLabel(mood).toLowerCase()}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Sequência
              </p>
              <p className="mt-1 font-serif text-[26px] leading-none tabular-nums text-ink">
                {currentStreak}
                <span className="ml-1 font-sans text-xs font-medium text-ink-subtle">
                  {currentStreak === 1 ? "dia" : "dias"}
                </span>
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-2 border-t border-line pt-4">
            {STEPS.map(step => {
              const Icon = step.icon;
              const done = stepDone[step.id];
              return (
                <li
                  key={step.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2 text-sm text-ink-soft">
                    <Icon className="h-4 w-4 text-ink-subtle" aria-hidden />
                    {step.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      done ? "text-ink-muted" : "text-ink-subtle"
                    )}
                  >
                    {done ? "registrado" : "não marcado"}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-line pt-4">
            <Action size="lg" block onClick={goToNextDay}>
              {continueLabel}
            </Action>
            <p className="mt-2 text-center text-xs leading-relaxed text-ink-muted">
              Seu registro, seu humor e o que você escreveu ficam salvos neste
              dia.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
            <ShareInstagramButton
              subject={{ kind: "day", day: day.day, mood }}
              variant="ghost"
            />
            <Action
              variant="quiet"
              size="md"
              onClick={() => {
                setIsFirstCompletion(false);
                setShowCelebration(true);
              }}
            >
              Rever a celebração
            </Action>
          </div>
        </Card>
      ) : (
        <Card>
          <fieldset className="min-w-0">
            <legend className="text-sm font-medium text-ink">
              Como você está se sentindo agora?
            </legend>
            <p className="mt-1 text-xs text-ink-muted">
              Sua resposta entra no calendário de humor.
            </p>
            <div className="mt-4 grid grid-cols-5 gap-1.5">
              {MOOD_SCALE.map(step => {
                const fieldId = `day-${dayNumber}-mood-${step.value}`;
                const selected = mood === step.value;
                return (
                  <label
                    key={step.value}
                    htmlFor={fieldId}
                    className={cn(
                      "flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-center text-[11px] leading-tight transition-colors",
                      "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40",
                      selected
                        ? "border-brand bg-brand-soft font-semibold text-ink"
                        : "border-line-strong bg-white text-ink-muted hover:bg-surface-soft"
                    )}
                  >
                    <input
                      id={fieldId}
                      type="radio"
                      name={`day-${dayNumber}-mood`}
                      value={step.value}
                      checked={selected}
                      onChange={() => saveDay(dayNumber, { mood: step.value })}
                      className="sr-only"
                    />
                    {step.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5 border-t border-line pt-5">
            <Action
              size="lg"
              block
              onClick={handleComplete}
              icon={<Check className="h-5 w-5" aria-hidden />}
            >
              Concluir o dia {day.day}
            </Action>
            <p className="mt-2 text-center text-xs leading-relaxed text-ink-muted">
              {doneCount === STEPS.length
                ? "Fica salvo no seu calendário com a sua nota de humor."
                : "Você pode concluir sem marcar tudo — o dia fica salvo no calendário."}
            </p>
          </div>
        </Card>
      )}

      <nav
        aria-label="Navegação entre dias"
        className="flex items-center justify-between gap-2"
      >
        <button
          type="button"
          onClick={() => openDay(day.day - 1)}
          disabled={day.day <= 1}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg text-sm text-ink-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Dia anterior
        </button>
        <span className="text-xs tabular-nums text-ink-subtle">
          Dia {day.day} de {DAY_COUNT}
        </span>
        <button
          type="button"
          onClick={() => openDay(day.day + 1)}
          disabled={day.day >= currentDay}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg text-sm text-ink-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          Dia seguinte
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </nav>
    </Screen>
  );
}

function Celebration({
  kicker,
  dayNumber,
  mood,
  line,
  affirmation,
  completedCount,
  streak,
  continueLabel,
  continueHint,
  dismissLabel,
  onDismiss,
  onContinue,
}: {
  kicker: string;
  dayNumber: number;
  mood: number;
  line: string;
  affirmation: string;
  completedCount: number;
  streak: number;
  continueLabel: string;
  continueHint: string;
  dismissLabel: string;
  onDismiss: () => void;
  onContinue: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Screen>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.26, ease: "easeOut" }
        }
      >
        <Card tone="warm" className="text-center">
          <motion.div
            initial={reduceMotion ? false : { scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.32, ease: "easeOut", delay: 0.06 }
            }
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand font-serif text-2xl leading-none tabular-nums text-ink shadow-[0_1px_2px_rgba(44,24,16,0.12)]"
          >
            {dayNumber}
          </motion.div>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            {kicker}
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-1.5 font-serif text-[26px] leading-tight text-ink focus:outline-none sm:text-[30px]"
          >
            Dia {dayNumber} concluído.
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
            {line}
          </p>

          <div className="mt-5 rounded-xl border border-line bg-white px-4 py-4">
            <p className="font-serif text-base italic leading-relaxed text-ink">
              “{affirmation}”
            </p>
          </div>

          <div className="mt-5 space-y-2 text-left">
            <ProgressRail
              value={completedCount}
              max={DAY_COUNT}
              label="Sua jornada"
              valueLabel={`${completedCount} de ${DAY_COUNT} dias`}
            />
            <p className="text-xs leading-relaxed text-ink-muted">
              Sequência de {streak} {streak === 1 ? "dia" : "dias"}. Ela fica
              salva junto com o registro deste dia.
            </p>
          </div>

          <div className="mt-5 space-y-2">
            <Action size="lg" block onClick={onContinue}>
              {continueLabel}
            </Action>
            <p className="text-xs leading-relaxed text-ink-muted">
              {continueHint}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-line pt-4">
            <ShareInstagramButton
              subject={{ kind: "day", day: dayNumber, mood }}
              variant="ghost"
            />
            <Action variant="quiet" size="md" onClick={onDismiss}>
              {dismissLabel}
            </Action>
          </div>
        </Card>
      </motion.div>
    </Screen>
  );
}
