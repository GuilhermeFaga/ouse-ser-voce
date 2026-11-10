import { useId, useState } from "react";
import { useApp } from "@/app/store";
import { Action } from "@/components/ds";
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
  const [published, setPublished] = useState(false);
  const headingId = useId();

  const tree = buildCommentTree(state.comments, storyId);
  const total = countComments(tree);

  return (
    <section className="space-y-3 border-t border-line pt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3
          id={headingId}
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle"
        >
          Palavras de apoio
        </h3>
        <p className="text-xs tabular-nums text-ink-muted">
          {total} {total === 1 ? "mensagem" : "mensagens"}
        </p>
      </div>

      {/* The ask comes before the conversation: comments stay support, not a feed. */}
      {showForm ? (
        <div className="rounded-xl border border-line-strong bg-surface-soft p-4">
          <CommentForm
            submitLabel="Publicar palavra"
            onCancel={() => setShowForm(false)}
            onSubmit={({ authorName, authorAvatar, text }) => {
              addComment({ storyId, authorName, authorAvatar, text });
              setShowForm(false);
              setPublished(true);
            }}
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <Action
            block
            size="md"
            onClick={() => {
              setPublished(false);
              setShowForm(true);
            }}
            aria-describedby={`${headingId}-hint`}
          >
            Deixar uma palavra de apoio
          </Action>
          <p
            id={`${headingId}-hint`}
            className="text-center text-xs leading-relaxed text-ink-muted"
          >
            Uma frase basta · {storyAuthorName} lê as palavras deste espaço
          </p>
          <p role="status" className="text-center text-xs text-ink-muted">
            {published ? "Sua palavra foi publicada." : ""}
          </p>
        </div>
      )}

      {total === 0 ? (
        !showForm && (
          <p className="rounded-xl border border-dashed border-line-strong bg-brand-wash px-4 py-3 text-sm text-ink-muted">
            Ainda não há palavras nesta história.
          </p>
        )
      ) : (
        <ul className="space-y-2.5">
          {tree.map(comment => (
            <li key={comment.id}>
              <CommentItem
                comment={comment}
                storyAuthorName={storyAuthorName}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
