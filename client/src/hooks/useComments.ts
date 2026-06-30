// OUSE SER VOCÊ – Comments Hook
// Gerencia comentários nas histórias da comunidade com persistência em localStorage

import { useState, useEffect } from "react";

export interface Comment {
  id: string;
  storyId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
  isApproved: boolean;
}

const STORAGE_KEY = "ouse-comments";

export function useComments(storyId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar comentários do localStorage
  useEffect(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allComments = stored ? JSON.parse(stored) : [];
      const storyComments = allComments.filter((c: Comment) => c.storyId === storyId);
      setComments(storyComments.sort((a: Comment, b: Comment) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
    setLoading(false);
  }, [storyId]);

  // Adicionar novo comentário
  const addComment = (authorName: string, authorAvatar: string, text: string) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      storyId,
      authorName,
      authorAvatar,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isApproved: true, // Em produção, isso seria moderado
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allComments = stored ? JSON.parse(stored) : [];
      allComments.push(newComment);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));

      setComments([newComment, ...comments]);
    } catch (error) {
      console.error("Erro ao salvar comentário:", error);
    }
  };

  // Remover comentário
  const removeComment = (commentId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allComments = stored ? JSON.parse(stored) : [];
      const filtered = allComments.filter((c: Comment) => c.id !== commentId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error("Erro ao remover comentário:", error);
    }
  };

  // Curtir comentário
  const likeComment = (commentId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allComments = stored ? JSON.parse(stored) : [];
      const updated = allComments.map((c: Comment) =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setComments(comments.map(c =>
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      ));
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
    }
  };

  return {
    comments,
    loading,
    addComment,
    removeComment,
    likeComment,
  };
}
