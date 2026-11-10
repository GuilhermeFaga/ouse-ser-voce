import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useApp } from "@/app/store";
import { buildCommentTree, countComments } from "./comments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

interface CommentsSectionProps {
  storyId: string;
  storyAuthorName: string;
}

export default function CommentsSection({
  storyId,
  storyAuthorName,
}: CommentsSectionProps) {
  const { state, addComment } = useApp();
  const [showForm, setShowForm] = useState(false);

  const tree = buildCommentTree(state.comments, storyId);
  const total = countComments(tree);

  return (
    <div className="border-t border-[#F0E4DC] pt-5 mt-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-[#C4856A]" />
        <p className="font-semibold text-[#2C1810]">
          Conversas de apoio ({total})
        </p>
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-3 rounded-xl bg-[#F5EDE8] border border-[#E8D5CC] text-[#6B4C3B] text-sm hover:bg-[#E8D5CC] transition-colors text-left"
        >
          Deixe uma mensagem de apoio...
        </button>
      )}

      {showForm && (
        <div className="bg-[#F5EDE8] rounded-xl border border-[#E8D5CC] p-4 mb-4">
          <CommentForm
            submitLabel="Enviar"
            onCancel={() => setShowForm(false)}
            onSubmit={({ authorName, authorAvatar, text }) => {
              addComment({ storyId, authorName, authorAvatar, text });
              setShowForm(false);
            }}
          />
        </div>
      )}

      {tree.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-[#8B6E5A] mb-2">Ainda não há mensagens</p>
          <p className="text-xs text-[#B08070]">
            Seja a primeira a deixar uma palavra de apoio! 💫
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tree.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              storyAuthorName={storyAuthorName}
            />
          ))}
        </div>
      )}

      <div className="mt-6 bg-[#F5EDE8] rounded-lg border border-[#E8D5CC] p-3">
        <p className="text-xs font-semibold text-[#8B6E5A] uppercase tracking-wide mb-2">
          💡 Dicas para conversas acolhedoras
        </p>
        <div className="space-y-1 text-xs text-[#6B4C3B]">
          <p>✓ Responda com empatia e autenticidade</p>
          <p>✓ Celebre as pequenas vitórias das outras mulheres</p>
          <p>✓ Compartilhe sua própria experiência quando relevante</p>
        </div>
      </div>
    </div>
  );
}
