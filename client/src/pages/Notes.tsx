import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Edit3, FileText, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/app/store";
import type { Note } from "@/app/state";
import { formatShortDate } from "@/lib/dates";

export default function Notes() {
  const { state, addNote, updateNote, deleteNote } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleSave = () => {
    if (!newContent.trim()) return;
    addNote({ title: newTitle || "Sem título", content: newContent });
    setNewTitle("");
    setNewContent("");
    setShowNew(false);
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const sorted = [...state.notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
            Anotações
          </h1>
          <p className="text-[#8B6E5A] text-sm">{state.notes.length} notas</p>
        </div>
        <Button
          onClick={() => setShowNew(!showNew)}
          className="bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl h-10 px-4 text-sm"
        >
          {showNew ? (
            <X className="w-4 h-4" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" /> Nova nota
            </>
          )}
        </Button>
      </div>

      {showNew && (
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm space-y-3">
          <Input
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            placeholder="Título (opcional)"
            className="border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl text-sm"
          />
          <Textarea
            value={newContent}
            onChange={event => setNewContent(event.target.value)}
            placeholder="Escreva sua anotação..."
            className="min-h-[120px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm text-[#4A3728] placeholder:text-[#C4B0A4]"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={!newContent.trim()}
              className="flex-1 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl text-sm"
            >
              Salvar
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNew(false)}
              className="border-[#E8D5CC] text-[#6B4C3B] rounded-xl text-sm hover:bg-[#F5EDE8]"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-[#C4856A]" />
          </div>
          <p className="font-serif text-lg text-[#2C1810] mb-2">
            Nenhuma anotação ainda
          </p>
          <p className="text-[#8B6E5A] text-sm">
            Registre pensamentos, insights e descobertas da sua jornada.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sorted.map(note => (
            <motion.div
              key={note.id}
              layout
              className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm"
            >
              {editingId === note.id ? (
                <div className="space-y-2">
                  <Input
                    value={editTitle}
                    onChange={event => setEditTitle(event.target.value)}
                    className="border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl text-sm"
                  />
                  <Textarea
                    value={editContent}
                    onChange={event => setEditContent(event.target.value)}
                    className="min-h-[100px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        updateNote(note.id, {
                          title: editTitle,
                          content: editContent,
                        });
                        setEditingId(null);
                      }}
                      className="flex items-center gap-1 text-xs text-[#C4856A] font-medium"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 text-xs text-[#B08070]"
                    >
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm text-[#2C1810] leading-tight">
                      {note.title}
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEditing(note)}
                        className="text-[#B08070] hover:text-[#C4856A] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-[#B08070] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#6B4C3B] leading-relaxed line-clamp-4 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <p className="text-xs text-[#B08070] mt-3">
                    {formatShortDate(note.updatedAt)}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
