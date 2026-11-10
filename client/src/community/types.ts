export interface Comment {
  id: string;
  storyId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likedBy: string[];
  parentId: string | null;
}

export interface CommentNode extends Comment {
  replies: CommentNode[];
}
