import { describe, expect, it } from "vitest";
import {
  completedDaysOf,
  createDayRecord,
  hasWriting,
  withoutUnreachableCompletions,
  writtenDaysOf,
  type AppState,
  type DayRecord,
} from "./state";
import { createDefaultState } from "./persist";

const stateWith = (days: AppState["days"]): AppState => ({
  ...createDefaultState(),
  days,
});

describe("estado do dia", () => {
  it("começa sem notas, sem humor negativo e sem conclusão", () => {
    expect(createDayRecord(5)).toEqual({
      day: 5,
      mood: 3,
      notes: "",
      prompts: {},
      exerciseCompleted: false,
      meditationListened: false,
      completedAt: null,
    });
  });

  it("deriva os dias concluídos do registro do dia", () => {
    const state = stateWith({
      1: { ...createDayRecord(1), completedAt: "2024-01-01T00:00:00.000Z" },
      2: createDayRecord(2),
      3: { ...createDayRecord(3), completedAt: "2024-01-03T00:00:00.000Z" },
    });
    expect(completedDaysOf(state)).toEqual([1, 3]);
  });

  it("considera escrito o dia com notas ou com resposta a um prompt", () => {
    expect(hasWriting(createDayRecord(1))).toBe(false);
    expect(hasWriting({ ...createDayRecord(1), notes: "  " })).toBe(false);
    expect(hasWriting({ ...createDayRecord(1), notes: "hoje" })).toBe(true);
    expect(
      hasWriting({ ...createDayRecord(1), prompts: { p0: "reflexão" } })
    ).toBe(true);
  });

  it("lista os dias escritos em ordem", () => {
    const state = stateWith({
      5: { ...createDayRecord(5), notes: "cinco" },
      2: { ...createDayRecord(2), notes: "dois" },
      3: createDayRecord(3),
    });
    expect(writtenDaysOf(state).map(record => record.day)).toEqual([2, 5]);
  });
});

describe("conclusões fora do caminho da jornada", () => {
  const completed = (
    day: number,
    extra: Partial<DayRecord> = {}
  ): DayRecord => ({
    ...createDayRecord(day),
    completedAt: `2024-02-${String(day).padStart(2, "0")}T20:00:00.000Z`,
    ...extra,
  });

  it("não mexe na sequência que ela realmente percorreu", () => {
    const state = stateWith({ 1: completed(1), 2: completed(2) });
    expect(withoutUnreachableCompletions(state)).toBe(state);
  });

  it("descarta a conclusão de um dia que ela nunca alcançou", () => {
    const state = stateWith({
      1: completed(1),
      2: completed(2),
      29: completed(29),
    });

    const repaired = withoutUnreachableCompletions(state);

    expect(completedDaysOf(repaired)).toEqual([1, 2]);
    expect(repaired.days[29].completedAt).toBeNull();
    expect(repaired.days[29].day).toBe(29);
  });

  it("preserva o que ela escreveu no dia solto", () => {
    const state = stateWith({
      1: completed(1),
      29: completed(29, { notes: "texto antigo" }),
    });

    const repaired = withoutUnreachableCompletions(state);

    expect(repaired.days[29].notes).toBe("texto antigo");
    expect(completedDaysOf(repaired)).toEqual([1]);
  });
});
