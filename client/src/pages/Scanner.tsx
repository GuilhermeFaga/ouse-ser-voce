// OUSE SER VOCÊ – Scanner de Essência
// Design: Diagnóstico emocional personalizado

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { scannerQuestions, calculateScannerResults } from "@/lib/journeyData";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, RotateCcw, AlertTriangle } from "lucide-react";

const areaLabels: Record<string, string> = {
  identidade: "Identidade",
  emocional: "Equilíbrio Emocional",
  autocuidado: "Autocuidado",
  relacionamentos: "Relacionamentos",
  proposito: "Propósito",
};

const areaColors: Record<string, string> = {
  identidade: "bg-rose-400",
  emocional: "bg-amber-400",
  autocuidado: "bg-teal-400",
  relacionamentos: "bg-blue-400",
  proposito: "bg-purple-400",
};

const areaTextColors: Record<string, string> = {
  identidade: "text-rose-700",
  emocional: "text-amber-700",
  autocuidado: "text-teal-700",
  relacionamentos: "text-blue-700",
  proposito: "text-purple-700",
};

const areaBgColors: Record<string, string> = {
  identidade: "bg-rose-50",
  emocional: "bg-amber-50",
  autocuidado: "bg-teal-50",
  relacionamentos: "bg-blue-50",
  proposito: "bg-purple-50",
};

export default function Scanner() {
  const { state, saveScannerResult } = useApp();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(!!state.scannerResult);

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQ < scannerQuestions.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 300);
    } else {
      // All answered
      const results = calculateScannerResults(newAnswers);
      saveScannerResult({ ...results, answers: newAnswers });
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentQ(0);
    setAnswers({});
    setShowResults(false);
  };

  const results = state.scannerResult;

  if (showResults && results) {
    return <ScannerResults results={results} onRestart={handleRestart} />;
  }

  if (!started) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">Scanner de Essência</h1>
          <p className="text-[#8B6E5A] text-sm">Diagnóstico emocional personalizado</p>
        </div>

        <div className="bg-gradient-to-br from-[#F5EDE8] to-[#FAF6F1] rounded-2xl border border-[#E8D5CC] p-6">
          <div className="w-12 h-12 rounded-xl bg-[#C4856A]/10 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-[#C4856A]" />
          </div>
          <h2 className="font-serif text-xl text-[#2C1810] mb-3">O que é o Scanner de Essência?</h2>
          <p className="text-[#6B4C3B] text-sm leading-relaxed mb-4">
            Um diagnóstico de 10 perguntas que avalia 5 áreas fundamentais da sua vida: identidade, equilíbrio emocional, autocuidado, relacionamentos e propósito.
          </p>
          <p className="text-[#6B4C3B] text-sm leading-relaxed mb-6">
            Ao final, você recebe um diagnóstico personalizado com seu nível de autoabandono, a área mais crítica e uma recomendação prática imediata.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(areaLabels).map(([key, label]) => (
              <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${areaBgColors[key]}`}>
                <div className={`w-2 h-2 rounded-full ${areaColors[key]}`} />
                <span className={`text-xs font-medium ${areaTextColors[key]}`}>{label}</span>
              </div>
            ))}
          </div>
          <Button
            onClick={() => setStarted(true)}
            className="w-full h-12 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl font-medium"
          >
            Iniciar diagnóstico
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {state.scannerResult && (
          <div className="text-center">
            <button
              onClick={() => setShowResults(true)}
              className="text-sm text-[#C4856A] font-medium hover:underline"
            >
              Ver meu diagnóstico anterior
            </button>
          </div>
        )}
      </div>
    );
  }

  const question = scannerQuestions[currentQ];
  const progress = ((currentQ) / scannerQuestions.length) * 100;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#B08070] font-medium">
            {currentQ + 1} de {scannerQuestions.length}
          </span>
          <span className="text-xs text-[#B08070]">{areaLabels[question.area]}</span>
        </div>
        <div className="h-1.5 bg-[#F0E4DC] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#C4856A] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div>
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${areaBgColors[question.area]}`}>
            <div className={`w-2 h-2 rounded-full ${areaColors[question.area]}`} />
            <span className={`text-xs font-medium ${areaTextColors[question.area]}`}>
              {areaLabels[question.area]}
            </span>
          </div>

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
    </div>
  );
}

function ScannerResults({ results, onRestart }: { results: NonNullable<ReturnType<typeof useApp>["state"]["scannerResult"]>; onRestart: () => void }) {
  const abandonmentColor =
    results.abandonmentLevel > 60 ? "text-red-600" :
    results.abandonmentLevel > 30 ? "text-amber-600" :
    "text-green-600";

  const abandonmentBg =
    results.abandonmentLevel > 60 ? "bg-red-50 border-red-200" :
    results.abandonmentLevel > 30 ? "bg-amber-50 border-amber-200" :
    "bg-green-50 border-green-200";

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">Seu Diagnóstico</h1>
        <p className="text-[#8B6E5A] text-sm">
          {new Date(results.completedAt).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Abandonment Level */}
      <div className={`rounded-2xl border p-6 ${abandonmentBg}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className={`w-6 h-6 ${abandonmentColor}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-[#8B6E5A] uppercase tracking-wide mb-1">Nível de Autoabandono</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`font-serif text-4xl font-bold ${abandonmentColor}`}>
                {results.abandonmentLevel}%
              </span>
              <span className={`font-semibold ${abandonmentColor}`}>{results.abandonmentLabel}</span>
            </div>
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  results.abandonmentLevel > 60 ? "bg-red-400" :
                  results.abandonmentLevel > 30 ? "bg-amber-400" : "bg-green-400"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${results.abandonmentLevel}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Area Scores */}
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
        <h3 className="font-semibold text-[#2C1810] mb-4">Pontuação por área</h3>
        <div className="space-y-4">
          {Object.entries(results.percentages).map(([area, pct]) => (
            <div key={area}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${areaColors[area]}`} />
                  <span className="text-sm text-[#4A3728] font-medium">{areaLabels[area]}</span>
                  {area === results.criticalArea && (
                    <span className="text-[10px] bg-[#C4856A] text-white px-2 py-0.5 rounded-full">Crítica</span>
                  )}
                </div>
                <span className="text-sm font-bold text-[#2C1810]">{pct}%</span>
              </div>
              <div className="h-2 bg-[#F0E4DC] rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${areaColors[area]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Area */}
      <div className={`rounded-2xl border p-6 ${areaBgColors[results.criticalArea]}`}>
        <p className="text-xs font-medium text-[#8B6E5A] uppercase tracking-wide mb-2">Área mais crítica</p>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${areaColors[results.criticalArea]}`} />
          <h3 className={`font-serif text-xl font-bold ${areaTextColors[results.criticalArea]}`}>
            {results.criticalAreaName}
          </h3>
        </div>
        <p className="text-sm text-[#4A3728] leading-relaxed">{results.explanation}</p>
      </div>

      {/* Recommendation */}
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
        <p className="text-xs font-medium text-[#B08070] uppercase tracking-wide mb-2">Recomendação prática imediata</p>
        <p className="text-[#4A3728] leading-relaxed text-sm">{results.recommendation}</p>
      </div>

      {/* Restart */}
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
