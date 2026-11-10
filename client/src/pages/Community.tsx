import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock3, Heart, Share2, Shuffle, type LucideIcon } from "lucide-react";
import StoryCard from "@/community/StoryCard";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import {
  communityStories,
  sortStories,
  type CommunityStory,
  type StorySort,
} from "@/community/stories";
import { buildShareMessage, openWhatsApp } from "@/share/messages";
import { DAY_COUNT } from "@/journey";
import {
  Action,
  Card,
  CardTitle,
  focusRing,
  Pill,
  Screen,
  ScreenHeader,
} from "@/components/ds";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { id: StorySort; label: string; icon: LucideIcon }[] = [
  { id: "recent", label: "Recentes", icon: Clock3 },
  { id: "trending", label: "Mais curtidas", icon: Heart },
  { id: "random", label: "Aleatório", icon: Shuffle },
];

/** Real count, used instead of a wall of invented community stats. */
const FINISHED_COUNT = communityStories.filter(
  story => story.daysCompleted === DAY_COUNT
).length;

export default function Community() {
  const { state } = useApp();
  const { navigate } = useNavigation();
  const [sort, setSort] = useState<StorySort>("recent");
  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const stories = useMemo(
    () => sortStories(sort, state.storyLikes),
    [sort, state.storyLikes]
  );

  const handleShare = (story: CommunityStory) => {
    openWhatsApp(
      buildShareMessage({
        kind: "story",
        name: story.name,
        daysCompleted: story.daysCompleted,
      })
    );
  };

  return (
    <Screen>
      <ScreenHeader
        kicker="Mulheres que começaram como você"
        title="Comunidade"
        description={`${communityStories.length} histórias com o antes e o depois de cada uma. Abra uma, leia até o fim e deixe uma palavra de apoio.`}
        actions={
          <Pill tone="warm">
            {communityStories.length} histórias · {FINISHED_COUNT} chegaram ao
            dia {DAY_COUNT}
          </Pill>
        }
      />

      {/* One segmented control instead of three loose chips. */}
      <div
        role="group"
        aria-label="Ordenar histórias"
        className="flex gap-1 rounded-xl border border-line bg-surface-soft p-1"
      >
        {SORT_OPTIONS.map(option => {
          const Icon = option.icon;
          const selected = sort === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setSort(option.id)}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg px-1.5 text-[13px] font-medium transition-colors sm:px-2",
                focusRing,
                selected
                  ? "bg-white text-ink shadow-[0_1px_2px_rgba(44,24,16,0.04)]"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <Icon className="hidden h-3.5 w-3.5 sm:block" aria-hidden />
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.24,
              ease: "easeOut",
              delay: Math.min(index, 4) * 0.04,
            }}
          >
            <StoryCard
              story={story}
              expanded={openStoryId === story.id}
              onToggle={() =>
                setOpenStoryId(current =>
                  current === story.id ? null : story.id
                )
              }
              onShare={handleShare}
            />
          </motion.div>
        ))}
      </div>

      <Card tone="warm" className="space-y-3">
        <CardTitle>Sua história também entra aqui</CardTitle>
        <p className="text-sm leading-relaxed text-ink-soft">
          Você não precisa ter terminado os {DAY_COUNT} dias para contar. A tela
          de compartilhamento monta a mensagem com o que você já viveu e abre o
          WhatsApp — você escolhe o que enviar e para quem.
        </p>
        <Action
          block
          onClick={() => navigate("share")}
          icon={<Share2 className="h-4 w-4" aria-hidden />}
        >
          Compartilhar minha jornada
        </Action>
        <p className="text-center text-xs leading-relaxed text-ink-muted">
          Abre a tela de compartilhamento. Nada é publicado sem você enviar.
        </p>
      </Card>
    </Screen>
  );
}
