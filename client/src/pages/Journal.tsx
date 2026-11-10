import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, PenLine, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/app/store";
import { writtenDaysOf, type DayRecord } from "@/app/state";
import { getDay, MOOD_SCALE, moodEmoji, moodLabel } from "@/journey";
import { dateOfDay, formatLongDate } from "@/lib/dates";
import MoodChart from "@/components/MoodChart";

export default function Journal() {
  const { state, currentDay, saveDay, clearDayWriting } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [newMood, setNewMood] = useState(3);
  const [newText, setNewText] = useState("");

  const toggleNewEntry = () => {
    if (!showNew) {
      const record = state.days[currentDay];
      setNewMood(record?.mood ?? 3);
      setNewText(record?.notes ?? "");
    }
    setShowNew(!showNew);
  };

  const written = writtenDaysOf(state);
  const newestFirst = [...written].reverse();

  const handleSave = () => {
    if (!newText.trim()) return;
    saveDay(currentDay, { mood: newMood, notes: newText });
    setNewText("");
    setNewMood(3);
    setShowNew(false);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
            Diário Emocional
          </h1>
          <p className="text-[#8B6E5A] text-sm">{written.length} entradas</p>
        </div>
        <Button
          onClick={toggleNewEntry}
          className="bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl h-10 px-4 text-sm"
        >
          {showNew ? (
            <X className="w-4 h-4" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" /> Nova entrada
            </>
          )}
        </Button>
      </div>

      {written.length > 0 && <MoodChart records={written} />}

      {showNew && (
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-[#2C1810]">Nova entrada</h3>
          <div>
            <p className="text-xs text-[#8B6E5A] mb-2">
              Como você está se sentindo?
            </p>
            <div className="flex gap-2">
              {MOOD_SCALE.map(step => (
                <button
                  key={step.value}
                  onClick={() => setNewMood(step.value)}
                  className={`flex-1 py-2 rounded-xl text-xl transition-all ${
                    newMood === step.value
                      ? "bg-[#F5EDE8] scale-110"
                      : "bg-[#FAF6F1] hover:bg-[#F5EDE8]"
                  }`}
                >
                  {step.emoji}
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-[#B08070] mt-1">
              {moodLabel(newMood)}
            </p>
          </div>
          <Textarea
            value={newText}
            onChange={event => setNewText(event.target.value)}
            placeholder="O que está no seu coração hoje?"
            className="min-h-[120px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm text-[#4A3728] placeholder:text-[#C4B0A4]"
          />
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!newText.trim()}
              className="flex-1 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl"
            >
              <PenLine className="w-4 h-4 mr-2" />
              Salvar entrada
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNew(false)}
              className="border-[#E8D5CC] text-[#6B4C3B] rounded-xl hover:bg-[#F5EDE8]"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {newestFirst.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
            <PenLine className="w-7 h-7 text-[#C4856A]" />
          </div>
          <p className="font-serif text-lg text-[#2C1810] mb-2">
            Seu diário está vazio
          </p>
          <p className="text-[#8B6E5A] text-sm max-w-xs mx-auto">
            Escreva sua primeira entrada. Não precisa ser perfeito — só precisa
            ser honesto.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {newestFirst.map(record => (
            <JournalCard
              key={record.day}
              record={record}
              startDate={state.startDate}
              isExpanded={expandedDay === record.day}
              onToggle={() =>
                setExpandedDay(expandedDay === record.day ? null : record.day)
              }
              onDelete={() => clearDayWriting(record.day)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function JournalCard({
  record,
  startDate,
  isExpanded,
  onToggle,
  onDelete,
}: {
  record: DayRecord;
  startDate: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const day = getDay(record.day);
  const writtenPrompts = day.journalPrompts
    .map((prompt, index) => ({
      prompt,
      answer: record.prompts[`p${index}`] ?? "",
    }))
    .filter(item => item.answer.trim() !== "");

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#FAF6F1] transition-colors"
      >
        <span className="text-2xl">{moodEmoji(record.mood)}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#B08070] mb-0.5">
            Dia {record.day}
            {record.completedAt
              ? ` · ${formatLongDate(record.completedAt)}`
              : startDate
                ? ` · ${dateOfDay(startDate, record.day).toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`
                : ""}
          </p>
          <p className="text-sm text-[#4A3728] line-clamp-2 leading-relaxed">
            {record.notes}
          </p>
        </div>
        <div className="flex-shrink-0 text-[#B08070]">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-[#F0E4DC] pt-4">
          {record.notes.trim() && (
            <div className="bg-[#FAF6F1] rounded-xl p-4">
              <p className="text-sm text-[#4A3728] leading-relaxed whitespace-pre-wrap">
                {record.notes}
              </p>
            </div>
          )}
          {writtenPrompts.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-[#B08070] font-medium uppercase tracking-wide">
                Reflexões do dia
              </p>
              {writtenPrompts.map(item => (
                <div key={item.prompt} className="bg-[#FAF6F1] rounded-xl p-3">
                  <p className="text-xs text-[#B08070] mb-1">{item.prompt}</p>
                  <p className="text-sm text-[#4A3728] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#B08070]">
              Humor: {moodLabel(record.mood)}
            </span>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Excluir
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
