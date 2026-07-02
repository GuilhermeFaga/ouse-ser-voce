// OUSE SER VOCÊ – Comments Hook
// Gerencia comentários nas histórias da comunidade com respostas aninhadas

import { useState, useEffect } from "react";

export interface Comment {
  id: string;
  storyId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
  likedBy?: string[]; // Rastrear quem curtiu para evitar duplicatas
  isApproved: boolean;
  parentCommentId?: string;
  replies?: Comment[];
}

const STORAGE_KEY = "ouse-comments";

export function useComments(storyId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Organizar comentários em árvore (pai + respostas)
  const organizeComments = (allComments: Comment[]): Comment[] => {
    const storyComments = allComments.filter(
      (c: Comment) => c.storyId === storyId && !c.parentCommentId
    );
    return storyComments
      .map((comment: Comment) => ({
        ...comment,
        replies: allComments
          .filter((c: Comment) => c.parentCommentId === comment.id)
          .sort(
            (a: Comment, b: Comment) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
      }))
      .sort(
        (a: Comment, b: Comment) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  };

  // Carregar comentários do localStorage
  useEffect(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allComments = stored ? JSON.parse(stored) : [];
      setComments(organizeComments(allComments));
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    }
    setLoading(false);
  }, [storyId]);

  // Adicionar novo comentário ou resposta
  const addComment = (
    authorName: string,
    authorAvatar: string,
    text: string,
    parentCommentId?: string
  ) => {
    if (!text.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      storyId,
      authorName,
      authorAvatar,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isApproved: true,
      parentCommentId,
      replies: [],
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allComments = stored ? JSON.parse(stored) : [];
      allComments.push(newComment);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));

      setComments(organizeComments(allComments));
    } catch (error) {
      console.error("Erro ao salvar comentário:", error);
    }
  };

  // Remover comentário e suas respostas
  const removeComment = (commentId: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allComments = stored ? JSON.parse(stored) : [];

      // Remover comentário e todas as suas respostas
      const filtered = allComments.filter(
        (c: Comment) => c.id !== commentId && c.parentCommentId !== commentId
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      setComments(organizeComments(filtered));
    } catch (error) {
      console.error("Erro ao remover comentário:", error);
    }
  };

  // Curtir comentário (evitar duplicatas)
  const likeComment = (
    commentId: string,
    userId: string = "user-" + Date.now()
  ) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allComments = stored ? JSON.parse(stored) : [];
      const updated = allComments.map((c: Comment) => {
        if (c.id === commentId) {
          const likedBy = c.likedBy || [];
          if (!likedBy.includes(userId)) {
            return { ...c, likes: c.likes + 1, likedBy: [...likedBy, userId] };
          }
          return c;
        }
        return c;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setComments(organizeComments(updated));
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
