import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ImageDown, Trophy } from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import { writtenDaysOf } from "@/app/state";
import {
  achievements,
  DAY_COUNT,
  daysOfWeek,
  getDay,
  weekProgress,
  type Achievement,
} from "@/journey";
import {
  FINAL_ASSESSMENT_MIN_DAYS,
  finalAssessmentUnlocked,
} from "@/assessments/assessment";
import { SCANNER_QUESTION_COUNT } from "@/assessments/scanner";
import ShareInstagramButton from "@/share/ShareInstagramButton";
import AchievementImageModal from "@/components/AchievementImageModal";
import {
  Action,
  Card,
  EmptyState,
  Pill,
  ProgressRail,
  Screen,
  ScreenHeader,
} from "@/components/ds";

type Destination = "journal" | "scanner" | "assessment";

/** The single next action that moves one locked achievement forward. */
interface NextStep {
  label: string;
  hint: string;
  day?: number;
  page?: Destination;
}

/** What is left, in the achievement's own unit, plus the rule in plain words. */
interface Gap {
  done: number;
  target: number;
  rule: string;
  missing: number;
  unit: string;
  tail: string;
  detail?: string;
  step: NextStep;
}

interface Facts {
  completedDays: number[];
  currentDay: number;
  currentStreak: number;
  journalEntries: number;
  scanner: boolean;
  initialAssessment: boolean;
  finalAssessment: boolean;
}

interface RankedLock {
  achievement: Achievement;
  gap: Gap | null;
  index: number;
}

const countLabel = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;

const dayStep = (day: number): NextStep => ({
  day,
  label: `Fazer o dia ${day}`,
  hint: `${getDay(day).meditationDuration} de áudio · salvo neste dispositivo`,
});

/**
 * Derives the gap to each unlock from data the app already records: completed
 * days, streak, journal entries, scanner and assessments.
 */
function gapFor(achievement: Achievement, facts: Facts): Gap | null {
  const {
    completedDays,
    currentDay,
    currentStreak,
    journalEntries,
    scanner,
    initialAssessment,
    finalAssessment,
  } = facts;

  const weekMatch = /^week-(\d)$/.exec(achievement.id);
  if (weekMatch) {
    const week = Number(weekMatch[1]);
    const progress = weekProgress(week, completedDays);
    const weekDays = daysOfWeek(week);
    const lastDay = weekDays[weekDays.length - 1]?.day ?? DAY_COUNT;
    const firstMissing = weekDays.find(
      item => !completedDays.includes(item.day)
    );
    const dayToOpen = Math.min(firstMissing?.day ?? currentDay, currentDay);
    const missing = progress.total - progress.completed;
    return {
      done: progress.completed,
      target: progress.total,
      rule: `Concluir os ${progress.total} dias da semana ${week}.`,
      missing,
      unit: missing === 1 ? "dia" : "dias",
      tail: `Para fechar a semana ${week}.`,
      detail: `O dia ${lastDay} é o último da semana ${week}.`,
      step: dayStep(dayToOpen),
    };
  }

  const streakMatch = /^streak-(\d+)$/.exec(achievement.id);
  if (streakMatch) {
    const need = Number(streakMatch[1]);
    const done = Math.min(currentStreak, need);
    const missing = need - done;
    return {
      done,
      target: need,
      rule: `Manter ${need} dias seguidos na jornada.`,
      missing,
      unit: missing === 1 ? "dia seguido" : "dias seguidos",
      tail: "Um dia por dia, sem intervalo.",
      detail:
        currentStreak > 0
          ? `Sua sequência está em ${countLabel(currentStreak, "dia", "dias")}.`
          : "A sequência começa quando o dia 1 for concluído.",
      step: dayStep(currentDay),
    };
  }

  const journalMatch = /^journal-(\d+)$/.exec(achievement.id);
  if (journalMatch) {
    const need = Number(journalMatch[1]);
    const done = Math.min(journalEntries, need);
    const missing = need - done;
    return {
      done,
      target: need,
      rule: `Escrever ${need} entradas no diário emocional.`,
      missing,
      unit: missing === 1 ? "entrada" : "entradas",
      tail: "Para escrever no diário emocional.",
      detail: "Uma entrada por dia, no seu ritmo.",
      step: {
        page: "journal",
        label: "Escrever no diário",
        hint: "Uma entrada por dia · salvo neste dispositivo",
      },
    };
  }

  switch (achievement.id) {
    case "first-day": {
      const done = completedDays.includes(1) ? 1 : 0;
      return {
        done,
        target: 1,
        rule: "Concluir o dia 1, do início ao fim.",
        missing: 1 - done,
        unit: "dia",
        tail: "Para o primeiro passo da jornada.",
        detail: "Reflexão, exercício, diário e áudio no mesmo dia.",
        step: dayStep(1),
      };
    }

    case "all-30": {
      const done = completedDays.length;
      const missing = DAY_COUNT - done;
      return {
        done,
        target: DAY_COUNT,
        rule: `Concluir os ${DAY_COUNT} dias da jornada.`,
        missing,
        unit: missing === 1 ? "dia" : "dias",
        tail: `Para os ${DAY_COUNT} dias completos.`,
        step: dayStep(currentDay),
      };
    }

    case "scanner": {
      const done = scanner ? SCANNER_QUESTION_COUNT : 0;
      return {
        done,
        target: SCANNER_QUESTION_COUNT,
        rule: "Responder ao Scanner de Essência.",
        missing: SCANNER_QUESTION_COUNT - done,
        unit: "perguntas",
        tail: "Para o Scanner de Essência.",
        detail:
          "O diagnóstico mostra o seu nível de autoabandono e a área mais crítica.",
        step: {
          page: "scanner",
          label: "Fazer o diagnóstico",
          hint: `${SCANNER_QUESTION_COUNT} perguntas · uma de cada vez`,
        },
      };
    }

    case "assessment": {
      const done = initialAssessment ? 1 : 0;
      return {
        done,
        target: 1,
        rule: "Preencher a avaliação inicial.",
        missing: 1 - done,
        unit: "avaliação",
        tail: "Para registrar o seu ponto de partida.",
        detail: "É o retrato do seu antes, para comparar depois.",
        step: {
          page: "assessment",
          label: "Salvar a avaliação inicial",
          hint: "Respostas curtas · salvo neste dispositivo",
        },
      };
    }

    case "final-assessment": {
      if (!finalAssessmentUnlocked(completedDays)) {
        const missing = FINAL_ASSESSMENT_MIN_DAYS - completedDays.length;
        return {
          done: completedDays.length,
          target: FINAL_ASSESSMENT_MIN_DAYS,
          rule: `Concluir os primeiros ${FINAL_ASSESSMENT_MIN_DAYS} dias da jornada.`,
          missing,
          unit: missing === 1 ? "dia" : "dias",
          tail: "Para a avaliação final abrir.",
          detail: "Ela compara o seu depois com o seu antes.",
          step: dayStep(currentDay),
        };
      }
      const done = finalAssessment ? 1 : 0;
      return {
        done,
        target: 1,
        rule: "Preencher a avaliação final.",
        missing: 1 - done,
        unit: "avaliação",
        tail: "Para registrar a sua chegada.",
        detail: "Ela compara o seu depois com o seu antes.",
        step: {
          page: "assessment",
          label: "Salvar a avaliação final",
          hint: "Respostas curtas · salvo neste dispositivo",
        },
      };
    }

    case "halfway": {
      // The first fifteen days, so a skipped day still counts as a gap.
      const firstHalf = Array.from({ length: 15 }, (_, index) => index + 1);
      const done = firstHalf.filter(day => completedDays.includes(day)).length;
      const missing = firstHalf.length - done;
      const firstMissing = firstHalf.find(day => !completedDays.includes(day));
      return {
        done,
        target: firstHalf.length,
        rule: "Concluir os primeiros 15 dias da jornada.",
        missing,
        unit: missing === 1 ? "dia" : "dias",
        tail: "Para chegar ao dia 15.",
        detail: "O dia 15 marca a metade da jornada.",
        step: dayStep(Math.min(firstMissing ?? currentDay, currentDay)),
      };
    }

    default:
      return null;
  }
}

const shareSubject = (achievement: Achievement) =>
  ({
    kind: "achievement",
    achievement: {
      title: achievement.title,
      description: achievement.description,
    },
  }) as const;

export default function Achievements() {
  const { state, completedDays, currentDay, currentStreak } = useApp();
  const { navigate, openDay } = useNavigation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const unlocked = state.unlockedAchievements;
  const unlockedList = achievements.filter(achievement =>
    unlocked.includes(achievement.id)
  );
  const lockedList = achievements.filter(
    achievement => !unlocked.includes(achievement.id)
  );

  const facts: Facts = {
    completedDays,
    currentDay,
    currentStreak,
    journalEntries: writtenDaysOf(state).length,
    scanner: state.scanner !== null,
    initialAssessment: state.initialAssessment !== null,
    finalAssessment: state.finalAssessment !== null,
  };

  const rankedLocked: RankedLock[] = lockedList.map((achievement, index) => ({
    achievement,
    gap: gapFor(achievement, facts),
    index,
  }));

  // Closest unlock first: goal gradient instead of a wall of equal locks.
  const sortedLocked = [...rankedLocked].sort((a, b) => {
    const ratioA = a.gap && a.gap.target > 0 ? a.gap.done / a.gap.target : -1;
    const ratioB = b.gap && b.gap.target > 0 ? b.gap.done / b.gap.target : -1;
    if (ratioA !== ratioB) return ratioB - ratioA;

    const missingA = a.gap && a.gap.missing > 0 ? a.gap.missing : Infinity;
    const missingB = b.gap && b.gap.missing > 0 ? b.gap.missing : Infinity;
    if (missingA !== missingB) return missingA - missingB;

    return a.index - b.index;
  });

  const nextItem = sortedLocked.find(item => item.gap && item.gap.missing > 0);
  const nextGap = nextItem?.gap ?? null;
  const nextAchievement = nextItem?.achievement ?? null;
  const restLocked = sortedLocked.filter(
    item => item.achievement.id !== nextAchievement?.id
  );

  const isComplete = lockedList.length === 0;
  const lastUnlockedId = unlocked[unlocked.length - 1];
  const latest =
    achievements.find(achievement => achievement.id === lastUnlockedId) ??
    unlockedList[unlockedList.length - 1];
  const olderUnlocked = unlockedList.filter(
    achievement => achievement.id !== latest?.id
  );

  const selected = selectedId
    ? achievements.find(achievement => achievement.id === selectedId)
    : undefined;

  const runStep = (step: NextStep) => {
    if (step.page) navigate(step.page);
    else if (step.day !== undefined) openDay(step.day);
  };

  const fadeUp = (delay = 0) => ({
    initial: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.24,
      ease: "easeOut" as const,
      delay: reduceMotion ? 0 : delay,
    },
  });

  const description = `${unlockedList.length} de ${achievements.length} desbloqueadas.`;

  return (
    <Screen>
      <ScreenHeader
        kicker="O que você já construiu"
        title="Conquistas"
        description={description}
      />

      {nextGap && nextAchievement && (
        <motion.section {...fadeUp()} aria-labelledby="proxima-conquista">
          <Card
            as="div"
            padding="none"
            clip
            className="border-brand/30 bg-brand-wash"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl"
                  aria-hidden
                >
                  {nextAchievement.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h2
                      id="proxima-conquista"
                      className="font-serif text-xl leading-snug text-ink"
                    >
                      {nextAchievement.title}
                    </h2>
                    <Pill tone="warm">Próxima conquista</Pill>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {nextAchievement.description}
                  </p>
                </div>
              </div>

              {nextGap.target > 1 ? (
                <ProgressRail
                  className="mt-5"
                  value={nextGap.done}
                  max={nextGap.target}
                  label={nextGap.rule}
                  valueLabel={`${nextGap.done} de ${nextGap.target}`}
                  ariaLabel={`${nextGap.rule} ${nextGap.done} de ${nextGap.target}`}
                />
              ) : (
                <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                  {nextGap.rule}
                </p>
              )}

              <p className="mt-4 flex items-baseline gap-1.5 font-serif text-ink">
                <span className="tabular-nums text-[30px] leading-none">
                  {nextGap.missing}
                </span>
                <span className="font-sans text-sm font-medium text-ink-soft">
                  {nextGap.unit}
                </span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {nextGap.tail}
              </p>
              {nextGap.detail && (
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  {nextGap.detail}
                </p>
              )}

              <Action
                block
                size="lg"
                className="mt-5 sm:w-auto"
                onClick={() => runStep(nextGap.step)}
                icon={<ArrowRight className="h-4 w-4" aria-hidden />}
              >
                {nextGap.step.label}
              </Action>
              <p className="mt-2 text-center text-xs text-ink-muted sm:text-left">
                {nextGap.step.hint}
              </p>
            </div>
          </Card>
        </motion.section>
      )}

      {isComplete && (
        <motion.section {...fadeUp()} aria-labelledby="jornada-completa">
          <Card as="div" tone="warm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Jornada completa
            </p>
            <h2
              id="jornada-completa"
              className="mt-2 font-serif text-xl leading-snug text-ink"
            >
              Todas as conquistas estão desbloqueadas
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              O registro fica salvo neste dispositivo. Você pode voltar a ele
              quando quiser.
            </p>
            <ProgressRail
              className="mt-4"
              value={achievements.length}
              max={achievements.length}
              label="Conquistas desbloqueadas"
              valueLabel={`${achievements.length} de ${achievements.length}`}
            />
          </Card>
        </motion.section>
      )}

      {latest ? (
        <motion.section {...fadeUp(0.05)} aria-labelledby="ultima-conquista">
          <Card as="div">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Última conquista
              </p>
              <Pill tone="success">Desbloqueada</Pill>
            </div>

            <div className="mt-3 flex items-start gap-3">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-2xl"
                aria-hidden
              >
                {latest.icon}
              </span>
              <div className="min-w-0">
                <h2
                  id="ultima-conquista"
                  className="font-serif text-xl leading-snug text-ink"
                >
                  {latest.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {latest.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ShareInstagramButton
                subject={shareSubject(latest)}
                size="md"
                variant={isComplete ? "primary" : "secondary"}
                label={`Compartilhar a conquista ${latest.title}`}
              />
              <Action
                variant="secondary"
                size="md"
                onClick={() => setSelectedId(latest.id)}
                aria-label={`Gerar imagem da conquista ${latest.title} para Stories`}
                icon={<ImageDown className="h-4 w-4" aria-hidden />}
              >
                Gerar imagem
              </Action>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              Fica salva neste dispositivo, mesmo que você pause a jornada.
            </p>
          </Card>
        </motion.section>
      ) : (
        <motion.section {...fadeUp(0.05)}>
          <EmptyState
            icon={Trophy}
            title="Nenhuma conquista desbloqueada ainda"
            body="As conquistas aparecem aqui conforme você avança e ficam salvas neste dispositivo."
          />
        </motion.section>
      )}

      {restLocked.length > 0 && (
        <motion.section {...fadeUp(0.1)} aria-labelledby="ainda-em-aberto">
          <h2 id="ainda-em-aberto" className="mb-3 font-serif text-lg text-ink">
            Ainda em aberto
          </h2>
          <Card as="div" padding="none" clip>
            <ul className="divide-y divide-line">
              {restLocked.map(({ achievement, gap }) => (
                <li
                  key={achievement.id}
                  className="flex items-start gap-3 px-4 py-3.5 sm:px-5"
                >
                  <span
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-lg"
                    aria-hidden
                  >
                    {achievement.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <p className="text-sm font-medium text-ink-soft">
                        {achievement.title}
                      </p>
                      {gap && gap.missing > 0 && (
                        <Pill>
                          {gap.missing === 1 ? "falta" : "faltam"} {gap.missing}{" "}
                          {gap.unit}
                        </Pill>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                      {gap ? gap.rule : achievement.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </motion.section>
      )}

      {olderUnlocked.length > 0 && (
        <motion.section {...fadeUp(0.15)} aria-labelledby="suas-conquistas">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 id="suas-conquistas" className="font-serif text-lg text-ink">
              Suas conquistas
            </h2>
            <span className="text-xs tabular-nums text-ink-muted">
              {unlockedList.length} de {achievements.length}
            </span>
          </div>
          <Card as="div" padding="none" clip>
            <ul className="divide-y divide-line">
              {olderUnlocked.map(achievement => (
                <li key={achievement.id} className="px-4 py-3.5 sm:px-5">
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg"
                      aria-hidden
                    >
                      {achievement.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">
                        {achievement.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                        {achievement.description}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <ShareInstagramButton
                          subject={shareSubject(achievement)}
                          size="md"
                          variant="secondary"
                          label={`Compartilhar a conquista ${achievement.title}`}
                        />
                        <Action
                          variant="secondary"
                          size="md"
                          onClick={() => setSelectedId(achievement.id)}
                          aria-label={`Gerar imagem da conquista ${achievement.title} para Stories`}
                          icon={<ImageDown className="h-4 w-4" aria-hidden />}
                        >
                          Gerar imagem
                        </Action>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </motion.section>
      )}

      {selected && (
        <AchievementImageModal
          isOpen
          onClose={() => setSelectedId(null)}
          achievement={selected}
        />
      )}
    </Screen>
  );
}
