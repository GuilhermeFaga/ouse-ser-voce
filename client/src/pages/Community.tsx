import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users } from "lucide-react";
import StoryCard from "@/community/StoryCard";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import {
  communityStories,
  likeCount,
  sortStories,
  type CommunityStory,
  type StorySort,
} from "@/community/stories";
import { buildShareMessage, openWhatsApp } from "@/share/messages";
import { DAY_COUNT } from "@/journey";

const SORT_OPTIONS: { id: StorySort; label: string; icon: string }[] = [
  { id: "recent", label: "Recentes", icon: "📅" },
  { id: "trending", label: "Mais Curtidas", icon: "❤️" },
  { id: "random", label: "Aleatório", icon: "✨" },
];

export default function Community() {
  const { state } = useApp();
  const { navigate } = useNavigation();
  const [sort, setSort] = useState<StorySort>("recent");
  const stories = useMemo(
    () => sortStories(sort, state.storyLikes),
    [sort, state.storyLikes]
  );

  const handleShare = (story: CommunityStory) => {
    openWhatsApp(buildShareMessage({ kind: "story", name: story.name }));
  };

  const stats = [
    {
      label: "Mulheres na Comunidade",
      value: communityStories.length,
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Jornadas Completas",
      value: communityStories.filter(story => story.daysCompleted === DAY_COUNT)
        .length,
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      label: "Transformações Compartilhadas",
      value: communityStories.reduce(
        (sum, story) => sum + likeCount(story, state.storyLikes),
        0
      ),
      icon: <Heart className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#2C1810] mb-1">
          Nossa Comunidade
        </h1>
        <p className="text-[#8B6E5A] text-sm">
          Histórias reais de mulheres que se reconectaram consigo mesmas
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-[#F5EDE8] to-[#FAF6F1] rounded-2xl border border-[#E8D5CC] p-4 text-center flex sm:flex-col items-center sm:items-center gap-3 sm:gap-0"
          >
            <div className="flex justify-center sm:mb-2 text-[#C4856A]">
              {stat.icon}
            </div>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#C4856A] sm:mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-[#8B6E5A] leading-tight">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-[#F5EDE8] via-[#FAF6F1] to-[#F5EDE8] rounded-2xl border border-[#E8D5CC] p-6"
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">🌸</div>
          <div>
            <p className="font-semibold text-[#2C1810] mb-1">
              Você não está sozinha nessa jornada
            </p>
            <p className="text-sm text-[#6B4C3B] leading-relaxed">
              Cada mulher aqui passou pelo que você está passando. Cada história
              é uma prova de que a transformação é possível. Leia, inspire-se e
              saiba que você também é capaz de se reconectar consigo mesma.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {SORT_OPTIONS.map(option => (
          <button
            key={option.id}
            onClick={() => setSort(option.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all flex items-center gap-2 ${
              sort === option.id
                ? "bg-[#C4856A] text-white shadow-md"
                : "bg-[#F5EDE8] text-[#6B4C3B] hover:bg-[#E8D5CC]"
            }`}
          >
            <span>{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <StoryCard story={story} onShare={handleShare} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-[#C4856A] to-[#B07055] rounded-2xl p-6 text-white text-center"
      >
        <p className="font-serif text-lg mb-2">Sua história também importa</p>
        <p className="text-sm text-white/90 mb-4">
          Quando você compartilha sua transformação, você inspira outras
          mulheres a começarem a sua própria jornada.
        </p>
        <button
          onClick={() => navigate("share")}
          className="bg-white text-[#C4856A] px-6 py-2 rounded-xl font-semibold hover:bg-[#F5EDE8] transition-colors"
        >
          Compartilhe sua história
        </button>
      </motion.div>

      <div className="bg-[#F5EDE8] rounded-2xl border border-[#E8D5CC] p-5">
        <p className="text-xs font-semibold text-[#8B6E5A] uppercase tracking-wide mb-3">
          Princípios da Comunidade
        </p>
        <div className="space-y-2">
          {[
            "🤝 Respeito e acolhimento para todas",
            "🌱 Celebramos todas as etapas da jornada",
            "💪 Sem julgamentos, apenas apoio",
            "🌸 Histórias reais, transformações genuínas",
          ].map(principle => (
            <p key={principle} className="text-sm text-[#6B4C3B]">
              {principle}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
