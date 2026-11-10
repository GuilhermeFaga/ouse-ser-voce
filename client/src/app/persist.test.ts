import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearAllData, loadState, saveState } from "./persist";

const store = new Map<string, string>();

const localStorageStub = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => {
    store.set(key, value);
  },
  removeItem: (key: string) => {
    store.delete(key);
  },
  clear: () => store.clear(),
  key: (index: number) => [...store.keys()][index] ?? null,
  get length() {
    return store.size;
  },
};

const STATE_KEY = "ouse-ser-voce-state";
const AUDIO_PROGRESS_KEY = "ouse-audio-progress";

beforeEach(() => {
  store.clear();
  vi.stubGlobal("localStorage", localStorageStub);
});

const legacyState = {
  userName: "Marina",
  onboardingComplete: true,
  currentDay: 3,
  startDate: "2024-02-01T10:00:00.000Z",
  completedDays: [1, 2],
  checkins: {
    1: {
      dayNumber: 1,
      completedAt: "2024-02-01T20:00:00.000Z",
      mood: 4,
      notes: "anotação do check-in",
      exerciseCompleted: true,
      meditationListened: true,
    },
    2: {
      dayNumber: 2,
      completedAt: "2024-02-02T20:00:00.000Z",
      mood: 2,
      notes: "",
      exerciseCompleted: false,
      meditationListened: false,
    },
  },
  journalEntries: [
    {
      id: "journal-1",
      date: "Thu Feb 01 2024",
      dayNumber: 1,
      mood: 4,
      text: "texto do diário",
      prompts: { p0: "resposta" },
      createdAt: "2024-02-01T20:00:00.000Z",
    },
  ],
  scannerResult: {
    completedAt: "2024-02-01T12:00:00.000Z",
    answers: { id1: 3, em1: 5 },
    percentages: { identidade: 60 },
    totalScore: 60,
    abandonmentLevel: 40,
    abandonmentLabel: "Moderado",
    criticalArea: "identidade",
    criticalAreaName: "Identidade",
    explanation: "",
    recommendation: "",
  },
  unlockedAchievements: ["first-day"],
};

describe("persistência", () => {
  it("migra o formato antigo preservando o progresso", () => {
    store.set(STATE_KEY, JSON.stringify(legacyState));

    const state = loadState();

    expect(state.version).toBe(2);
    expect(state.userName).toBe("Marina");
    expect(state.startDate).toBe(legacyState.startDate);
    expect(Object.keys(state.days).sort()).toEqual(["1", "2"]);
    expect(state.days[1].completedAt).toBe("2024-02-01T20:00:00.000Z");
    expect(state.days[1].exerciseCompleted).toBe(true);
    expect(state.days[2].mood).toBe(2);
    expect(state.unlockedAchievements).toEqual(["first-day"]);
    expect(state.scanner).toEqual({
      answers: { id1: 3, em1: 5 },
      completedAt: "2024-02-01T12:00:00.000Z",
    });
  });

  it("mantém as duas cópias do texto livre quando elas divergem", () => {
    store.set(STATE_KEY, JSON.stringify(legacyState));

    const state = loadState();

    expect(state.days[1].notes).toBe("anotação do check-in\n\ntexto do diário");
    expect(state.days[1].prompts).toEqual({ p0: "resposta" });
  });

  it("não duplica o texto quando o diário apenas repetia o check-in", () => {
    store.set(
      STATE_KEY,
      JSON.stringify({
        ...legacyState,
        journalEntries: [
          { ...legacyState.journalEntries[0], text: "anotação do check-in" },
        ],
      })
    );

    expect(loadState().days[1].notes).toBe("anotação do check-in");
  });

  it("recupera a conclusão a partir de completedDays quando falta o check-in", () => {
    store.set(
      STATE_KEY,
      JSON.stringify({ ...legacyState, checkins: {}, journalEntries: [] })
    );

    const state = loadState();

    expect(state.days[1].completedAt).toBe(legacyState.startDate);
    expect(state.days[2].completedAt).toBe(legacyState.startDate);
  });

  it("adota as chaves antigas separadas e o identificador em texto puro", () => {
    store.set(STATE_KEY, JSON.stringify(legacyState));
    store.set("ouse-user-id", "user-123");
    store.set(
      "ouse-ser-voce-favorite-audios",
      JSON.stringify([{ day: 7, title: "x", addedAt: "2024-01-01" }])
    );
    store.set(
      "ouse-story-likes",
      JSON.stringify([{ storyId: "story-1", likedBy: ["user-123"] }])
    );
    store.set(
      "ouse-comments",
      JSON.stringify([
        {
          id: "c1",
          storyId: "story-1",
          authorName: "Ana",
          authorAvatar: "👩",
          text: "oi",
          createdAt: "2024-01-01T00:00:00.000Z",
          likes: 1,
          isApproved: true,
          likedBy: ["user-123"],
          parentCommentId: "c0",
        },
      ])
    );

    const state = loadState();

    expect(state.userId).toBe("user-123");
    expect(state.favoriteAudioDays).toEqual([7]);
    expect(state.storyLikes).toEqual({ "story-1": ["user-123"] });
    expect(state.comments[0]).toMatchObject({
      id: "c1",
      parentId: "c0",
      likedBy: ["user-123"],
    });
  });

  it("só apaga as chaves antigas depois de gravar com sucesso", () => {
    store.set(STATE_KEY, JSON.stringify(legacyState));
    store.set("ouse-comments", "[]");

    const state = loadState();
    const setItem = vi
      .spyOn(localStorageStub, "setItem")
      .mockImplementation(() => {
        throw new Error("quota");
      });

    expect(saveState(state)).toBe(false);
    expect(store.has("ouse-comments")).toBe(true);

    setItem.mockRestore();
    expect(saveState(state)).toBe(true);
    expect(store.has("ouse-comments")).toBe(false);
  });

  it("relê o próprio formato sem perder campos", () => {
    store.set(STATE_KEY, JSON.stringify(legacyState));
    const first = loadState();
    saveState(first);

    expect(loadState()).toEqual(first);
  });

  it("zera todos os dados conhecidos", () => {
    store.set(STATE_KEY, JSON.stringify(legacyState));
    store.set(AUDIO_PROGRESS_KEY, JSON.stringify({ 1: 30 }));

    clearAllData();

    expect(store.size).toBe(0);
  });
});
