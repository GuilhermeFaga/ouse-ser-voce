// OUSE SER VOCÊ – Comment Item
// Componente individual de comentário com suporte a respostas aninhadas

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LikeButton from "./LikeButton";
import type { Comment } from "@/hooks/useComments";

interface CommentItemProps {
  comment: Comment;
  storyAuthorName: string;
  depth?: number;
  onAddReply: (text: string, parentCommentId: string, authorName: string, authorAvatar: string) => void;
  onRemove: (commentId: string) => void;
  onLike: (commentId: string) => void;
}

const avatarOptions = ["👩", "👩‍🦱", "👩‍🦳", "👩‍🦰", "👩‍🦲"];

export default function CommentItem({
  comment,
  storyAuthorName,
  depth = 0,
  onAddReply,
  onRemove,
  onLike,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyAuthorName, setReplyAuthorName] = useState("");
  const [replyAvatar, setReplyAvatar] = useState(avatarOptions[0]);
  const [showReplies, setShowReplies] = useState(true);

  const handleSubmitReply = () => {
    if (!replyAuthorName.trim() || !replyText.trim()) return;

    onAddReply(replyText, comment.id, replyAuthorName, replyAvatar);
    setReplyText("");
    setReplyAuthorName("");
    setReplyAvatar(avatarOptions[0]);
    setShowReplyForm(false);
  };

  const maxDepth = 3;
  const canReply = depth < maxDepth;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${depth > 0 ? "ml-4 md:ml-6 border-l-2 border-[#E8D5CC] pl-4 md:pl-6" : ""}`}
    >
      <div className="bg-white rounded-xl border border-[#F0E4DC] p-4 mb-3">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5EDE8] flex items-center justify-center text-lg flex-shrink-0">
              {comment.authorAvatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2C1810]">{comment.authorName}</p>
              <p className="text-xs text-[#B08070]">
                {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={() => onRemove(comment.id)}
            className="text-[#B08070] hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Comment Text */}
        <p className="text-sm text-[#4A3728] leading-relaxed mb-3">{comment.text}</p>

        {/* Comment Footer */}
        <div className="flex items-center gap-3">
          <LikeButton
            likes={comment.likes}
            isLiked={comment.likedBy?.includes("current-user") || false}
            onToggle={() => onLike(comment.id)}
            size="sm"
            showCount={true}
          />

          {canReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-xs text-[#C4856A] hover:text-[#B07055] transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              Responder
            </button>
          )}
        </div>

        {/* Special Badge for Story Author */}
        {comment.authorName === storyAuthorName && (
          <div className="mt-2 inline-block px-2 py-1 bg-[#F5EDE8] rounded text-xs text-[#C4856A] font-semibold">
            ✓ Autora
          </div>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && canReply && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-[#F5EDE8] rounded-xl border border-[#E8D5CC] p-4 mb-3 ml-4 md:ml-6"
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#8B6E5A] block mb-2">Seu nome</label>
              <input
                type="text"
                value={replyAuthorName}
                onChange={(e) => setReplyAuthorName(e.target.value)}
                placeholder="Como você gostaria de ser chamada?"
                className="w-full px-3 py-2 rounded-lg border border-[#E8D5CC] bg-white text-sm text-[#2C1810] placeholder:text-[#B08070] focus:outline-none focus:border-[#C4856A]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#8B6E5A] block mb-2">Avatar</label>
              <div className="flex gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setReplyAvatar(avatar)}
                    className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                      replyAvatar === avatar
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
              <label className="text-xs font-semibold text-[#8B6E5A] block mb-2">Sua resposta</label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Responda com apoio e autenticidade..."
                className="min-h-[80px] border-[#E8D5CC] focus:border-[#C4856A] bg-white rounded-lg resize-none text-sm text-[#2C1810] placeholder:text-[#B08070]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReply}
                disabled={!replyAuthorName.trim() || !replyText.trim()}
                className="flex-1 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Enviar resposta
              </Button>
              <Button
                onClick={() => setShowReplyForm(false)}
                variant="outline"
                className="border-[#E8D5CC] text-[#6B4C3B] rounded-lg hover:bg-[#FAF6F1] text-sm"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs text-[#8B6E5A] hover:text-[#C4856A] transition-colors mb-2 ml-4 md:ml-6"
          >
            {showReplies ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Ocultar {comment.replies.length} resposta{comment.replies.length !== 1 ? "s" : ""}
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Ver {comment.replies.length} resposta{comment.replies.length !== 1 ? "s" : ""}
              </>
            )}
          </button>

          {showReplies && (
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  storyAuthorName={storyAuthorName}
                  depth={depth + 1}
                  onAddReply={onAddReply}
                  onRemove={onRemove}
                  onLike={onLike}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
