import { useState, useCallback } from "react";

export interface FavoriteAudio {
  day: number;
  title: string;
  addedAt: string;
}

const STORAGE_KEY = "ouse-ser-voce-favorite-audios";

function loadFavorites(): FavoriteAudio[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteAudio[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavoriteAudios() {
  const [favorites, setFavorites] = useState<FavoriteAudio[]>(loadFavorites);

  const isFavorite = useCallback(
    (day: number) => favorites.some((f) => f.day === day),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (day: number, title: string) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.day === day);
        let updated: FavoriteAudio[];
        if (exists) {
          updated = prev.filter((f) => f.day !== day);
        } else {
          updated = [...prev, { day, title, addedAt: new Date().toISOString() }];
        }
        saveFavorites(updated);
        return updated;
      });
    },
    []
  );

  const removeFavorite = useCallback((day: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.day !== day);
      saveFavorites(updated);
      return updated;
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
