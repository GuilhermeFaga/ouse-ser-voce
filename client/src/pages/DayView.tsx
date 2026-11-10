import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  PenLine,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import { IMAGES } from "@/app/assets";
import MeditationPlayer from "@/components/MeditationPlayer";
import ShareInstagramButton from "@/share/ShareInstagramButton";
import {
  DAY_COUNT,
  MOOD_MAX,
  MOOD_MIN,
  MOOD_SCALE,
  getDay,
  moodEmoji,
  moodLabel,
  weekOfDay,
} from "@/journey";
import { formatLongDate } from "@/lib/dates";

type TabType = "reflexao" | "exercicio" | "diario" | "audio";

const TABS: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "reflexao", label: "Reflexão", icon: <BookOpen className="w-4 h-4" /> },
  { id: "exercicio", label: "Exercício", icon: <Heart className="w-4 h-4" /> },
  { id: "diario", label: "Diário", icon: <PenLine className="w-4 h-4" /> },
  { id: "audio", label: "Áudio", icon: <Play className="w-4 h-4" /> },
];

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
  const { state, currentDay, completeDay, saveDay } = useApp();
  const { navigate, openDay } = useNavigation();
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);

  const day = getDay(dayNumber);
  const week = weekOfDay(dayNumber);
  const record = state.days[dayNumber];
  const isCompleted = record?.completedAt != null;
  const mood = record?.mood ?? 3;
  const notes = record?.notes ?? "";
  const prompts = record?.prompts ?? {};

  const handleComplete = () => {
    completeDay(dayNumber, {});
    setIsFirstCompletion(true);
    setShowCelebration(true);
  };

  if (showCelebration) {
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
          <h2 className="font-serif text-2xl text-[#2C1810] mb-2">
            Dia {day.day} concluído.
          </h2>
          <p className="text-[#8B6E5A] max-w-sm mx-auto leading-relaxed">
            {day.affirmation}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <ShareInstagramButton
            subject={{ kind: "day", day: day.day, mood }}
            variant="primary"
          />
          <Button
            onClick={() => setShowCelebration(false)}
            className="bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl"
          >
            Voltar ao conteúdo
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(isFirstCompletion ? "journal" : "home")}
            className="border-[#E8D5CC] text-[#6B4C3B] rounded-xl hover:bg-[#F5EDE8]"
          >
            {isFirstCompletion ? "Ver meu diário" : "Voltar ao início"}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div>
        <button
          onClick={() => navigate("journey")}
          className="flex items-center gap-1 text-sm text-[#B08070] hover:text-[#C4856A] mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Todos os dias
        </button>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${week.palette.bg} border ${week.palette.border} mb-3`}
        >
          <span className={`text-xs font-medium ${week.palette.text}`}>
            {week.subtitle} · {day.theme}
          </span>
        </div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] leading-tight mb-1">
          {day.title}
        </h1>
        <p className="text-[#8B6E5A] text-sm">{day.subtitle}</p>
      </div>

      <div className="bg-[#F5EDE8] rounded-2xl p-5 border-l-4 border-[#C4856A]">
        <p className="text-xs text-[#B08070] font-medium mb-2 uppercase tracking-wide">
          Soraya Farias
        </p>
        <p className="text-[#4A3728] leading-relaxed text-sm lg:text-base">
          {day.soraiaMessage}
        </p>
      </div>

      <div className="flex gap-1 bg-[#F0E4DC] rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {activeTab === "reflexao" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
              <p className="text-[#4A3728] leading-relaxed text-sm lg:text-base">
                {day.reflection}
              </p>
            </div>
            <div className="bg-[#FAF6F1] rounded-2xl border border-[#F0E4DC] p-5">
              <p className="font-serif text-base italic text-[#6B4C3B] text-center leading-relaxed">
                "{day.affirmation}"
              </p>
            </div>
          </div>
        )}

        {activeTab === "exercicio" && (
          <div className="bg-white rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden">
            <div className="relative h-40 overflow-hidden">
              <img
                src={IMAGES.journal}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/60 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="text-white font-serif text-lg">
                  {day.exercise.title}
                </p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-[#8B6E5A] text-sm mb-5 leading-relaxed">
                {day.exercise.description}
              </p>
              <div className="space-y-3">
                {day.exercise.steps.map((step, index) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F5EDE8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#C4856A]">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-[#4A3728] text-sm leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  saveDay(dayNumber, {
                    exerciseCompleted: !(record?.exerciseCompleted ?? false),
                  })
                }
                className={`mt-6 w-full flex items-center justify-center gap-2 h-11 rounded-xl font-medium text-sm transition-all duration-200 ${
                  record?.exerciseCompleted
                    ? "bg-[#F5EDE8] text-[#C4856A] border border-[#E8D5CC]"
                    : "bg-[#C4856A] text-white hover:bg-[#B07055]"
                }`}
              >
                {record?.exerciseCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Exercício concluído
                  </>
                ) : (
                  "Marcar como concluído"
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === "diario" && (
          <div className="space-y-4">
            {day.journalPrompts.map((prompt, index) => {
              const key = `p${index}`;
              return (
                <div
                  key={key}
                  className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm"
                >
                  <p className="text-[#4A3728] font-medium text-sm mb-3 leading-relaxed">
                    {prompt}
                  </p>
                  <Textarea
                    value={prompts[key] ?? ""}
                    onChange={event =>
                      saveDay(dayNumber, {
                        prompts: { ...prompts, [key]: event.target.value },
                      })
                    }
                    placeholder="Escreva aqui o que vier..."
                    className="min-h-[100px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm text-[#4A3728] placeholder:text-[#C4B0A4]"
                  />
                </div>
              );
            })}
            <div className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm">
              <p className="text-[#4A3728] font-medium text-sm mb-3">
                Anotações livres
              </p>
              <Textarea
                value={notes}
                onChange={event =>
                  saveDay(dayNumber, { notes: event.target.value })
                }
                placeholder="Qualquer coisa que queira registrar sobre hoje..."
                className="min-h-[80px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm text-[#4A3728] placeholder:text-[#C4B0A4]"
              />
            </div>
          </div>
        )}

        {activeTab === "audio" && (
          <div className="space-y-3">
            <p className="text-[#6B4C3B] text-sm leading-relaxed px-1">
              {day.meditationDescription}
            </p>
            <MeditationPlayer
              title={day.meditationTitle}
              duration={day.meditationDuration}
              audioUrl={day.audioUrl}
              dayNumber={day.day}
              completed={record?.meditationListened ?? false}
              onComplete={() =>
                saveDay(dayNumber, { meditationListened: true })
              }
            />
          </div>
        )}
      </motion.div>

      {isCompleted ? (
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5EDE8] flex-shrink-0 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#C4856A]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#2C1810]">
                  Dia concluído
                </p>
                <p className="text-xs text-[#B08070] flex items-center gap-1.5">
                  <span>{moodEmoji(mood)}</span>
                  {record?.completedAt && (
                    <span>{formatLongDate(record.completedAt)}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ShareInstagramButton
                subject={{ kind: "day", day: day.day, mood }}
                variant="ghost"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setIsFirstCompletion(false);
                  setShowCelebration(true);
                }}
                className="border-[#E8D5CC] text-[#6B4C3B] rounded-xl hover:bg-[#F5EDE8] text-sm flex-1 sm:flex-none"
                size="sm"
              >
                Ver celebração
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm space-y-5">
          <div>
            <p className="font-semibold text-[#2C1810] mb-1 text-sm">
              Como você está se sentindo agora?
            </p>
            <p className="text-xs text-[#8B6E5A] mb-4">
              Depois de completar as práticas do dia
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{moodEmoji(mood)}</span>
                <span className="text-sm text-[#8B6E5A]">
                  {moodLabel(mood)}
                </span>
              </div>
              <Slider
                value={[mood]}
                onValueChange={([value]) => saveDay(dayNumber, { mood: value })}
                min={MOOD_MIN}
                max={MOOD_MAX}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#B08070]">
                <span>{MOOD_SCALE[0].label}</span>
                <span>{MOOD_SCALE[MOOD_SCALE.length - 1].label}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            className="w-full h-12 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl font-medium text-base transition-all duration-200 active:scale-[0.97] shadow-md shadow-[#C4856A]/20"
          >
            <CheckCircle2 className="mr-2 w-5 h-5" />
            Concluir o Dia {day.day}
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => openDay(day.day - 1)}
          disabled={day.day <= 1}
          className="flex items-center gap-1 text-sm text-[#B08070] hover:text-[#C4856A] disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Dia anterior
        </button>
        <span className="text-xs text-[#B08070]">
          Dia {day.day} de {DAY_COUNT}
        </span>
        <button
          onClick={() => openDay(day.day + 1)}
          disabled={day.day >= currentDay}
          className="flex items-center gap-1 text-sm text-[#B08070] hover:text-[#C4856A] disabled:opacity-30 transition-colors"
        >
          Dia seguinte
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
