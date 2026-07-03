// OUSE SER VOCÊ – Anotações
import { useState } from "react";
import { motion } from "framer-motion";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit3, Check, X, FileText } from "lucide-react";
import type { Note } from "@/contexts/AppContext";

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const handleSave = () => {
    if (!newContent.trim()) return;
    addNote({ title: newTitle || "Sem título", content: newContent });
    setNewTitle("");
    setNewContent("");
    setShowNew(false);
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    updateNote(id, { title: editTitle, content: editContent });
    setEditingId(null);
  };

  const sorted = [...notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
            Anotações
          </h1>
          <p className="text-[#8B6E5A] text-sm">{notes.length} notas</p>
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

      <div>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm space-y-3">
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Título (opcional)"
                className="border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl text-sm"
              />
              <Textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
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
          </motion.div>
        )}
      </div>

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
                    onChange={e => setEditTitle(e.target.value)}
                    className="border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl text-sm"
                  />
                  <Textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="min-h-[100px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(note.id)}
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
                        onClick={() => handleEdit(note)}
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
                    {new Date(note.updatedAt).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "short",
                    })}
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
