import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Reply, Trash2 } from "lucide-react";
import { useApp } from "@/app/store";
import { focusRing, Pill } from "@/components/ds";
import { cn } from "@/lib/utils";
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
  const repliesId = useId();

  const isLiked = comment.likedBy.includes(state.userId);
  const canDelete =
    comment.authorId !== null && comment.authorId === state.userId;
  const canReply = depth < MAX_REPLY_DEPTH;
  const isAuthor = comment.authorName === storyAuthorName;
  const likeLabel = `${isLiked ? "Remover sua curtida da" : "Curtir a"} mensagem de ${comment.authorName}, ${comment.likedBy.length} ${comment.likedBy.length === 1 ? "curtida" : "curtidas"}`;

  const postedAt = new Date(comment.createdAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(depth > 0 && "border-l border-line-strong pl-3 sm:pl-4")}
    >
      <div
        className={cn(
          "space-y-2",
          depth === 0
            ? "rounded-xl bg-surface-soft px-3.5 py-3"
            : "border-b border-line pb-3"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base"
              aria-hidden
            >
              {comment.authorAvatar}
            </span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-ink">
                <span className="truncate">{comment.authorName}</span>
                {isAuthor && <Pill tone="brand">autora</Pill>}
              </p>
              <p className="text-[11px] tabular-nums text-ink-muted">
                {postedAt}
              </p>
            </div>
          </div>
          {canDelete && (
            <button
              type="button"
              onClick={() => removeComment(comment.id)}
              aria-label={`Excluir a mensagem de ${comment.authorName}`}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white hover:text-destructive",
                focusRing
              )}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>

        <p className="text-sm leading-relaxed text-ink-soft">{comment.text}</p>

        <div className="flex items-center gap-1">
          <LikeButton
            likes={comment.likedBy.length}
            isLiked={isLiked}
            onToggle={() => toggleCommentLike(comment.id)}
            label={likeLabel}
            size="sm"
          />

          {canReply && (
            <button
              type="button"
              onClick={() => setShowReplyForm(current => !current)}
              aria-expanded={showReplyForm}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-xs font-medium text-brand transition-colors hover:bg-white hover:text-brand-strong",
                focusRing
              )}
            >
              <Reply className="h-3.5 w-3.5" aria-hidden />
              Responder
            </button>
          )}
        </div>
      </div>

      {showReplyForm && canReply && (
        <div className="mb-3 ml-3 rounded-xl border border-line-strong bg-surface-soft p-4 sm:ml-4">
          <CommentForm
            submitLabel="Publicar resposta"
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
        <div className="mt-2 pl-3 sm:pl-4">
          <button
            type="button"
            onClick={() => setShowReplies(current => !current)}
            aria-expanded={showReplies}
            aria-controls={repliesId}
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 rounded-xl px-1 text-xs font-medium text-ink-muted transition-colors hover:text-brand-ink",
              focusRing
            )}
          >
            {showReplies ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            )}
            {showReplies ? "Ocultar" : "Ver"} {comment.replies.length}{" "}
            {comment.replies.length === 1 ? "resposta" : "respostas"}
          </button>

          {showReplies && (
            <div id={repliesId} className="space-y-2.5">
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
