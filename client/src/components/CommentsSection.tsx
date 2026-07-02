// OUSE SER VOCÊ – Comments Section
// Seção de comentários com suporte a respostas aninhadas

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CommentItem from "./CommentItem";
import { useComments } from "@/hooks/useComments";

interface CommentsSectionProps {
  storyId: string;
  storyAuthorName: string;
}

const avatarOptions = ["👩", "👩‍🦱", "👩‍🦳", "👩‍🦰", "👩‍🦲"];

export default function CommentsSection({
  storyId,
  storyAuthorName,
}: CommentsSectionProps) {
  const { comments, loading, addComment, removeComment, likeComment } =
    useComments(storyId);
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const handleSubmit = () => {
    if (!authorName.trim() || !commentText.trim()) return;

    addComment(authorName, selectedAvatar, commentText);
    setAuthorName("");
    setCommentText("");
    setShowForm(false);
  };

  const handleAddReply = (
    text: string,
    parentCommentId: string,
    replyAuthorName: string,
    replyAvatar: string
  ) => {
    addComment(replyAuthorName, replyAvatar, text, parentCommentId);
  };

  const totalComments =
    comments.length +
    comments.reduce((sum, c) => sum + (c.replies?.length || 0), 0);

  return (
    <div className="border-t border-[#F0E4DC] pt-5 mt-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-[#C4856A]" />
        <p className="font-semibold text-[#2C1810]">
          Conversas de apoio ({totalComments})
        </p>
      </div>

      {/* Form Toggle */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-3 rounded-xl bg-[#F5EDE8] border border-[#E8D5CC] text-[#6B4C3B] text-sm hover:bg-[#E8D5CC] transition-colors text-left"
        >
          Deixe uma mensagem de apoio...
        </button>
      )}

      {/* Comment Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-[#F5EDE8] rounded-xl border border-[#E8D5CC] p-4 mb-4 space-y-3"
        >
          <div>
            <label className="text-xs font-semibold text-[#8B6E5A] block mb-2">
              Seu nome
            </label>
            <input
              type="text"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="Como você gostaria de ser chamada?"
              className="w-full px-3 py-2 rounded-lg border border-[#E8D5CC] bg-white text-sm text-[#2C1810] placeholder:text-[#B08070] focus:outline-none focus:border-[#C4856A]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8B6E5A] block mb-2">
              Escolha um avatar
            </label>
            <div className="flex gap-2">
              {avatarOptions.map(avatar => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all ${
                    selectedAvatar === avatar
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
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Compartilhe uma palavra de apoio, celebração ou inspiração..."
              className="min-h-[100px] border-[#E8D5CC] focus:border-[#C4856A] bg-white rounded-lg resize-none text-sm text-[#2C1810] placeholder:text-[#B08070]"
            />
            <p className="text-xs text-[#B08070] mt-1">
              Dica: Mensagens autênticas e acolhedoras criam uma comunidade mais
              forte 💫
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!authorName.trim() || !commentText.trim()}
              className="flex-1 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
            <Button
              onClick={() => setShowForm(false)}
              variant="outline"
              className="border-[#E8D5CC] text-[#6B4C3B] rounded-lg hover:bg-[#FAF6F1]"
            >
              Cancelar
            </Button>
          </div>
        </motion.div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-6">
          <p className="text-sm text-[#B08070]">Carregando comentários...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-[#8B6E5A] mb-2">Ainda não há mensagens</p>
          <p className="text-xs text-[#B08070]">
            Seja a primeira a deixar uma palavra de apoio! 💫
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              storyAuthorName={storyAuthorName}
              depth={0}
              onAddReply={handleAddReply}
              onRemove={removeComment}
              onLike={likeComment}
            />
          ))}
        </div>
      )}

      {/* Community Guidelines */}
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
