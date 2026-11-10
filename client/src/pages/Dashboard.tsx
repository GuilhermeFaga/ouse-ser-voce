import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Flame,
  Lock,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import {
  achievements,
  DAY_COUNT,
  dailyQuotes,
  getDay,
  weekOfDay,
} from "@/journey";
import { writtenDaysOf } from "@/app/state";
import ShareInstagramButton from "@/share/ShareInstagramButton";
import {
  Action,
  Card,
  CardTitle,
  Pill,
  ProgressRail,
  Screen,
  ScreenHeader,
  Stat,
} from "@/components/ds";

function getGreeting() {
  const hours = new Date().getHours();
  if (hours < 12) return "Bom dia";
  if (hours < 18) return "Boa tarde";
  return "Boa noite";
}

function recentAchievements(unlocked: string[]) {
  return achievements.filter(a => unlocked.includes(a.id)).slice(-3);
}

export default function Dashboard() {
  const { state, completedDays, currentDay, currentStreak, progressPercent } =
    useApp();
  const { navigate, openDay } = useNavigation();
  const { scanner, unlockedAchievements } = state;
  const reduceMotion = useReducedMotion();

  const day = getDay(currentDay);
  const week = weekOfDay(currentDay);
  const nextDay = currentDay < DAY_COUNT ? getDay(currentDay + 1) : null;
  const quote = dailyQuotes[(currentDay - 1) % dailyQuotes.length];
  const todayCompleted = completedDays.includes(currentDay);
  const allDone = completedDays.length >= DAY_COUNT;
  const unlocked = unlockedAchievements;
  const journalCount = writtenDaysOf(state).length;
  const remaining = DAY_COUNT - completedDays.length;
  const recent = recentAchievements(unlocked);
  const nextAchievement = achievements.find(a => !unlocked.includes(a.id));
  const greeting = getGreeting();
  const name = state.userName.trim();

  const headline = allDone
    ? "A jornada de 30 dias está completa."
    : `Hoje é o dia ${currentDay}.`;

  const description = allDone
    ? "Você pode reler qualquer dia, voltar ao diário e compartilhar o que construiu."
    : `A prática de hoje tem quatro partes: reflexão, exercício, diário e áudio de ${day.meditationDuration}.`;

  const streakHint = allDone
    ? "Você fechou a jornada sem perder o fio."
    : currentStreak === 0
      ? "O dia 1 abre a sua sequência."
      : currentStreak === 1
        ? `Concluir o dia ${currentDay} soma o segundo dia.`
        : `Concluir o dia ${currentDay} mantém os seus ${currentStreak} dias.`;

  const fadeUp = (delay = 0) => ({
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
        kicker={name ? `${greeting}, ${name}` : greeting}
        title={headline}
        description={description}
        size="display"
      />

      <motion.div {...fadeUp()}>
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <Stat
              label="Você está no dia"
              value={currentDay}
              unit={`de ${DAY_COUNT}`}
              hint={
                allDone
                  ? "Os 30 dias concluídos continuam guardados."
                  : remaining === 1
                    ? "1 dia pela frente"
                    : `${remaining} dias pela frente`
              }
              emphasis
            />
            <div className="shrink-0">
              <ShareInstagramButton
                subject={{ kind: "progress", completedDays }}
                size="lg"
                variant="secondary"
              />
            </div>
          </div>

          <ProgressRail
            className="mt-5"
            value={progressPercent}
            label="Dias concluídos"
            valueLabel={`${completedDays.length} de ${DAY_COUNT}`}
          />

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-sm">
            <span className="inline-flex items-center gap-1.5 text-ink">
              <Flame className="h-4 w-4 text-brand-ink" aria-hidden />
              <span className="font-semibold tabular-nums">
                {currentStreak}
              </span>
              <span>
                {currentStreak === 1 ? "dia seguido" : "dias seguidos"}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-muted">
              <BookOpen className="h-4 w-4 text-ink-subtle" aria-hidden />
              <span className="tabular-nums">{journalCount}</span>
              {journalCount === 1 ? "entrada no diário" : "entradas no diário"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-muted">
              <Trophy className="h-4 w-4 text-ink-subtle" aria-hidden />
              <span className="tabular-nums">{unlocked.length}</span>
              {unlocked.length === 1 ? "conquista" : "conquistas"}
            </span>
          </div>
          <p className="mt-2 text-xs text-ink-muted">{streakHint}</p>
        </Card>
      </motion.div>

      <motion.div {...fadeUp(0.05)}>
        <Card padding="none" clip>
          <div
            className={`flex items-center gap-2 border-b px-5 py-3 sm:px-6 ${week.palette.bg} ${week.palette.border}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${week.palette.dot}`}
              aria-hidden
            />
            <p className={`text-xs font-medium ${week.palette.text}`}>
              {week.subtitle} · {week.shortTitle}
            </p>
            <div className="ml-auto">
              {todayCompleted ? (
                <Pill tone="success">Concluído</Pill>
              ) : (
                <Pill tone="neutral">Hoje</Pill>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
              Dia {currentDay} · {day.theme}
            </p>
            <h2 className="mt-2 font-serif text-xl leading-snug text-ink sm:text-2xl">
              {day.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
              {day.soraiaMessage}
            </p>

            <Action
              block
              size="lg"
              className="mt-5"
              onClick={() => openDay(currentDay)}
              icon={
                <ArrowRight className="h-4 w-4" aria-hidden strokeWidth={2} />
              }
            >
              {allDone
                ? `Revisar o dia ${DAY_COUNT}`
                : completedDays.length === 0
                  ? `Começar o dia ${currentDay}`
                  : `Continuar o dia ${currentDay}`}
            </Action>
            <p className="mt-2 text-center text-xs text-ink-muted">
              {allDone
                ? "Tudo continua salvo neste dispositivo e na nuvem"
                : `Começa pela reflexão · áudio de ${day.meditationDuration} · salvo neste dispositivo e na nuvem`}
            </p>
          </div>
        </Card>
      </motion.div>

      {nextDay && (
        <motion.div {...fadeUp(0.1)}>
          <Card padding="sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  Amanhã
                </p>
                <p className="mt-1 text-sm font-medium text-ink">
                  Dia {nextDay.day} · {nextDay.theme}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Abre quando você concluir o dia {currentDay}.
                </p>
              </div>
              <Lock
                className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint"
                aria-hidden
              />
            </div>
          </Card>
        </motion.div>
      )}

      {!scanner && (
        <motion.div {...fadeUp(0.15)}>
          <Card tone="warm">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              <Sparkles
                className="h-4 w-4 shrink-0 text-brand-ink"
                aria-hidden
              />
              Diagnóstico de essência
            </p>
            <h2 className="mt-2 font-serif text-lg text-ink">
              Scanner de Essência
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              Descubra seu nível de autoabandono e a área mais crítica para
              trabalhar agora.
            </p>
            <Action
              variant="secondary"
              className="mt-4"
              onClick={() => navigate("scanner")}
            >
              Fazer o diagnóstico
            </Action>
          </Card>
        </motion.div>
      )}

      <motion.div {...fadeUp(0.2)}>
        <Card>
          <CardTitle
            hint={
              <Action
                variant="quiet"
                size="md"
                className="px-0"
                aria-label="Ver todas as conquistas"
                onClick={() => navigate("achievements")}
              >
                Ver todas
              </Action>
            }
          >
            Conquistas
          </CardTitle>

          {recent.length > 0 ? (
            <ul className="space-y-3">
              {recent.map(achievement => (
                <li key={achievement.id} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-base"
                    aria-hidden
                  >
                    {achievement.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">
                      {achievement.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                      {achievement.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : nextAchievement ? (
            <div className="rounded-xl border border-dashed border-line-strong bg-brand-wash p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Próxima conquista
              </p>
              <div className="mt-2 flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-soft text-base"
                  aria-hidden
                >
                  {nextAchievement.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {nextAchievement.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                    {nextAchievement.description}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      </motion.div>

      <motion.div {...fadeUp(0.25)}>
        <Card tone="warm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Frase do dia
          </p>
          <blockquote className="mt-2 font-serif text-base leading-relaxed text-ink sm:text-lg">
            “{quote}”
          </blockquote>
          <p className="mt-2 text-xs text-ink-muted">Soraya Farias</p>
        </Card>
      </motion.div>
    </Screen>
  );
}
