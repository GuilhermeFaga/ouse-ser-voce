import { describe, expect, it } from "vitest";
import type { Comment } from "./types";
import { buildCommentTree, commentSubtreeIds, countComments } from "./comments";

let sequence = 0;
const comment = (overrides: Partial<Comment>): Comment => ({
  id: `c${sequence++}`,
  storyId: "story-1",
  authorName: "Ana",
  authorAvatar: "👩",
  text: "texto",
  createdAt: new Date(2024, 0, sequence).toISOString(),
  likedBy: [],
  authorId: null,
  parentId: null,
  ...overrides,
});

describe("árvore de comentários", () => {
  it("aninha respostas em qualquer profundidade", () => {
    const root = comment({ id: "root", createdAt: "2024-01-01T00:00:00.000Z" });
    const reply = comment({
      id: "reply",
      parentId: "root",
      createdAt: "2024-01-02T00:00:00.000Z",
    });
    const nested = comment({
      id: "nested",
      parentId: "reply",
      createdAt: "2024-01-03T00:00:00.000Z",
    });

    const tree = buildCommentTree([root, reply, nested], "story-1");

    expect(tree).toHaveLength(1);
    expect(tree[0].replies[0].id).toBe("reply");
    expect(tree[0].replies[0].replies[0].id).toBe("nested");
    expect(countComments(tree)).toBe(3);
  });

  it("ordena raízes do mais novo para o mais antigo e respostas do mais antigo", () => {
    const older = comment({
      id: "older",
      createdAt: "2024-01-01T00:00:00.000Z",
    });
    const newer = comment({
      id: "newer",
      createdAt: "2024-01-05T00:00:00.000Z",
    });
    const firstReply = comment({
      id: "first",
      parentId: "older",
      createdAt: "2024-01-02T00:00:00.000Z",
    });
    const secondReply = comment({
      id: "second",
      parentId: "older",
      createdAt: "2024-01-03T00:00:00.000Z",
    });

    const tree = buildCommentTree(
      [older, newer, secondReply, firstReply],
      "story-1"
    );

    expect(tree.map(node => node.id)).toEqual(["newer", "older"]);
    expect(tree[1].replies.map(node => node.id)).toEqual(["first", "second"]);
  });

  it("ignora comentários de outras histórias", () => {
    const here = comment({ id: "here" });
    const elsewhere = comment({ id: "elsewhere", storyId: "story-2" });
    expect(
      buildCommentTree([here, elsewhere], "story-1").map(n => n.id)
    ).toEqual(["here"]);
  });

  it("trata respostas órfãs como raízes", () => {
    const orphan = comment({ id: "orphan", parentId: "missing" });
    expect(buildCommentTree([orphan], "story-1").map(node => node.id)).toEqual([
      "orphan",
    ]);
  });

  it("lista a subárvore inteira para remoção", () => {
    const comments = [
      comment({ id: "root" }),
      comment({ id: "child", parentId: "root" }),
      comment({ id: "grandchild", parentId: "child" }),
      comment({ id: "unrelated" }),
    ];
    expect([...commentSubtreeIds(comments, "root")].sort()).toEqual([
      "child",
      "grandchild",
      "root",
    ]);
  });
});
