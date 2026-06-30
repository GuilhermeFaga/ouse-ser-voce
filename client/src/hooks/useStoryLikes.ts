// Hook para gerenciar likes nas histórias da comunidade
// Rastreia quem curtiu para evitar duplicatas

import { useState, useEffect } from "react";

interface StoryLike {
  storyId: string;
  likedBy: string[];
  totalLikes: number;
  lastUpdated: number;
}

const STORAGE_KEY = "ouse-story-likes";
const USER_ID_KEY = "ouse-user-id";

// Gerar ID único para o usuário
const getUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = "user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

export function useStoryLikes(storyId: string) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  // Carregar likes ao montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allLikes: StoryLike[] = stored ? JSON.parse(stored) : [];
      const storyLikes = allLikes.find((l) => l.storyId === storyId);

      if (storyLikes) {
        setLikes(storyLikes.totalLikes);
        setIsLiked(storyLikes.likedBy.includes(userId));
      } else {
        setLikes(0);
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Erro ao carregar likes:", error);
    }
    setLoading(false);
  }, [storyId, userId]);

  // Toggle like
  const toggleLike = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let allLikes: StoryLike[] = stored ? JSON.parse(stored) : [];

      let storyLikes = allLikes.find((l) => l.storyId === storyId);

      if (!storyLikes) {
        storyLikes = {
          storyId,
          likedBy: [],
          totalLikes: 0,
          lastUpdated: Date.now(),
        };
        allLikes.push(storyLikes);
      }

      if (storyLikes.likedBy.includes(userId)) {
        // Remover like
        storyLikes.likedBy = storyLikes.likedBy.filter((id) => id !== userId);
        storyLikes.totalLikes = Math.max(0, storyLikes.totalLikes - 1);
        setIsLiked(false);
        setLikes(storyLikes.totalLikes);
      } else {
        // Adicionar like
        storyLikes.likedBy.push(userId);
        storyLikes.totalLikes += 1;
        setIsLiked(true);
        setLikes(storyLikes.totalLikes);
      }

      storyLikes.lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allLikes));
    } catch (error) {
      console.error("Erro ao atualizar like:", error);
    }
  };

  return { likes, isLiked, loading, toggleLike };
}
