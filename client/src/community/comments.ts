import type { Comment, CommentNode } from "./types";

const byNewest = (a: Comment, b: Comment) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const byOldest = (a: Comment, b: Comment) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

function sortReplies(node: CommentNode) {
  node.replies.sort(byOldest);
  for (const reply of node.replies) sortReplies(reply);
}

export function buildCommentTree(
  comments: Comment[],
  storyId: string
): CommentNode[] {
  const nodes = new Map<string, CommentNode>();
  for (const comment of comments) {
    if (comment.storyId !== storyId) continue;
    nodes.set(comment.id, { ...comment, replies: [] });
  }

  const roots: CommentNode[] = [];
  for (const node of Array.from(nodes.values())) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined;
    if (parent) parent.replies.push(node);
    else roots.push(node);
  }

  roots.sort(byNewest);
  for (const root of roots) sortReplies(root);
  return roots;
}

export function countComments(nodes: CommentNode[]): number {
  return nodes.reduce(
    (total, node) => total + 1 + countComments(node.replies),
    0
  );
}

export function commentSubtreeIds(
  comments: Comment[],
  rootId: string
): Set<string> {
  const ids = new Set<string>([rootId]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const comment of comments) {
      if (
        comment.parentId &&
        ids.has(comment.parentId) &&
        !ids.has(comment.id)
      ) {
        ids.add(comment.id);
        grew = true;
      }
    }
  }
  return ids;
}
