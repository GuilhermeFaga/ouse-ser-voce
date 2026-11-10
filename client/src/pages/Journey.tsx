import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Circle, Lock } from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import {
  DAY_COUNT,
  daysOfWeek,
  getDay,
  isDayAccessible,
  weekModules,
  weekOfDay,
  weekProgress,
} from "@/journey";
import {
  focusRing,
  Action,
  Card,
  Pill,
  ProgressRail,
  Screen,
  ScreenHeader,
  Stat,
} from "@/components/ds";
import { cn } from "@/lib/utils";

const rise = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: "easeOut" as const },
};

function milestoneText({
  allDone,
  done,
  week,
  missingInWeek,
  weekTotal,
}: {
  allDone: boolean;
  done: number;
  week: number;
  missingInWeek: number;
  weekTotal: number;
}) {
  if (allDone) return "Você pode revisitar qualquer dia.";
  if (done === 0)
    return `${weekTotal} dias fecham a semana 1, a partir de hoje.`;
  if (missingInWeek === 1) return `Falta 1 dia para fechar a semana ${week}.`;
  if (missingInWeek > 1)
    return `Faltam ${missingInWeek} dias para fechar a semana ${week}.`;
  return `Sua próxima semana começa no dia seguinte.`;
}

export default function Journey() {
  const { currentDay, completedDays, progressPercent } = useApp();
  const { openDay } = useNavigation();
  const [expandedWeek, setExpandedWeek] = useState<number>(
    weekOfDay(currentDay).week
  );
  const reduceMotion = useReducedMotion();

  const day = getDay(currentDay);
  const week = weekOfDay(currentDay);
  const done = completedDays.length;
  const allDone = done >= DAY_COUNT;
  const currentWeekProgress = weekProgress(week.week, completedDays);
  const missingInWeek =
    currentWeekProgress.total - currentWeekProgress.completed;
  const milestone = milestoneText({
    allDone,
    done,
    week: week.week,
    missingInWeek,
    weekTotal: currentWeekProgress.total,
  });

  return (
    <Screen>
      <ScreenHeader
        kicker="Onde você está"
        title="Sua jornada"
        description={
          allDone
            ? `Os ${DAY_COUNT} dias estão completos.`
            : `Semana ${week.week} de ${weekModules.length} · ${week.title}`
        }
      />

      {/* Current day: the screen's only primary action and its dominant block. */}
      <motion.section
        {...(reduceMotion ? {} : rise)}
        aria-labelledby="dia-atual"
      >
        <Card
          as="div"
          padding="none"
          clip
          className="border-brand/30 bg-brand-wash"
        >
          <div className={cn("h-1.5 w-full", week.palette.dot)} aria-hidden />
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <Pill tone={allDone ? "success" : "brand"}>
                {allDone ? "Concluído" : "Hoje"}
              </Pill>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {day.theme}
              </span>
            </div>

            <p className="mt-4 flex items-baseline gap-1.5 font-serif text-ink">
              <span className="tabular-nums text-[38px] leading-none sm:text-[42px]">
                {currentDay}
              </span>
              <span className="font-sans text-xs font-medium text-ink-muted">
                de {DAY_COUNT} dias
              </span>
            </p>

            <h2
              id="dia-atual"
              className="mt-3 font-serif text-[23px] leading-[1.2] text-ink sm:text-[27px]"
            >
              {day.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {day.subtitle}
            </p>

            <div className="mt-5">
              <Action
                size="lg"
                block
                onClick={() => openDay(currentDay)}
                className="sm:w-auto"
              >
                {allDone
                  ? `Rever o dia ${currentDay}`
                  : `Fazer o dia ${currentDay}`}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Action>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                {allDone
                  ? "O dia segue salvo, com a prática e o diário que você escreveu."
                  : `Reflexão, exercício, diário e áudio (${day.meditationDuration}) · salvo neste dispositivo`}
              </p>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Progress: the whole 30 days, then each week at a glance. */}
      <motion.div
        {...(reduceMotion ? {} : rise)}
        transition={{ ...rise.transition, delay: 0.05 }}
      >
        <Card>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <Stat
              label="Dias concluídos"
              value={done}
              unit={`de ${DAY_COUNT}`}
            />
            <div className="max-w-[17rem]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                {allDone ? "Sua trilha" : "Próximo marco"}
              </p>
              <p className="mt-1 text-sm leading-snug text-ink-soft">
                {milestone}
              </p>
            </div>
          </div>

          <ProgressRail
            className="mt-4"
            value={progressPercent}
            label="Trilha completa"
          />

          <ul
            className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4"
            aria-label="Progresso por semana"
          >
            {weekModules.map(module => {
              const progress = weekProgress(module.week, completedDays);
              const isCurrentWeek = module.week === week.week;
              const opensOn = daysOfWeek(module.week)[0]?.day ?? DAY_COUNT;
              const isOpen = opensOn <= currentDay;
              return (
                <li key={module.week} className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        module.palette.dot
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "truncate text-[11px] font-semibold uppercase tracking-[0.1em]",
                        isCurrentWeek ? "text-ink" : "text-ink-subtle"
                      )}
                    >
                      Semana {module.week}
                    </span>
                  </div>
                  <p className="mt-1 text-xs tabular-nums text-ink-soft">
                    {isOpen ? (
                      <>
                        {progress.completed} de {progress.total}
                        {isCurrentWeek && !allDone && (
                          <span className="text-ink-muted"> · agora</span>
                        )}
                      </>
                    ) : (
                      <span className="text-ink-muted">
                        abre no dia {opensOn}
                      </span>
                    )}
                  </p>
                  <div
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line"
                    aria-hidden
                  >
                    <div
                      className={cn("h-full rounded-full", module.palette.dot)}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </motion.div>

      {/* Weeks: palettized modules, one disclosure each. */}
      <div className="space-y-3 sm:space-y-4">
        {weekModules.map((module, index) => {
          const weekDays = daysOfWeek(module.week);
          const progress = weekProgress(module.week, completedDays);
          const isExpanded = expandedWeek === module.week;
          const isCurrentWeek = module.week === week.week;
          const opensOn = weekDays[0]?.day ?? DAY_COUNT;
          const isOpen = opensOn <= currentDay;

          return (
            <motion.div
              key={module.week}
              initial={reduceMotion ? false : rise.initial}
              animate={rise.animate}
              transition={{
                duration: 0.25,
                ease: "easeOut",
                delay: 0.08 + index * 0.04,
              }}
            >
              <Card
                as="div"
                padding="none"
                clip
                className={cn(isCurrentWeek && "border-brand/30")}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedWeek(isExpanded ? 0 : module.week)
                    }
                    aria-expanded={isExpanded}
                    aria-controls={`semana-${module.week}`}
                    className={cn(
                      "flex min-h-[44px] w-full items-center gap-3 px-4 py-3.5 text-left transition-colors sm:px-5",
                      focusRing,
                      "focus-visible:ring-inset",
                      module.palette.bg,
                      "hover:bg-white/60"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums text-ink",
                        module.palette.dot
                      )}
                      aria-hidden
                    >
                      {module.week}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-1.5 text-[11px]">
                        <span
                          className={cn(
                            "font-semibold uppercase tracking-[0.12em]",
                            module.palette.text
                          )}
                        >
                          Semana {module.week}
                        </span>
                        <span className="text-ink-faint" aria-hidden>
                          ·
                        </span>
                        <span className="tabular-nums text-ink-muted">
                          {isOpen
                            ? `${progress.completed} de ${progress.total} dias`
                            : `abre no dia ${opensOn}`}
                        </span>
                      </span>
                      <span className="mt-1 block font-serif text-base leading-snug text-ink">
                        {module.title}
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-ink-subtle transition-transform duration-200 motion-reduce:transition-none",
                        isExpanded && "rotate-180"
                      )}
                      aria-hidden
                    />
                  </button>
                </h3>

                <div className="h-1 bg-line" aria-hidden>
                  <div
                    className={cn(
                      "h-full rounded-r-full transition-[width] duration-500",
                      module.palette.dot
                    )}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>

                <div id={`semana-${module.week}`} hidden={!isExpanded}>
                  <div className="border-b border-line bg-surface-soft px-4 py-3 sm:px-5">
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {module.description}
                    </p>
                  </div>

                  <ul className="divide-y divide-line">
                    {weekDays.map(item => {
                      const isCompleted = completedDays.includes(item.day);
                      const isCurrent = item.day === currentDay && !isCompleted;
                      const isAccessible = isDayAccessible(
                        item.day,
                        currentDay
                      );
                      const isLocked = !isAccessible;
                      const iconTone = isCompleted
                        ? cn("border-transparent text-ink", module.palette.dot)
                        : isCurrent
                          ? "border-brand bg-white text-brand-ink"
                          : isLocked
                            ? "border-line bg-white/70 text-ink-faint"
                            : "border-line-strong bg-white text-ink-subtle";

                      return (
                        <li key={item.day}>
                          <button
                            type="button"
                            onClick={() => openDay(item.day)}
                            disabled={isLocked}
                            aria-current={isCurrent ? "step" : undefined}
                            className={cn(
                              "relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors sm:px-5",
                              focusRing,
                              "focus-visible:ring-inset",
                              isCurrent && "bg-brand-wash",
                              isAccessible &&
                                !isCurrent &&
                                "hover:bg-surface-soft",
                              isLocked && "cursor-not-allowed bg-surface/60"
                            )}
                          >
                            {isCurrent && (
                              <span
                                className="absolute inset-y-0 left-0 w-[3px] bg-brand"
                                aria-hidden
                              />
                            )}
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                                iconTone
                              )}
                              aria-hidden
                            >
                              {isCompleted ? (
                                <Check className="h-4 w-4" />
                              ) : isCurrent ? (
                                <span className="h-2 w-2 rounded-full bg-brand" />
                              ) : isLocked ? (
                                <Lock className="h-3.5 w-3.5" />
                              ) : (
                                <Circle className="h-3.5 w-3.5" />
                              )}
                            </span>

                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-ink-muted">
                                <span className="font-semibold">
                                  Dia {item.day}
                                </span>
                                <span className="text-ink-faint" aria-hidden>
                                  ·
                                </span>
                                <span className="truncate">{item.theme}</span>
                                {isCurrent && <Pill tone="brand">Hoje</Pill>}
                              </span>
                              <span
                                className={cn(
                                  "mt-0.5 block text-sm leading-snug",
                                  isLocked ? "text-ink-muted" : "text-ink"
                                )}
                              >
                                {item.title}
                              </span>
                              {isLocked && (
                                <span className="mt-1 block text-[11px] leading-snug text-ink-muted">
                                  Abre após o dia {item.day - 1}.
                                </span>
                              )}
                            </span>

                            {isCurrent && (
                              <ArrowRight
                                className="h-4 w-4 shrink-0 text-brand-ink"
                                aria-hidden
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Screen>
  );
}
