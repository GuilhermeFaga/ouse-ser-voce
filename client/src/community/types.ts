export interface Comment {
  id: string;
  storyId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likedBy: string[];
  /** Whose device wrote it; older comments have none and are not deletable here. */
  authorId: string | null;
  parentId: string | null;
}

export interface CommentNode extends Comment {
  replies: CommentNode[];
}
