// OUSE SER VOCÊ – Diário Emocional
// Design: Clínica Emocional Sofisticada

import { useState } from "react";
import { motion } from "framer-motion";
import { useJournal } from "@/hooks/useJournal";
import { useJourney } from "@/hooks/useJourney";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenLine, Trash2, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import type { JournalEntry } from "@/contexts/AppContext";
import MoodChart from "@/components/MoodChart";

const moodEmojis = ["", "😔", "😕", "😐", "🙂", "😊"];
const moodLabels = [
  "",
  "Muito pesado",
  "Pesado",
  "Neutro",
  "Leve",
  "Muito leve",
];

export default function Journal() {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useJournal();
  const { currentDay } = useJourney();
  const [showNew, setShowNew] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newMood, setNewMood] = useState(3);
  const [newText, setNewText] = useState("");

  const handleSave = () => {
    if (!newText.trim()) return;
    addJournalEntry({
      dayNumber: currentDay,
      date: new Date().toDateString(),
      mood: newMood,
      text: newText,
      prompts: {},
    });
    setNewText("");
    setNewMood(3);
    setShowNew(false);
  };

  const sorted = [...journalEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
            Diário Emocional
          </h1>
          <p className="text-[#8B6E5A] text-sm">
            {journalEntries.length} entradas
          </p>
        </div>
        <Button
          onClick={() => setShowNew(!showNew)}
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

      {/* Mood Chart */}
      {journalEntries.length > 0 && <MoodChart entries={journalEntries} />}

      {/* New Entry Form */}
      {showNew && (
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-[#2C1810]">Nova entrada</h3>
          <div>
            <p className="text-xs text-[#8B6E5A] mb-2">
              Como você está se sentindo?
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button
                  key={v}
                  onClick={() => setNewMood(v)}
                  className={`flex-1 py-2 rounded-xl text-xl transition-all ${
                    newMood === v
                      ? "bg-[#F5EDE8] scale-110"
                      : "bg-[#FAF6F1] hover:bg-[#F5EDE8]"
                  }`}
                >
                  {moodEmojis[v]}
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-[#B08070] mt-1">
              {moodLabels[newMood]}
            </p>
          </div>
          <Textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
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

      {/* Entries List */}
      {sorted.length === 0 ? (
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
          {sorted.map(entry => (
            <JournalCard
              key={entry.id}
              entry={entry}
              isExpanded={expandedId === entry.id}
              onToggle={() =>
                setExpandedId(expandedId === entry.id ? null : entry.id)
              }
              onDelete={() => deleteJournalEntry(entry.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function JournalCard({
  entry,
  isExpanded,
  onToggle,
  onDelete,
}: {
  entry: JournalEntry;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const date = new Date(entry.createdAt);
  const dateStr = date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const promptKeys = Object.keys(entry.prompts).filter(k =>
    entry.prompts[k]?.trim()
  );

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#FAF6F1] transition-colors"
      >
        <span className="text-2xl">{moodEmojis[entry.mood]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#B08070] mb-0.5">
            {dateStr} · Dia {entry.dayNumber}
          </p>
          <p className="text-sm text-[#4A3728] line-clamp-2 leading-relaxed">
            {entry.text}
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
          <div className="bg-[#FAF6F1] rounded-xl p-4">
            <p className="text-sm text-[#4A3728] leading-relaxed whitespace-pre-wrap">
              {entry.text}
            </p>
          </div>
          {promptKeys.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-[#B08070] font-medium uppercase tracking-wide">
                Reflexões do dia
              </p>
              {promptKeys.map(k => (
                <div key={k} className="bg-[#FAF6F1] rounded-xl p-3">
                  <p className="text-sm text-[#4A3728] leading-relaxed">
                    {entry.prompts[k]}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#B08070]">
              Humor: {moodLabels[entry.mood]}
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
