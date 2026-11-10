import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
      <div>
        <label className="text-xs font-semibold text-[#8B6E5A] block mb-2">
          Seu nome
        </label>
        <input
          type="text"
          value={authorName}
          onChange={event => setAuthorName(event.target.value)}
          placeholder="Como você gostaria de ser chamada?"
          className="w-full px-3 py-2 rounded-lg border border-[#E8D5CC] bg-white text-sm text-[#2C1810] placeholder:text-[#B08070] focus:outline-none focus:border-[#C4856A]"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-[#8B6E5A] block mb-2">
          Avatar
        </label>
        <div className="flex gap-2">
          {AVATAR_OPTIONS.map(avatar => (
            <button
              key={avatar}
              onClick={() => setAuthorAvatar(avatar)}
              className={`w-9 h-9 rounded-lg text-base flex items-center justify-center transition-all ${
                authorAvatar === avatar
                  ? "bg-[#C4856A] ring-2 ring-[#C4856A] ring-offset-2"
                  : "bg-white border border-[#E8D5CC] hover:bg-[#FAF6F1]"
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#8B6E5A] block mb-2">
          Sua mensagem
        </label>
        <Textarea
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="Compartilhe uma palavra de apoio, celebração ou inspiração..."
          className="min-h-[90px] border-[#E8D5CC] focus:border-[#C4856A] bg-white rounded-lg resize-none text-sm text-[#2C1810] placeholder:text-[#B08070]"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex-1 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-[#E8D5CC] text-[#6B4C3B] rounded-lg hover:bg-[#FAF6F1] text-sm"
          >
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}
