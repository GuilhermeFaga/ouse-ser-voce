import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Check, Lock } from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import {
  DAY_COUNT,
  daysOfWeek,
  getDay,
  isDayAccessible,
  moodEmoji,
  moodLabel,
  weekModules,
  weekProgress,
} from "@/journey";
import { dateOfDay } from "@/lib/dates";
import {
  Action,
  Card,
  CardTitle,
  EmptyState,
  Pill,
  ProgressRail,
  Screen,
  ScreenHeader,
  Stat,
  focusRing,
} from "@/components/ds";
import { cn } from "@/lib/utils";

function weekdayLabel(date: Date) {
  return date
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .replace(".", "")
    .slice(0, 3);
}

export default function CalendarView() {
  const { state, currentDay, completedDays, currentStreak, progressPercent } =
    useApp();
  const { openDay } = useNavigation();
  const [selectedDay, setSelectedDay] = useState<number>(currentDay);
  const detailRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const done = completedDays.length;
  const remaining = DAY_COUNT - done;
  const allDone = done >= DAY_COUNT;
  const currentWeek = getDay(currentDay).week;

  const selectedContent = getDay(selectedDay);
  const selectedRecord = state.days[selectedDay];
  const selectedCompleted = selectedRecord?.completedAt != null;
  const selectedAccessible = isDayAccessible(selectedDay, currentDay);

  const daysHint = allDone
    ? "Os 30 dias estão completos."
    : done === 0
      ? "O primeiro quadrado é o dia 1."
      : remaining === 1
        ? "Falta 1 dia para fechar os 30."
        : `Faltam ${remaining} dias para fechar os 30.`;

  const streakHint = allDone
    ? "Você chegou ao dia 30 sem interrupção."
    : currentStreak === 0
      ? "Começa no primeiro dia que você concluir."
      : `Concluir o dia ${currentDay} mantém a sua sequência.`;

  const selectDay = (day: number) => {
    setSelectedDay(day);
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
      });
    });
  };

  const rise = (delay = 0) => ({
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.24,
      ease: "easeOut" as const,
      delay: reduceMotion ? 0 : delay,
    },
  });

  return (
    <Screen>
      <ScreenHeader
        kicker="Sua constância"
        title="Seu calendário"
        description={`Os ${DAY_COUNT} dias, semana a semana. Toque em um dia para ver o que ele guardou.`}
      />

      {/* The one number that wins the screen, plus what protects it. */}
      <motion.div {...rise()}>
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
            <Stat
              emphasis
              label="Dias concluídos"
              value={done}
              unit={`de ${DAY_COUNT}`}
              hint={daysHint}
            />
            <div className="w-full border-t border-line pt-4 sm:w-auto sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
              <Stat
                label="Sequência atual"
                value={currentStreak}
                unit={currentStreak === 1 ? "dia" : "dias"}
                hint={streakHint}
              />
            </div>
          </div>
          <ProgressRail
            className="mt-5"
            value={progressPercent}
            label="Trilha completa"
            valueLabel={`${done} de ${DAY_COUNT}`}
          />
        </Card>
      </motion.div>

      {done === 0 && (
        <EmptyState
          icon={CalendarDays}
          tone="warm"
          title="Nenhum dia concluído ainda"
          body="Cada dia concluído vira um quadrado cheio, com o humor que você registrou. O primeiro é o dia 1."
        />
      )}

      {/* The 30 days, grouped by week so the scan happens per block, not per cell. */}
      <motion.div {...rise(0.05)}>
        <Card padding="none" className="overflow-hidden">
          <div className="px-4 pt-4 sm:px-5 sm:pt-5">
            <CardTitle
              className="mb-0"
              hint={
                <span className="tabular-nums text-ink-muted">
                  {done} de {DAY_COUNT}
                </span>
              }
            >
              Seus {DAY_COUNT} dias
            </CardTitle>
          </div>

          <div className="mt-3 divide-y divide-line border-t border-line">
            {weekModules.map(module => {
              const progress = weekProgress(module.week, completedDays);
              const isCurrentWeek = module.week === currentWeek;

              return (
                <section
                  key={module.week}
                  aria-labelledby={`semana-${module.week}`}
                  className={cn(
                    "relative px-3 pb-3 pt-2.5 sm:px-4",
                    isCurrentWeek && "bg-brand-wash/60"
                  )}
                >
                  {isCurrentWeek && (
                    <span
                      className="absolute inset-y-0 left-0 w-[3px] bg-brand"
                      aria-hidden
                    />
                  )}

                  <div className="flex items-baseline justify-between gap-3 px-1">
                    <h3
                      id={`semana-${module.week}`}
                      className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          module.palette.dot
                        )}
                        aria-hidden
                      />
                      <span
                        className={cn(
                          "truncate",
                          isCurrentWeek ? "text-ink" : "text-ink-muted"
                        )}
                      >
                        Semana {module.week} · {module.shortTitle}
                      </span>
                    </h3>
                    <p className="shrink-0 text-[11px] tabular-nums text-ink-subtle">
                      {progress.completed} de {progress.total}
                    </p>
                  </div>

                  {/* edge-to-edge on phones so each of the 7 cells clears a 44px tap target */}
                  <div className="-mx-3 mt-2 grid grid-cols-7 gap-0.5 sm:mx-0 sm:gap-1.5">
                    {daysOfWeek(module.week).map(content => {
                      const date = dateOfDay(state.startDate, content.day);
                      const record = state.days[content.day];
                      const completed = record?.completedAt != null;
                      const isToday = content.day === currentDay;
                      const accessible = isDayAccessible(
                        content.day,
                        currentDay
                      );
                      const isSelected = selectedDay === content.day;

                      const label = [
                        `Dia ${content.day}`,
                        completed
                          ? "concluído"
                          : isToday
                            ? "hoje"
                            : accessible
                              ? "sem registro"
                              : "ainda não chegou",
                        completed && record
                          ? `humor ${moodLabel(record.mood).toLowerCase()}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <button
                          key={content.day}
                          type="button"
                          onClick={() => selectDay(content.day)}
                          aria-label={label}
                          aria-pressed={isSelected}
                          aria-current={isToday ? "date" : undefined}
                          className={cn(
                            "flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl border px-0.5 py-1.5 transition-colors sm:min-h-[58px]",
                            focusRing,
                            completed
                              ? "border-transparent bg-brand text-ink hover:bg-brand/90"
                              : isToday
                                ? "border-brand bg-brand-wash text-ink hover:bg-white"
                                : accessible
                                  ? "border-dashed border-line-strong bg-white hover:bg-surface-soft"
                                  : "border-dashed border-line bg-surface-soft/50 hover:bg-surface-soft",
                            isSelected && "ring-2 ring-ink/40"
                          )}
                        >
                          <span
                            className={cn(
                              "text-[10px] font-medium uppercase leading-none tracking-[0.04em]",
                              completed ? "text-ink" : "text-ink-subtle"
                            )}
                            aria-hidden
                          >
                            {weekdayLabel(date)}
                          </span>
                          <span
                            className={cn(
                              "font-serif text-[15px] leading-none tabular-nums",
                              completed || isToday
                                ? "font-semibold text-ink"
                                : accessible
                                  ? "text-ink-soft"
                                  : "text-ink-subtle"
                            )}
                            aria-hidden
                          >
                            {content.day}
                          </span>
                          {completed && record ? (
                            <span
                              className="text-[11px] leading-none"
                              aria-hidden
                            >
                              {moodEmoji(record.mood)}
                            </span>
                          ) : isToday ? (
                            <span
                              className="text-[10px] font-semibold leading-none text-ink"
                              aria-hidden
                            >
                              hoje
                            </span>
                          ) : (
                            <span className="h-[11px]" aria-hidden />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line bg-surface-soft/60 px-3 py-3 text-[11px] text-ink-muted sm:px-4">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-3.5 w-3.5 rounded-[4px] bg-brand"
                aria-hidden
              />
              Concluído
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-3.5 w-3.5 rounded-[4px] border border-brand bg-brand-wash"
                aria-hidden
              />
              Hoje
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-3.5 w-3.5 rounded-[4px] border border-dashed border-line-strong"
                aria-hidden
              />
              Sem registro
            </span>
            <span className="text-ink-subtle">
              O emoji é o humor que você registrou.
            </span>
          </div>
        </Card>
      </motion.div>

      {/* The selected day: what it contains, and the screen's only action. */}
      <motion.div
        ref={detailRef}
        key={selectedDay}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="scroll-mt-20"
      >
        <Card as="div">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Dia {selectedDay} · {selectedContent.theme}
              </p>
              <h2 className="mt-1 font-serif text-[21px] leading-snug text-ink sm:text-[23px]">
                {selectedContent.title}
              </h2>
            </div>
            <Pill
              tone={
                selectedCompleted
                  ? "success"
                  : selectedDay === currentDay
                    ? "brand"
                    : "neutral"
              }
            >
              {selectedCompleted
                ? "Concluído"
                : selectedDay === currentDay
                  ? "Hoje"
                  : selectedAccessible
                    ? "Sem registro"
                    : "Ainda não chegou"}
            </Pill>
          </div>

          {selectedCompleted && selectedRecord ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-xl"
                  aria-hidden
                >
                  {moodEmoji(selectedRecord.mood)}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                    Humor neste dia
                  </p>
                  <p className="text-sm font-medium text-ink">
                    {moodLabel(selectedRecord.mood)}
                  </p>
                </div>
              </div>

              {selectedRecord.notes.trim() && (
                <p className="rounded-xl bg-surface-soft p-3 text-sm leading-relaxed text-ink-soft">
                  {selectedRecord.notes}
                </p>
              )}

              {(selectedRecord.exerciseCompleted ||
                selectedRecord.meditationListened) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
                  {selectedRecord.exerciseCompleted && (
                    <span className="inline-flex items-center gap-1.5">
                      <Check
                        className="h-3.5 w-3.5 text-brand-ink"
                        aria-hidden
                      />
                      Exercício feito
                    </span>
                  )}
                  {selectedRecord.meditationListened && (
                    <span className="inline-flex items-center gap-1.5">
                      <Check
                        className="h-3.5 w-3.5 text-brand-ink"
                        aria-hidden
                      />
                      Meditação ouvida
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {selectedDay < currentDay
                ? "Este dia passou sem registro."
                : selectedDay === currentDay
                  ? "Você ainda não concluiu este dia."
                  : "Este dia ainda não chegou."}
            </p>
          )}

          {selectedAccessible ? (
            <div className="mt-5">
              <Action block onClick={() => openDay(selectedDay)}>
                {selectedCompleted
                  ? `Rever o dia ${selectedDay}`
                  : `Fazer o dia ${selectedDay}`}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Action>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                {selectedCompleted
                  ? "A prática e o diário continuam salvos neste dispositivo e na nuvem."
                  : `Reflexão, exercício, diário e áudio de ${selectedContent.meditationDuration}`}
              </p>
            </div>
          ) : (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-muted">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Abre depois do dia {selectedDay - 1}.
            </p>
          )}
        </Card>
      </motion.div>

      {done > 0 && (
        <Card>
          <CardTitle
            hint={
              <span className="tabular-nums text-ink-muted">
                {done} de {DAY_COUNT}
              </span>
            }
          >
            Humor dos dias concluídos
          </CardTitle>
          <div
            role="img"
            aria-label="Humor registrado em cada dia concluído, do dia 1 ao dia 30"
            className="flex h-16 items-end gap-[3px]"
          >
            {Array.from({ length: DAY_COUNT }, (_, index) => {
              const record = state.days[index + 1];
              const completed = record?.completedAt != null;
              return (
                <div
                  key={index}
                  className="flex h-full flex-1 items-end"
                  aria-hidden
                >
                  <div
                    className={cn(
                      "w-full rounded-t-[3px]",
                      completed ? "bg-brand" : "bg-line"
                    )}
                    style={{
                      height: completed
                        ? `${Math.max((record.mood / 5) * 100, 12)}%`
                        : "6%",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-ink-subtle">
            <span>Dia 1</span>
            <span>Dia {DAY_COUNT}</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Cada barra é um dia concluído, na altura do humor que você
            registrou.
          </p>
        </Card>
      )}
    </Screen>
  );
}
