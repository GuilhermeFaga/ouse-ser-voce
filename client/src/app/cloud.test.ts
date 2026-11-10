import { describe, expect, it } from "vitest";
import {
  CLOUD_SCHEMA_VERSION,
  cloudStateFor,
  mergeStates,
  planLink,
  readCloudState,
} from "./cloud";
import { createDefaultState } from "./persist";
import { createDayRecord, type AppState, type Comment } from "./state";

const stateWith = (patch: Partial<AppState>): AppState => ({
  ...createDefaultState(),
  ...patch,
});

/** The document shape Firestore hands back, with map keys already strings. */
const cloudDoc = (state: AppState, overrides: Record<string, unknown> = {}) =>
  JSON.parse(
    JSON.stringify({
      schemaVersion: CLOUD_SCHEMA_VERSION,
      revision: "revision-1",
      state: cloudStateFor(state),
      ...overrides,
    })
  );

const comment = (patch: Partial<Comment> = {}): Comment => ({
  id: "comment-1",
  storyId: "story-1",
  authorName: "Ana",
  authorAvatar: "🌿",
  text: "isso me ajudou",
  createdAt: "2024-03-01T12:00:00.000Z",
  likedBy: [],
  authorId: null,
  parentId: null,
  ...patch,
});

describe("leitura do documento na nuvem", () => {
  it("restaura o registro gravado, inclusive com as chaves de mapa em texto", () => {
    const remote = stateWith({
      onboardingComplete: true,
      userName: "Marina",
      days: {
        1: {
          ...createDayRecord(1),
          notes: "primeiro dia",
          completedAt: "2024-03-01T20:00:00.000Z",
        },
      },
      unlockedAchievements: ["first-day"],
    });

    const read = readCloudState(cloudDoc(remote));

    expect(read?.userName).toBe("Marina");
    expect(read?.days[1]).toMatchObject({
      day: 1,
      notes: "primeiro dia",
      completedAt: "2024-03-01T20:00:00.000Z",
    });
    expect(read?.unlockedAchievements).toEqual(["first-day"]);
  });

  it("recusa documento de outra versão e normaliza campos corrompidos", () => {
    const state = cloudStateFor(createDefaultState());

    expect(readCloudState(null)).toBeNull();
    expect(
      readCloudState({
        schemaVersion: CLOUD_SCHEMA_VERSION + 1,
        state,
      })
    ).toBeNull();
    expect(readCloudState({ schemaVersion: CLOUD_SCHEMA_VERSION })).toBeNull();

    const partial = readCloudState({
      schemaVersion: CLOUD_SCHEMA_VERSION,
      state: { ...state, days: "quebrado", notes: "quebrado" },
    });
    expect(partial).not.toBeNull();
    expect(partial?.days).toEqual({});
    expect(partial?.notes).toEqual([]);
  });

  it("remove campos opcionais vazios antes de gravar (o Firestore os rejeita)", () => {
    const payload = cloudStateFor(
      stateWith({
        days: {
          1: { ...createDayRecord(1), completedAt: null, updatedAt: undefined },
        },
      })
    );

    expect("updatedAt" in payload.days[1]).toBe(false);
    expect(payload.days[1].completedAt).toBeNull();
  });
});

describe("junção de um aparelho com a conta", () => {
  it("mantém o texto dos dois lados, a conclusão e a data de início mais antiga", () => {
    const local = stateWith({
      onboardingComplete: true,
      userName: "Ana",
      startDate: "2024-03-01T10:00:00.000Z",
      days: {
        1: {
          ...createDayRecord(1),
          notes: "escrito aqui",
          completedAt: "2024-03-01T20:00:00.000Z",
        },
      },
      notes: [
        {
          id: "note-local",
          title: "Aqui",
          content: "a",
          createdAt: "2024-03-02T10:00:00.000Z",
          updatedAt: "2024-03-02T10:00:00.000Z",
        },
      ],
      unlockedAchievements: ["first-day"],
      favoriteAudioDays: [2],
    });

    const remote = stateWith({
      onboardingComplete: true,
      userName: "Ana Maria",
      startDate: "2024-02-01T10:00:00.000Z",
      days: {
        // Newer, but empty: the text from this device must survive.
        1: {
          ...createDayRecord(1),
          notes: "",
          prompts: { p0: "resposta da nuvem" },
          updatedAt: "2024-04-01T10:00:00.000Z",
        },
        4: {
          ...createDayRecord(4),
          completedAt: "2024-02-04T20:00:00.000Z",
          notes: "quarto dia",
        },
      },
      notes: [
        {
          id: "note-cloud",
          title: "Nuvem",
          content: "b",
          createdAt: "2024-02-02T10:00:00.000Z",
          updatedAt: "2024-02-02T10:00:00.000Z",
        },
      ],
      unlockedAchievements: ["week-one"],
      favoriteAudioDays: [4],
    });

    const merged = mergeStates(local, remote);

    expect(merged.days[1].notes).toBe("escrito aqui");
    expect(merged.days[1].prompts.p0).toBe("resposta da nuvem");
    expect(merged.days[1].completedAt).toBe("2024-03-01T20:00:00.000Z");
    expect(merged.days[4].completedAt).toBe("2024-02-04T20:00:00.000Z");
    expect(merged.startDate).toBe("2024-02-01T10:00:00.000Z");
    expect(merged.userName).toBe("Ana");
    expect(merged.notes.map(note => note.id).sort()).toEqual([
      "note-cloud",
      "note-local",
    ]);
    expect(merged.unlockedAchievements.sort()).toEqual([
      "first-day",
      "week-one",
    ]);
    expect(merged.favoriteAudioDays).toEqual([2, 4]);
  });

  it("assume a identidade da conta e remapeia o que foi escrito antes de entrar", () => {
    const local = stateWith({
      userId: "device-id",
      onboardingComplete: true,
      comments: [comment({ authorId: "device-id", likedBy: ["device-id"] })],
      storyLikes: { "story-1": ["device-id"] },
    });
    const remote = stateWith({
      userId: "google-id",
      onboardingComplete: true,
      days: {
        2: { ...createDayRecord(2), completedAt: "2024-03-02T20:00:00.000Z" },
      },
    });

    const merged = mergeStates(local, remote);

    expect(merged.userId).toBe("google-id");
    expect(merged.comments[0].authorId).toBe("google-id");
    expect(merged.comments[0].likedBy).toEqual(["google-id"]);
    expect(merged.storyLikes["story-1"]).toEqual(["google-id"]);
    expect(merged.days[2].completedAt).toBe("2024-03-02T20:00:00.000Z");
  });
});

describe("primeira conexão do aparelho com a conta", () => {
  const empty = createDefaultState();
  const deviceRecord = stateWith({
    onboardingComplete: true,
    days: {
      1: { ...createDayRecord(1), completedAt: "2024-03-01T20:00:00.000Z" },
    },
  });
  const accountRecord = stateWith({
    userId: "account-id",
    onboardingComplete: true,
    days: {
      2: { ...createDayRecord(2), completedAt: "2024-02-02T20:00:00.000Z" },
    },
  });
  const cleared = {
    ...createDefaultState(),
    updatedAt: "2024-03-05T10:00:00.000Z",
  };

  const cases = [
    {
      name: "aparelho novo adota o registro da conta",
      local: empty,
      remote: accountRecord,
      cleanCache: false,
      clearPending: false,
      kind: "adopt",
    },
    {
      name: "conta nova recebe o registro do aparelho",
      local: deviceRecord,
      remote: null,
      cleanCache: false,
      clearPending: false,
      kind: "push",
    },
    {
      name: "os dois registros se juntam",
      local: deviceRecord,
      remote: accountRecord,
      cleanCache: false,
      clearPending: false,
      kind: "merge",
    },
    {
      name: "cache limpo apenas escuta a conta",
      local: deviceRecord,
      remote: accountRecord,
      cleanCache: true,
      clearPending: false,
      kind: "adopt",
    },
    {
      name: "apagar conectada vence a cópia da nuvem",
      local: cleared,
      remote: accountRecord,
      cleanCache: false,
      clearPending: true,
      kind: "push",
    },
    {
      name: "apagar desconectada deixa a conta voltar",
      local: cleared,
      remote: accountRecord,
      cleanCache: false,
      clearPending: false,
      kind: "adopt",
    },
    {
      name: "sem registro e sem conta, nada é escrito",
      local: empty,
      remote: null,
      cleanCache: false,
      clearPending: false,
      kind: "idle",
    },
  ];

  it.each(cases)(
    "$name",
    ({ local, remote, cleanCache, clearPending, kind }) => {
      const plan = planLink(local, remote, { cleanCache, clearPending });
      expect(plan.kind).toBe(kind);
      if (plan.kind === "adopt") expect(plan.state).toBe(remote);
      if (plan.kind === "push") expect(plan.state).toBe(local);
    }
  );
});
