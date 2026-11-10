import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";
import { useApp } from "@/app/store";
import { DAY_COUNT, moodEmoji, moodLabel } from "@/journey";
import { Card, focusRing, Pill } from "@/components/ds";
import { cn } from "@/lib/utils";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import { buildCommentTree, countComments } from "./comments";
import { likeCount, type CommunityStory } from "./stories";

interface StoryCardProps {
  story: CommunityStory;
  expanded: boolean;
  onToggle: () => void;
  onShare: (story: CommunityStory) => void;
}

export default function StoryCard({
  story,
  expanded,
  onToggle,
  onShare,
}: StoryCardProps) {
  const { state, toggleStoryLike } = useApp();

  const likedBy = state.storyLikes[story.id] ?? [];
  const isLiked = likedBy.includes(state.userId);
  const finished = story.daysCompleted >= DAY_COUNT;
  const supportCount = countComments(
    buildCommentTree(state.comments, story.id)
  );
  const bodyId = `story-${story.id}-body`;

  // The emoji pair is visual only; assistive tech gets the same contrast in words.
  const contrastSentence = `${story.name} começou no nível ${story.moodBefore} de 5, ${moodLabel(story.moodBefore).toLowerCase()}, e chegou ao nível ${story.moodAfter} de 5, ${moodLabel(story.moodAfter).toLowerCase()}.`;

  return (
    <Card as="article" padding="none" clip>
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-soft text-xl"
            aria-hidden
          >
            {story.avatar}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {story.name}, {story.age}
            </p>
            <p className="truncate text-xs text-ink-muted">{story.role}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Pill tone={finished ? "brand" : "neutral"}>
              {story.daysCompleted} de {DAY_COUNT} dias
            </Pill>
            <p className="text-[11px] text-ink-subtle">{story.timestamp}</p>
          </div>
        </div>

        {/* The proof of the screen: where she started, where she is now. */}
        <div>
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl border border-line bg-surface-soft p-2"
            aria-hidden
          >
            <div className="rounded-lg bg-white px-2.5 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Antes
              </p>
              <p className="mt-1 flex items-center gap-1.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-soft text-sm">
                  {moodEmoji(story.moodBefore)}
                </span>
                <span className="text-xs font-medium text-ink-muted">
                  {moodLabel(story.moodBefore)}
                </span>
              </p>
              <p className="mt-1 text-[11px] tabular-nums text-ink-muted">
                {story.moodBefore} de 5
              </p>
            </div>

            <ArrowRight className="h-4 w-4 text-ink-subtle" aria-hidden />

            <div className="rounded-lg border border-brand/30 bg-brand-wash px-2.5 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                Depois
              </p>
              <p className="mt-1 flex items-center gap-1.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm">
                  {moodEmoji(story.moodAfter)}
                </span>
                <span className="text-xs font-semibold text-ink">
                  {moodLabel(story.moodAfter)}
                </span>
              </p>
              <p className="mt-1 text-[11px] font-medium tabular-nums text-ink">
                {story.moodAfter} de 5
              </p>
            </div>
          </div>
          <p className="sr-only">{contrastSentence}</p>
        </div>

        <p className="font-serif text-[17px] italic leading-relaxed text-ink sm:text-lg">
          “{story.quote}”
        </p>

        <p className="text-sm leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">O que mudou: </span>
          {story.mainTransformation}
        </p>
      </div>

      {expanded && (
        <motion.div
          id={bodyId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="overflow-hidden border-t border-line"
        >
          <div className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                A história completa
              </h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                {story.fullStory}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                O que mudou, em concreto
              </h3>
              <ul className="space-y-1.5">
                {story.highlights.map(highlight => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                      aria-hidden
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {story.achievements.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  Etapas concluídas
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {story.achievements.map(achievement => (
                    <Pill key={achievement}>{achievement}</Pill>
                  ))}
                </div>
              </div>
            )}

            <CommentsSection storyId={story.id} storyAuthorName={story.name} />
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-2 border-t border-line px-4 py-2.5 sm:px-5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={bodyId}
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-xl px-1 text-sm font-medium text-brand transition-colors hover:text-brand-strong",
            focusRing
          )}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden />
          )}
          {expanded ? "Recolher história" : "Ler a história completa"}
        </button>

        <div className="flex items-center gap-1">
          {supportCount > 0 && (
            <p className="mr-1 text-[11px] tabular-nums text-ink-muted">
              {supportCount} {supportCount === 1 ? "palavra" : "palavras"}
            </p>
          )}
          <LikeButton
            likes={likeCount(story, state.storyLikes)}
            isLiked={isLiked}
            onToggle={() => toggleStoryLike(story.id)}
            label={`Curtir a história de ${story.name}, ${likeCount(story, state.storyLikes)} ${likeCount(story, state.storyLikes) === 1 ? "curtida" : "curtidas"}`}
            size="sm"
          />
          <button
            type="button"
            onClick={() => onShare(story)}
            aria-label={`Compartilhar a história de ${story.name} no WhatsApp`}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-soft hover:text-brand",
              focusRing
            )}
          >
            <Share2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </Card>
  );
}
