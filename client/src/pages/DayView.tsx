// OUSE SER VOCÊ – Visualização do Dia
// Design: Clínica Emocional Sofisticada | Exercícios + Check-in + Meditação

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { dailyContent, weekModules } from "@/lib/journeyData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2, ChevronLeft, ChevronRight, Play, Pause, BookOpen, PenLine, Heart } from "lucide-react";
import type { AppPage } from "@/components/AppLayout";
import MeditationPlayer from "@/components/MeditationPlayer";
import ShareInstagramButton from "@/components/ShareInstagramButton";

// Meditation URLs mapping
const meditationUrls: Record<number, string> = {
  1: "/manus-storage/Dia1entenderseumomentoatual_726fb239.mp3",
  2: "/manus-storage/Dia2resgatarsuaidentidade_de7551f9.mp3",
  3: "/manus-storage/Dia3reconhecerhabitosepadroes_797282e1.mp3",
  4: "/manus-storage/Dia4abrirespacoparamudancas_774577c2.mp3",
  5: "/manus-storage/Dia5redescobrirsonhos_22244401.mp3",
  6: "/manus-storage/Dia6cultivargratidao_6faeca2b.mp3",
  7: "/manus-storage/Dia7integracao-olharparasimesma_7115f5d3.mp3",
  8: "/manus-storage/Dia08identificaroquedrenaasuaenergia_ad2bab70.mp3",
  9: "/manus-storage/Dia09ficarnoquerealmenteimporta_be06d38c.mp3",
  30: "/manus-storage/Dia30novocomecoalinhado_a4b26cbb.mp3",
};

const JOURNAL_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663794059331/LaRnsfSwQVxkWuEqKwkmSE/journal-writing-NfZ4kj7jHsTA3NaK7eidFt.webp";

interface DayViewProps {
  onNavigate: (page: AppPage, extra?: unknown) => void;
}

const weekColors = {
  1: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", accent: "#E11D48" },
  2: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", accent: "#D97706" },
  3: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", accent: "#0D9488" },
  4: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", accent: "#7C3AED" },
};

type TabType = "reflexao" | "exercicio" | "diario" | "audio";

export default function DayView({ onNavigate }: DayViewProps) {
  const { state, completeDay, addJournalEntry } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>("reflexao");
  const [mood, setMood] = useState(3);
  const [notes, setNotes] = useState("");
  const [journalAnswers, setJournalAnswers] = useState<Record<string, string>>({});
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [meditationPlaying, setMeditationPlaying] = useState(false);
  const [meditationListened, setMeditationListened] = useState(false);
  const [checkinDone, setCheckinDone] = useState(false);

  const today = dailyContent.find(d => d.day === state.currentDay) || dailyContent[0];
  const isCompleted = state.completedDays.includes(today.day);
  const weekColor = weekColors[today.week as keyof typeof weekColors];
  const currentWeek = weekModules.find(w => w.week === today.week)!;

  const moodLabels = ["", "Muito pesado", "Pesado", "Neutro", "Leve", "Muito leve"];
  const moodEmojis = ["", "😔", "😕", "😐", "🙂", "😊"];

  const handleComplete = () => {
    // Save journal entry if there are answers
    const hasJournalContent = Object.values(journalAnswers).some(v => v.trim());
    if (hasJournalContent) {
      addJournalEntry({
        dayNumber: today.day,
        date: new Date().toDateString(),
        mood,
        text: notes,
        prompts: journalAnswers,
      });
    }

    completeDay(today.day, {
      mood,
      exerciseCompleted,
      meditationListened,
      notes,
    });

    setCheckinDone(true);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "reflexao", label: "Reflexão", icon: <BookOpen className="w-4 h-4" /> },
    { id: "exercicio", label: "Exercício", icon: <Heart className="w-4 h-4" /> },
    { id: "diario", label: "Diário", icon: <PenLine className="w-4 h-4" /> },
    { id: "audio", label: "Áudio", icon: <Play className="w-4 h-4" /> },
  ];

  if (checkinDone || isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-10 h-10 text-[#C4856A]" />
        </motion.div>
        <div>
          <h2 className="font-serif text-2xl text-[#2C1810] mb-2">Dia {today.day} concluído.</h2>
          <p className="text-[#8B6E5A] max-w-sm mx-auto leading-relaxed">
            {today.affirmation}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <ShareInstagramButton
            type="day"
            dayNumber={today.day}
            theme={today.theme}
            mood={mood}
            variant="primary"
          />
          <Button
            onClick={() => onNavigate("home")}
            className="bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl"
          >
            Voltar ao início
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate("journal")}
            className="border-[#E8D5CC] text-[#6B4C3B] rounded-xl hover:bg-[#F5EDE8]"
          >
            Ver meu diário
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      {/* Header */}
      <div>
        <button
          onClick={() => onNavigate("journey")}
          className="flex items-center gap-1 text-sm text-[#B08070] hover:text-[#C4856A] mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Todos os dias
        </button>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${weekColor.bg} border ${weekColor.border} mb-3`}>
          <span className={`text-xs font-medium ${weekColor.text}`}>{currentWeek.subtitle} · {today.theme}</span>
        </div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] leading-tight mb-1">
          {today.title}
        </h1>
        <p className="text-[#8B6E5A] text-sm">{today.subtitle}</p>
      </div>

      {/* Soraya's message */}
      <div className="bg-[#F5EDE8] rounded-2xl p-5 border-l-4 border-[#C4856A]">
        <p className="text-xs text-[#B08070] font-medium mb-2 uppercase tracking-wide">Soraya Farias</p>
        <p className="text-[#4A3728] leading-relaxed text-sm lg:text-base">
          {today.soraiaMessage}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F0E4DC] rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-[#C4856A] shadow-sm"
                : "text-[#8B6E5A] hover:text-[#C4856A]"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "reflexao" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
                <p className="text-[#4A3728] leading-relaxed text-sm lg:text-base">
                  {today.reflection}
                </p>
              </div>
              <div className="bg-[#FAF6F1] rounded-2xl border border-[#F0E4DC] p-5">
                <p className="font-serif text-base italic text-[#6B4C3B] text-center leading-relaxed">
                  "{today.affirmation}"
                </p>
              </div>
            </div>
          )}

          {activeTab === "exercicio" && (
            <div className="bg-white rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <img src={JOURNAL_IMG} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/60 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-white font-serif text-lg">{today.exercise.title}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#8B6E5A] text-sm mb-5 leading-relaxed">{today.exercise.description}</p>
                <div className="space-y-3">
                  {today.exercise.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#F5EDE8] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#C4856A]">{i + 1}</span>
                      </div>
                      <p className="text-[#4A3728] text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setExerciseCompleted(!exerciseCompleted)}
                  className={`mt-6 w-full flex items-center justify-center gap-2 h-11 rounded-xl font-medium text-sm transition-all duration-200 ${
                    exerciseCompleted
                      ? "bg-[#F5EDE8] text-[#C4856A] border border-[#E8D5CC]"
                      : "bg-[#C4856A] text-white hover:bg-[#B07055]"
                  }`}
                >
                  {exerciseCompleted ? (
                    <><CheckCircle2 className="w-4 h-4" /> Exercício concluído</>
                  ) : (
                    "Marcar como concluído"
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "diario" && (
            <div className="space-y-4">
              {today.journalPrompts.map((prompt, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm">
                  <p className="text-[#4A3728] font-medium text-sm mb-3 leading-relaxed">
                    {prompt}
                  </p>
                  <Textarea
                    value={journalAnswers[`p${i}`] || ""}
                    onChange={e => setJournalAnswers(prev => ({ ...prev, [`p${i}`]: e.target.value }))}
                    placeholder="Escreva aqui o que vier..."
                    className="min-h-[100px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm text-[#4A3728] placeholder:text-[#C4B0A4]"
                  />
                </div>
              ))}
              <div className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm">
                <p className="text-[#4A3728] font-medium text-sm mb-3">Anotações livres</p>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Qualquer coisa que queira registrar sobre hoje..."
                  className="min-h-[80px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm text-[#4A3728] placeholder:text-[#C4B0A4]"
                />
              </div>
            </div>
          )}

          {activeTab === "audio" && (
            <MeditationPlayer
              title={today.meditationTitle}
              duration={today.meditationDuration}
              audioUrl={meditationUrls[today.day] || ""}
              dayNumber={today.day}
              onComplete={() => setMeditationListened(true)}
            />
          )}
        </motion.div>
      </div>

      {/* Check-in & Complete */}
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm space-y-5">
        <div>
          <p className="font-semibold text-[#2C1810] mb-1 text-sm">Como você está se sentindo agora?</p>
          <p className="text-xs text-[#8B6E5A] mb-4">Depois de completar as práticas do dia</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{moodEmojis[mood]}</span>
              <span className="text-sm text-[#8B6E5A]">{moodLabels[mood]}</span>
            </div>
            <Slider
              value={[mood]}
              onValueChange={([v]) => setMood(v)}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[#B08070]">
              <span>Muito pesado</span>
              <span>Muito leve</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          className="w-full h-12 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl font-medium text-base transition-all duration-200 active:scale-[0.97] shadow-md shadow-[#C4856A]/20"
        >
          <CheckCircle2 className="mr-2 w-5 h-5" />
          Concluir o Dia {today.day}
        </Button>
      </div>

      {/* Navigation between days */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (today.day > 1) {
              onNavigate("day", today.day - 1);
            }
          }}
          disabled={today.day <= 1}
          className="flex items-center gap-1 text-sm text-[#B08070] hover:text-[#C4856A] disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Dia anterior
        </button>
        <span className="text-xs text-[#B08070]">Dia {today.day} de 30</span>
        <button
          onClick={() => onNavigate("journey")}
          className="flex items-center gap-1 text-sm text-[#B08070] hover:text-[#C4856A] transition-colors"
        >
          Ver jornada
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
