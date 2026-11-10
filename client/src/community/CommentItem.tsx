import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Reply, Trash2 } from "lucide-react";
import { useApp } from "@/app/store";
import type { CommentNode } from "./types";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";

const MAX_REPLY_DEPTH = 3;

interface CommentItemProps {
  comment: CommentNode;
  storyAuthorName: string;
  depth?: number;
}

export default function CommentItem({
  comment,
  storyAuthorName,
  depth = 0,
}: CommentItemProps) {
  const { state, addComment, removeComment, toggleCommentLike } = useApp();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const isLiked = comment.likedBy.includes(state.userId);
  const canReply = depth < MAX_REPLY_DEPTH;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={
        depth > 0 ? "ml-4 md:ml-6 border-l-2 border-[#E8D5CC] pl-4 md:pl-6" : ""
      }
    >
      <div className="bg-white rounded-xl border border-[#F0E4DC] p-4 mb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F5EDE8] flex items-center justify-center text-lg flex-shrink-0">
              {comment.authorAvatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#2C1810]">
                {comment.authorName}
              </p>
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
            onClick={() => removeComment(comment.id)}
            className="text-[#B08070] hover:text-red-500 transition-colors"
            title="Excluir comentário"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-[#4A3728] leading-relaxed mb-3">
          {comment.text}
        </p>

        <div className="flex items-center gap-3">
          <LikeButton
            likes={comment.likedBy.length}
            isLiked={isLiked}
            onToggle={() => toggleCommentLike(comment.id)}
            size="sm"
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

        {comment.authorName === storyAuthorName && (
          <div className="mt-2 inline-block px-2 py-1 bg-[#F5EDE8] rounded text-xs text-[#C4856A] font-semibold">
            ✓ Autora
          </div>
        )}
      </div>

      {showReplyForm && canReply && (
        <div className="bg-[#F5EDE8] rounded-xl border border-[#E8D5CC] p-4 mb-3 ml-4 md:ml-6">
          <CommentForm
            submitLabel="Enviar resposta"
            onCancel={() => setShowReplyForm(false)}
            onSubmit={({ authorName, authorAvatar, text }) => {
              addComment({
                storyId: comment.storyId,
                parentId: comment.id,
                authorName,
                authorAvatar,
                text,
              });
              setShowReplyForm(false);
            }}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs text-[#8B6E5A] hover:text-[#C4856A] transition-colors mb-2 ml-4 md:ml-6"
          >
            {showReplies ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {showReplies ? "Ocultar" : "Ver"} {comment.replies.length}{" "}
            {comment.replies.length === 1 ? "resposta" : "respostas"}
          </button>

          {showReplies && (
            <div className="space-y-3">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  storyAuthorName={storyAuthorName}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
