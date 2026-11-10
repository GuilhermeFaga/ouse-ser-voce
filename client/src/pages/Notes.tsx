import { useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Edit3,
  NotebookPen,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/app/store";
import type { Note } from "@/app/state";
import { formatShortDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  Action,
  Card,
  CardTitle,
  EmptyState,
  Field,
  fieldInputClass,
  focusRing,
  Pill,
  Screen,
  ScreenHeader,
} from "@/components/ds";

/** Title the store receives when she leaves the optional field empty. */
const UNTITLED = "Sem título";

/** Above this length the card offers "Ler a nota inteira" instead of a long block. */
const CLAMP_THRESHOLD = 220;

export default function Notes() {
  const { state, addNote } = useApp();
  const [composerOpen, setComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const reduceMotion = useReducedMotion();

  const sorted = [...state.notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const canSave = newContent.trim().length > 0;

  const openComposer = () => setComposerOpen(true);

  // Closing keeps the draft in memory: reopening the composer restores it.
  const closeComposer = () => setComposerOpen(false);

  const handleSave = () => {
    if (!canSave) return;
    addNote({ title: newTitle || UNTITLED, content: newContent });
    setNewTitle("");
    setNewContent("");
    setComposerOpen(false);
  };

  const saveOnEnter = (event: KeyboardEvent) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSave();
    }
  };

  const countLabel =
    sorted.length === 1
      ? "1 anotação salva"
      : `${sorted.length} anotações salvas`;

  return (
    <Screen>
      <ScreenHeader
        kicker="Anotações livres"
        title="O que você quer anotar?"
        description={
          sorted.length === 0
            ? "Um lugar para o que você não quer esquecer."
            : `${countLabel} neste dispositivo.`
        }
        actions={
          composerOpen || sorted.length === 0 ? undefined : (
            <Action
              onClick={openComposer}
              icon={<Plus className="h-4 w-4" aria-hidden />}
            >
              Nova anotação
            </Action>
          )
        }
      />

      {composerOpen && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <Card>
            <CardTitle>Nova anotação</CardTitle>

            <Field
              label="Anotação"
              htmlFor="note-new-content"
              required
              hint="Uma frase basta. Você pode editar ou apagar depois."
            >
              <textarea
                id="note-new-content"
                autoFocus
                rows={5}
                value={newContent}
                onChange={event => setNewContent(event.target.value)}
                onKeyDown={saveOnEnter}
                placeholder="O que passou pela sua cabeça?"
                className={cn(
                  fieldInputClass(),
                  "min-h-[132px] resize-y py-3 leading-relaxed text-ink-soft"
                )}
              />
            </Field>

            <Field
              label="Título"
              htmlFor="note-new-title"
              optional
              hint="Serve só para reconhecer a nota na lista."
              className="mt-4"
            >
              <input
                id="note-new-title"
                type="text"
                value={newTitle}
                onChange={event => setNewTitle(event.target.value)}
                onKeyDown={saveOnEnter}
                placeholder="ex.: o que percebi no caminho"
                className={cn(fieldInputClass(), "h-12")}
              />
            </Field>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
              <Action
                size="lg"
                block
                onClick={handleSave}
                disabled={!canSave}
                className="sm:flex-1"
              >
                Salvar anotação
              </Action>
              <Action
                size="lg"
                variant="secondary"
                block
                onClick={closeComposer}
                className="sm:w-auto"
              >
                Cancelar
              </Action>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              Fica salvo neste dispositivo. Só você lê.
            </p>
          </Card>
        </motion.div>
      )}

      {sorted.length === 0 ? (
        !composerOpen && (
          <EmptyState
            icon={NotebookPen}
            title="Nenhuma anotação ainda"
            body="Um pensamento por nota, sem título obrigatório. O que você escrever fica salvo neste dispositivo e pode ser editado depois."
            action={
              <Action
                size="lg"
                onClick={openComposer}
                icon={<Plus className="h-4 w-4" aria-hidden />}
              >
                Nova anotação
              </Action>
            }
          />
        )
      ) : (
        <section className="space-y-3" aria-labelledby="notes-list-title">
          <CardTitle
            id="notes-list-title"
            hint={
              <span className="text-ink-subtle">mais recente primeiro</span>
            }
          >
            Suas anotações
          </CardTitle>
          {sorted.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </section>
      )}
    </Screen>
  );
}

function NoteCard({ note }: { note: Note }) {
  const { updateNote, deleteNote } = useApp();
  const [mode, setMode] = useState<"read" | "edit" | "confirmDelete">("read");
  const [expanded, setExpanded] = useState(false);
  const [draftTitle, setDraftTitle] = useState(note.title);
  const [draftContent, setDraftContent] = useState(note.content);

  const dateLabel = formatShortDate(note.updatedAt);
  const hasTitle = note.title.trim() !== "" && note.title !== UNTITLED;
  const wasEdited = note.updatedAt !== note.createdAt;
  const isLong = note.content.length > CLAMP_THRESHOLD;
  const noteLabel = hasTitle
    ? `${dateLabel}, ${note.title}`
    : `${dateLabel}, sem título`;

  const startEditing = () => {
    setDraftTitle(note.title);
    setDraftContent(note.content);
    setMode("edit");
  };

  const cancelEditing = () => {
    setDraftTitle(note.title);
    setDraftContent(note.content);
    setMode("read");
  };

  const canSaveEdit = draftContent.trim().length > 0;

  const saveEdit = () => {
    if (!canSaveEdit) return;
    updateNote(note.id, { title: draftTitle, content: draftContent });
    setMode("read");
  };

  const saveEditOnEnter = (event: KeyboardEvent) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      saveEdit();
    }
  };

  return (
    <Card as="article" padding="sm">
      {mode === "edit" ? (
        <div className="space-y-3">
          <Field label="Anotação" htmlFor={`${note.id}-content`} required>
            <textarea
              id={`${note.id}-content`}
              autoFocus
              rows={5}
              value={draftContent}
              onChange={event => setDraftContent(event.target.value)}
              onKeyDown={saveEditOnEnter}
              className={cn(
                fieldInputClass(),
                "min-h-[120px] resize-y py-3 leading-relaxed text-ink-soft"
              )}
            />
          </Field>

          <Field
            label="Título"
            htmlFor={`${note.id}-title`}
            optional
            hint="Serve só para reconhecer a nota na lista."
          >
            <input
              id={`${note.id}-title`}
              type="text"
              value={draftTitle}
              onChange={event => setDraftTitle(event.target.value)}
              onKeyDown={saveEditOnEnter}
              className={cn(fieldInputClass(), "h-12")}
            />
          </Field>

          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Action
              size="md"
              block
              onClick={saveEdit}
              disabled={!canSaveEdit}
              className="sm:flex-1"
            >
              Salvar alterações
            </Action>
            <Action
              size="md"
              variant="secondary"
              block
              onClick={cancelEditing}
              className="sm:w-auto"
            >
              Cancelar
            </Action>
          </div>
        </div>
      ) : (
        <>
          <h2
            className={cn(
              "text-sm font-medium leading-snug text-ink",
              !hasTitle && "sr-only"
            )}
          >
            {hasTitle ? note.title : `Anotação de ${dateLabel}`}
          </h2>

          <p
            className={cn(
              "whitespace-pre-wrap text-sm leading-relaxed text-ink-soft",
              hasTitle && "mt-1",
              isLong && !expanded && "line-clamp-4"
            )}
          >
            {note.content}
          </p>

          {isLong && (
            <Action
              variant="quiet"
              size="sm"
              className="mt-1 h-11 px-0 text-xs"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Mostrar menos" : "Ler a nota inteira"}
            </Action>
          )}

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-1.5">
            <div className="flex items-center gap-2">
              <time
                dateTime={note.updatedAt}
                className="text-xs text-ink-subtle"
              >
                {dateLabel}
              </time>
              {wasEdited && <Pill tone="neutral">editada</Pill>}
            </div>

            {mode === "confirmDelete" ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-xs text-ink-muted">Apagar esta anotação?</p>
                <Action
                  size="sm"
                  variant="danger"
                  className="h-11 border border-destructive/30 px-3"
                  onClick={() => deleteNote(note.id)}
                >
                  Apagar anotação
                </Action>
                <Action
                  size="sm"
                  variant="quiet"
                  className="h-11 px-3"
                  onClick={() => setMode("read")}
                >
                  Manter
                </Action>
              </div>
            ) : (
              <div className="flex items-center gap-0.5">
                <NoteIconButton
                  label={`Editar a anotação de ${noteLabel}`}
                  onClick={startEditing}
                  icon={Edit3}
                />
                <NoteIconButton
                  label={`Apagar a anotação de ${noteLabel}`}
                  onClick={() => setMode("confirmDelete")}
                  icon={Trash2}
                  danger
                />
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

function NoteIconButton({
  label,
  onClick,
  icon: Icon,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  icon: LucideIcon;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink-muted transition-colors",
        focusRing,
        danger
          ? "hover:bg-destructive/5 hover:text-destructive"
          : "hover:bg-surface-soft hover:text-ink"
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
