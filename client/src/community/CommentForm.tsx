import { useId, useState } from "react";
import { Action, Field, fieldInputClass, focusRing } from "@/components/ds";
import { cn } from "@/lib/utils";

export const AVATAR_OPTIONS = ["👩", "👩‍🦱", "👩‍🦳", "👩‍🦰", "👩‍🦲"];

interface CommentFormProps {
  submitLabel: string;
  onSubmit: (input: {
    authorName: string;
    authorAvatar: string;
    text: string;
  }) => void;
  onCancel?: () => void;
}

export default function CommentForm({
  submitLabel,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const [authorName, setAuthorName] = useState("");
  const [authorAvatar, setAuthorAvatar] = useState(AVATAR_OPTIONS[0]);
  const [text, setText] = useState("");
  const fieldId = useId();

  const nameId = `${fieldId}-name`;
  const textId = `${fieldId}-text`;
  const avatarLabelId = `${fieldId}-avatar`;
  const canSubmit = authorName.trim() !== "" && text.trim() !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ authorName: authorName.trim(), authorAvatar, text });
    setAuthorName("");
    setText("");
    setAuthorAvatar(AVATAR_OPTIONS[0]);
  };

  return (
    <div className="space-y-3">
      <Field
        label="Seu nome"
        htmlFor={nameId}
        required
        hint="Aparece junto da sua mensagem."
      >
        <input
          id={nameId}
          type="text"
          autoFocus
          value={authorName}
          onChange={event => setAuthorName(event.target.value)}
          placeholder="Como você gostaria de ser chamada?"
          className={cn("h-11", fieldInputClass())}
        />
      </Field>

      <div className="space-y-2">
        <p id={avatarLabelId} className="text-sm font-medium text-ink">
          Avatar
        </p>
        <div
          role="group"
          aria-labelledby={avatarLabelId}
          className="flex flex-wrap gap-1.5"
        >
          {AVATAR_OPTIONS.map((avatar, index) => {
            const selected = authorAvatar === avatar;
            return (
              <button
                key={avatar}
                type="button"
                aria-pressed={selected}
                onClick={() => setAuthorAvatar(avatar)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl text-lg transition-colors",
                  focusRing,
                  selected
                    ? "bg-brand-soft ring-2 ring-brand"
                    : "border border-line-strong bg-white hover:bg-surface-soft"
                )}
              >
                <span aria-hidden>{avatar}</span>
                <span className="sr-only">Opção {index + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Field
        label="Sua mensagem"
        htmlFor={textId}
        required
        hint="Fica visível para quem abrir esta história."
      >
        <textarea
          id={textId}
          value={text}
          onChange={event => setText(event.target.value)}
          rows={3}
          placeholder="Escreva uma palavra de apoio."
          className={cn(
            fieldInputClass(),
            "min-h-[96px] resize-y py-3 leading-relaxed text-ink-soft"
          )}
        />
      </Field>

      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Action
          block
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="sm:flex-1"
        >
          {submitLabel}
        </Action>
        {onCancel && (
          <Action
            variant="secondary"
            block
            onClick={onCancel}
            className="sm:w-auto"
          >
            Cancelar
          </Action>
        )}
      </div>
    </div>
  );
}
