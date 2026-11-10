import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/app/store";
import {
  SCANNER_AREAS,
  SCANNER_QUESTION_COUNT,
  scannerQuestions,
  scoreScanner,
  type ScannerSeverity,
} from "@/assessments/scanner";

const SEVERITY_TONE: Record<
  ScannerSeverity,
  { surface: string; text: string; bar: string }
> = {
  high: {
    surface: "bg-red-50 border-red-200",
    text: "text-red-600",
    bar: "bg-red-400",
  },
  moderate: {
    surface: "bg-amber-50 border-amber-200",
    text: "text-amber-600",
    bar: "bg-amber-400",
  },
  low: {
    surface: "bg-green-50 border-green-200",
    text: "text-green-600",
    bar: "bg-green-400",
  },
};
import { formatLongDate } from "@/lib/dates";

type Mode = "intro" | "quiz" | "results";

export default function Scanner() {
  const { state, saveScanner } = useApp();
  const [mode, setMode] = useState<Mode>(state.scanner ? "results" : "intro");
  const [answers, setAnswers] = useState<Record<string, number>>(
    state.scanner?.answers ?? {}
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);

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
    const progress = (currentQuestion / SCANNER_QUESTION_COUNT) * 100;

    const handleAnswer = (questionId: string, value: number) => {
      const nextAnswers = { ...answers, [questionId]: value };
      setAnswers(nextAnswers);
      if (currentQuestion < SCANNER_QUESTION_COUNT - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        saveScanner(nextAnswers);
        setMode("results");
      }
    };

    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#B08070] font-medium">
              {currentQuestion + 1} de {SCANNER_QUESTION_COUNT}
            </span>
            <span className="text-xs text-[#B08070]">
              {SCANNER_AREAS.find(area => area.id === question.area)?.label}
            </span>
          </div>
          <div className="h-1.5 bg-[#F0E4DC] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#C4856A] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          <AreaBadge areaId={question.area} />
          <h2 className="font-serif text-xl lg:text-2xl text-[#2C1810] leading-snug">
            {question.question}
          </h2>
          <div className="space-y-2">
            {question.options.map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
                  answers[question.id] === option.value
                    ? "border-[#C4856A] bg-[#F5EDE8] text-[#4A3728]"
                    : "border-[#F0E4DC] bg-white hover:border-[#E8D5CC] hover:bg-[#FAF6F1] text-[#4A3728]"
                }`}
              >
                <p className="text-sm leading-relaxed">{option.label}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
          Scanner de Essência
        </h1>
        <p className="text-[#8B6E5A] text-sm">
          Diagnóstico emocional personalizado
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#F5EDE8] to-[#FAF6F1] rounded-2xl border border-[#E8D5CC] p-6">
        <div className="w-12 h-12 rounded-xl bg-[#C4856A]/10 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-[#C4856A]" />
        </div>
        <h2 className="font-serif text-xl text-[#2C1810] mb-3">
          O que é o Scanner de Essência?
        </h2>
        <p className="text-[#6B4C3B] text-sm leading-relaxed mb-4">
          Um diagnóstico de {SCANNER_QUESTION_COUNT} perguntas que avalia{" "}
          {SCANNER_AREAS.length} áreas fundamentais da sua vida:{" "}
          {SCANNER_AREAS.map(area => area.label.toLowerCase()).join(", ")}.
        </p>
        <p className="text-[#6B4C3B] text-sm leading-relaxed mb-6">
          Ao final, você recebe um diagnóstico personalizado com seu nível de
          autoabandono, a área mais crítica e uma recomendação prática imediata.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {SCANNER_AREAS.map(area => (
            <div
              key={area.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl ${area.palette.bg}`}
            >
              <div className={`w-2 h-2 rounded-full ${area.palette.dot}`} />
              <span className={`text-xs font-medium ${area.palette.text}`}>
                {area.label}
              </span>
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            setAnswers({});
            setCurrentQuestion(0);
            setMode("quiz");
          }}
          className="w-full h-12 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl font-medium"
        >
          Iniciar diagnóstico
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      {state.scanner && (
        <div className="text-center">
          <button
            onClick={() => setMode("results")}
            className="text-sm text-[#C4856A] font-medium hover:underline"
          >
            Ver meu diagnóstico anterior
          </button>
        </div>
      )}
    </div>
  );
}

function AreaBadge({ areaId }: { areaId: string }) {
  const area = SCANNER_AREAS.find(item => item.id === areaId);
  if (!area) return null;
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${area.palette.bg}`}
    >
      <div className={`w-2 h-2 rounded-full ${area.palette.dot}`} />
      <span className={`text-xs font-medium ${area.palette.text}`}>
        {area.label}
      </span>
    </div>
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
  const diagnosis = scoreScanner(answers);
  const { criticalArea } = diagnosis;
  const tone = SEVERITY_TONE[diagnosis.severity];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
          Seu Diagnóstico
        </h1>
        <p className="text-[#8B6E5A] text-sm">{formatLongDate(completedAt)}</p>
      </div>

      <div className={`rounded-2xl border p-6 ${tone.surface}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className={`w-6 h-6 ${tone.text}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-[#8B6E5A] uppercase tracking-wide mb-1">
              Nível de Autoabandono
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`font-serif text-4xl font-bold ${tone.text}`}>
                {diagnosis.abandonmentLevel}%
              </span>
              <span className={`font-semibold ${tone.text}`}>
                {diagnosis.abandonmentLabel}
              </span>
            </div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${tone.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${diagnosis.abandonmentLevel}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
        <h3 className="font-semibold text-[#2C1810] mb-4">
          Pontuação por área
        </h3>
        <div className="space-y-4">
          {SCANNER_AREAS.map(area => {
            const percent = diagnosis.percentages[area.id] ?? 0;
            return (
              <div key={area.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${area.palette.dot}`}
                    />
                    <span className="text-sm text-[#4A3728] font-medium">
                      {area.label}
                    </span>
                    {area.id === criticalArea.id && (
                      <span className="text-[10px] bg-[#C4856A] text-white px-2 py-0.5 rounded-full">
                        Crítica
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-[#2C1810]">
                    {percent}%
                  </span>
                </div>
                <div className="h-2 bg-[#F0E4DC] rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${area.palette.dot}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`rounded-2xl border p-6 ${criticalArea.palette.bg} ${criticalArea.palette.border}`}
      >
        <p className="text-xs font-medium text-[#8B6E5A] uppercase tracking-wide mb-2">
          Área mais crítica
        </p>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${criticalArea.palette.dot}`} />
          <h3
            className={`font-serif text-xl font-bold ${criticalArea.palette.text}`}
          >
            {criticalArea.label}
          </h3>
        </div>
        <p className="text-sm text-[#4A3728] leading-relaxed">
          {diagnosis.explanation}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
        <p className="text-xs font-medium text-[#B08070] uppercase tracking-wide mb-2">
          Recomendação prática imediata
        </p>
        <p className="text-[#4A3728] leading-relaxed text-sm">
          {diagnosis.recommendation}
        </p>
      </div>

      <button
        onClick={onRestart}
        className="flex items-center gap-2 text-sm text-[#B08070] hover:text-[#C4856A] transition-colors mx-auto"
      >
        <RotateCcw className="w-4 h-4" />
        Refazer o diagnóstico
      </button>
    </div>
  );
}
