import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, RotateCcw, Sparkles } from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import { getDay } from "@/journey";
import { formatLongDate } from "@/lib/dates";
import {
  SCANNER_AREAS,
  SCANNER_QUESTION_COUNT,
  scannerQuestions,
  scoreScanner,
  type ScannerArea,
  type ScannerSeverity,
} from "@/assessments/scanner";
import {
  Action,
  Card,
  Pill,
  ProgressRail,
  Screen,
  ScreenHeader,
  Stat,
  focusRing,
} from "@/components/ds";

/**
 * One severity signal per diagnosis: a tone and a plain-language reading.
 * The percentage stays in the page's single hero number, not five times over.
 */
const SEVERITY_SIGNAL: Record<
  ScannerSeverity,
  { tone: "danger" | "warning" | "success"; reading: string }
> = {
  high: {
    tone: "danger",
    reading:
      "Suas respostas mostram você em último lugar na maior parte das áreas.",
  },
  moderate: {
    tone: "warning",
    reading: "Você aparece em algumas áreas e recua em outras.",
  },
  low: {
    tone: "success",
    reading: "Você já se coloca em primeiro lugar em parte da sua vida.",
  },
};

type Mode = "intro" | "quiz" | "results";

export default function Scanner() {
  const { state, saveScanner } = useApp();
  const [mode, setMode] = useState<Mode>(state.scanner ? "results" : "intro");
  const [answers, setAnswers] = useState<Record<string, number>>(
    state.scanner?.answers ?? {}
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const reduceMotion = useReducedMotion();

  const startQuiz = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setMode("quiz");
  };

  if (mode === "results" && state.scanner) {
    return (
      <ScannerResults
        answers={state.scanner.answers}
        completedAt={state.scanner.completedAt}
        onRestart={() => {
          setAnswers({});
          setCurrentQuestion(0);
          setMode("intro");
        }}
      />
    );
  }

  if (mode === "quiz") {
    const question = scannerQuestions[currentQuestion];
    const area =
      SCANNER_AREAS.find(item => item.id === question.area) ?? SCANNER_AREAS[0];
    const isLastQuestion = currentQuestion === SCANNER_QUESTION_COUNT - 1;

    const handleAnswer = (questionId: string, value: number) => {
      const nextAnswers = { ...answers, [questionId]: value };
      setAnswers(nextAnswers);
      if (!isLastQuestion) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        saveScanner(nextAnswers);
        setMode("results");
      }
    };

    return (
      <Screen>
        <p aria-live="polite" className="sr-only">
          {`Pergunta ${currentQuestion + 1} de ${SCANNER_QUESTION_COUNT}: ${area.label}`}
        </p>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-medium tabular-nums text-ink-muted">
              Pergunta {currentQuestion + 1} de {SCANNER_QUESTION_COUNT}
            </p>
            <AreaBadge area={area} />
          </div>
          <ProgressRail
            value={currentQuestion + 1}
            max={SCANNER_QUESTION_COUNT}
            size="sm"
            ariaLabel={`Pergunta ${currentQuestion + 1} de ${SCANNER_QUESTION_COUNT}`}
          />
        </div>

        <motion.div
          key={question.id}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Card>
            <h2
              id={`scanner-question-${question.id}`}
              className="font-serif text-xl leading-snug text-ink sm:text-[24px]"
            >
              {question.question}
            </h2>
            {isLastQuestion && (
              <p className="mt-1.5 text-xs text-ink-muted">
                Última pergunta · o seu diagnóstico vem em seguida
              </p>
            )}

            <div
              role="group"
              aria-labelledby={`scanner-question-${question.id}`}
              className="mt-4 space-y-2"
            >
              {question.options.map(option => {
                const selected = answers[question.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`flex min-h-[56px] w-full items-center rounded-xl border px-4 py-3.5 text-left text-sm leading-relaxed transition-colors ${focusRing} ${
                      selected
                        ? "border-brand bg-brand-soft text-ink"
                        : "border-line bg-white text-ink-soft hover:border-line-strong hover:bg-surface-soft"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {currentQuestion > 0 && (
          <div className="flex justify-center">
            <Action
              variant="quiet"
              size="md"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              icon={
                <ChevronLeft className="h-4 w-4" aria-hidden strokeWidth={2} />
              }
            >
              Pergunta anterior
            </Action>
          </div>
        )}
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        kicker="Diagnóstico de essência"
        title="Scanner de Essência"
      />

      <Card tone="warm">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          <Sparkles className="h-4 w-4 shrink-0 text-brand-ink" aria-hidden />
          {SCANNER_QUESTION_COUNT} perguntas · {SCANNER_AREAS.length} áreas
        </p>

        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Um diagnóstico de {SCANNER_QUESTION_COUNT} perguntas que avalia{" "}
          {SCANNER_AREAS.length} áreas fundamentais da sua vida:{" "}
          {SCANNER_AREAS.map(area => area.label.toLowerCase()).join(", ")}.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Ao final, você recebe um diagnóstico personalizado com seu nível de
          autoabandono, a área mais crítica e uma recomendação prática imediata.
        </p>

        <Action
          block
          size="lg"
          className="mt-5"
          onClick={startQuiz}
          icon={<ArrowRight className="h-4 w-4" aria-hidden strokeWidth={2} />}
        >
          Iniciar diagnóstico
        </Action>
        <p className="mt-2 text-center text-xs text-ink-muted">
          Uma pergunta por tela · sem tempo limite · resultado no fim
        </p>
      </Card>

      {state.scanner && (
        <div className="flex justify-center">
          <Action variant="quiet" size="md" onClick={() => setMode("results")}>
            Ver meu diagnóstico anterior
          </Action>
        </div>
      )}
    </Screen>
  );
}

function AreaBadge({ area }: { area: ScannerArea }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${area.palette.bg} ${area.palette.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${area.palette.dot}`}
        aria-hidden
      />
      {area.label}
    </span>
  );
}

function ScannerResults({
  answers,
  completedAt,
  onRestart,
}: {
  answers: Record<string, number>;
  completedAt: string;
  onRestart: () => void;
}) {
  const { completedDays, currentDay } = useApp();
  const { openDay } = useNavigation();
  const reduceMotion = useReducedMotion();
  const diagnosis = scoreScanner(answers);
  const { criticalArea } = diagnosis;
  const signal = SEVERITY_SIGNAL[diagnosis.severity];
  const day = getDay(currentDay);
  const hasStarted = completedDays.length > 0;

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
        kicker="Diagnóstico de essência"
        title={`Sua prioridade agora é ${criticalArea.label}.`}
        description={signal.reading}
      />

      <motion.div {...fadeUp()}>
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <Stat
              label="Nível de autoabandono"
              value={diagnosis.abandonmentLevel}
              unit="%"
              hint={`calculado com as suas ${SCANNER_QUESTION_COUNT} respostas`}
              emphasis
            />
            <Pill tone={signal.tone}>{diagnosis.abandonmentLabel}</Pill>
          </div>
        </Card>
      </motion.div>

      <motion.div {...fadeUp(0.06)}>
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Recomendação prática imediata
          </p>
          <p className="mt-2 text-base leading-relaxed text-ink">
            {diagnosis.recommendation}
          </p>

          <div className="mt-4 rounded-xl border border-line bg-surface-soft p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Por que esta área
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {diagnosis.explanation}
            </p>
          </div>

          <Action
            block
            size="lg"
            className="mt-5"
            onClick={() => openDay(currentDay)}
            icon={
              <ArrowRight className="h-4 w-4" aria-hidden strokeWidth={2} />
            }
          >
            {hasStarted ? `Voltar ao dia ${currentDay}` : "Fazer o dia 1"}
          </Action>
          <p className="mt-2 text-center text-xs text-ink-muted">
            {`Dia ${currentDay} · ${day.theme} · salvo neste dispositivo`}
          </p>
        </Card>
      </motion.div>

      <div className="flex flex-col items-center gap-1.5">
        <Action
          variant="quiet"
          size="md"
          onClick={onRestart}
          icon={<RotateCcw className="h-4 w-4" aria-hidden strokeWidth={2} />}
        >
          Refazer o diagnóstico
        </Action>
        <p className="text-xs text-ink-muted">
          {`Concluído em ${formatLongDate(completedAt)}`}
        </p>
      </div>
    </Screen>
  );
}
