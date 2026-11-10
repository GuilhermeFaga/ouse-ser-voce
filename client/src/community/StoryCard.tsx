import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { useApp } from "@/app/store";
import { DAY_COUNT, moodEmoji } from "@/journey";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";
import { likeCount, type CommunityStory } from "./stories";

interface StoryCardProps {
  story: CommunityStory;
  onShare: (story: CommunityStory) => void;
}

export default function StoryCard({ story, onShare }: StoryCardProps) {
  const { state, toggleStoryLike } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  const likedBy = state.storyLikes[story.id] ?? [];
  const isLiked = likedBy.includes(state.userId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-[#F0E4DC]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#F5EDE8] flex items-center justify-center text-2xl flex-shrink-0">
              {story.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#2C1810] text-sm">
                {story.name}
              </p>
              <p className="text-xs text-[#8B6E5A]">{story.role}</p>
              <p className="text-xs text-[#B08070] mt-0.5">{story.timestamp}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold text-[#C4856A]">
              {story.daysCompleted}/{DAY_COUNT}
            </p>
            <p className="text-xs text-[#8B6E5A]">dias</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-3 bg-[#F5EDE8] rounded-lg p-2">
          <div className="text-center flex-1">
            <p className="text-xs text-[#8B6E5A] mb-1">Antes</p>
            <p className="text-lg">{moodEmoji(story.moodBefore)}</p>
          </div>
          <div className="text-[#C4856A]">→</div>
          <div className="text-center flex-1">
            <p className="text-xs text-[#8B6E5A] mb-1">Depois</p>
            <p className="text-lg">{moodEmoji(story.moodAfter)}</p>
          </div>
        </div>

        <p className="font-serif text-base text-[#2C1810] italic leading-relaxed">
          "{story.quote}"
        </p>
      </div>

      <div className="px-5 py-4 bg-gradient-to-r from-[#F5EDE8] to-[#FAF6F1] border-b border-[#E8D5CC]">
        <p className="text-sm font-semibold text-[#C4856A] mb-1">
          Sua transformação
        </p>
        <p className="text-sm text-[#2C1810] leading-relaxed">
          {story.mainTransformation}
        </p>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-[#F0E4DC]"
        >
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-[#8B6E5A] uppercase tracking-wide mb-2">
                Sua história
              </p>
              <p className="text-sm text-[#4A3728] leading-relaxed">
                {story.fullStory}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#8B6E5A] uppercase tracking-wide mb-2">
                Destaques
              </p>
              <div className="space-y-2">
                {story.highlights.map(highlight => (
                  <div key={highlight} className="flex items-start gap-2">
                    <span className="text-[#C4856A] font-bold mt-0.5">✓</span>
                    <p className="text-sm text-[#4A3728]">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            {story.achievements.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#8B6E5A] uppercase tracking-wide mb-2">
                  Conquistas
                </p>
                <div className="flex flex-wrap gap-2">
                  {story.achievements.map(achievement => (
                    <span
                      key={achievement}
                      className="inline-block px-3 py-1 bg-[#F5EDE8] border border-[#E8D5CC] rounded-full text-xs text-[#6B4C3B]"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-5 pb-5">
            <CommentsSection storyId={story.id} storyAuthorName={story.name} />
          </div>
        </motion.div>
      )}

      <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-[#F0E4DC] flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm text-[#C4856A] hover:text-[#B07055] transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Ver história completa
            </>
          )}
        </button>

        <div className="flex items-center gap-3">
          <LikeButton
            likes={likeCount(story, state.storyLikes)}
            isLiked={isLiked}
            onToggle={() => toggleStoryLike(story.id)}
            size="sm"
          />
          <button
            onClick={() => onShare(story)}
            className="flex items-center gap-1 text-sm text-[#B08070] hover:text-[#C4856A] transition-colors"
            title="Compartilhar no WhatsApp"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
