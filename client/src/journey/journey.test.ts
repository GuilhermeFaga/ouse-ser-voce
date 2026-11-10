import { describe, expect, it } from "vitest";
import {
  DAY_COUNT,
  currentDayOf,
  dailyContent,
  daysOfWeek,
  getDay,
  getWeek,
  progressPercent,
  streakOf,
  weekOfDay,
  weekModules,
  weekProgress,
} from "./index";

describe("jornada", () => {
  it("tem 30 dias, de 1 a 30, sem buracos", () => {
    expect(DAY_COUNT).toBe(30);
    expect(dailyContent).toHaveLength(DAY_COUNT);
    expect(dailyContent.map(day => day.day)).toEqual(
      Array.from({ length: DAY_COUNT }, (_, index) => index + 1)
    );
  });

  it("distribui os dias nas quatro semanas do conteúdo", () => {
    expect(weekModules.map(week => week.week)).toEqual([1, 2, 3, 4]);
    expect(daysOfWeek(1)).toHaveLength(7);
    expect(daysOfWeek(2)).toHaveLength(7);
    expect(daysOfWeek(3)).toHaveLength(7);
    expect(daysOfWeek(4)).toHaveLength(9);
    expect(weekOfDay(28).week).toBe(4);
    expect(weekOfDay(29).week).toBe(4);
    expect(weekOfDay(30).week).toBe(4);
  });

  it("dá a cada dia um áudio existente", () => {
    for (const day of dailyContent) {
      expect(day.audioUrl).toMatch(/^\.\/manus-storage\/.+\.mp3$/);
    }
  });

  it("resolve um dia e uma semana para qualquer entrada", () => {
    expect(getDay(3).day).toBe(3);
    expect(getDay(0).day).toBe(1);
    expect(getDay(99).day).toBe(1);
    expect(getWeek(4).week).toBe(4);
    expect(getWeek(9).week).toBe(1);
  });

  it("fica no primeiro dia ainda não concluído", () => {
    expect(currentDayOf([])).toBe(1);
    expect(currentDayOf([1])).toBe(2);
    expect(currentDayOf([1, 2, 3])).toBe(4);
    expect(currentDayOf(Array.from({ length: 30 }, (_, i) => i + 1))).toBe(30);
  });

  it("não avança por causa de um dia solto muito à frente", () => {
    // Uma conta real: dias 1 e 2 feitos, e um dia 29 gravado por engano.
    expect(currentDayOf([1, 2, 29])).toBe(3);
    expect(currentDayOf([30])).toBe(1);
    expect(currentDayOf([1, 2, 3, 10])).toBe(4);
  });

  it("calcula sequência apenas de dias consecutivos no fim", () => {
    expect(streakOf([])).toBe(0);
    expect(streakOf([1])).toBe(1);
    expect(streakOf([1, 2, 3])).toBe(3);
    expect(streakOf([1, 2, 5, 6])).toBe(2);
    expect(streakOf([4, 3, 2, 1])).toBe(4);
  });

  it("mede o progresso em dias e por semana", () => {
    expect(progressPercent([])).toBe(0);
    expect(progressPercent([1, 2, 3])).toBe(10);
    expect(progressPercent(Array.from({ length: 30 }, (_, i) => i + 1))).toBe(
      100
    );
    expect(weekProgress(1, [1, 2, 3])).toEqual({
      completed: 3,
      total: 7,
      percent: 43,
    });
    expect(weekProgress(4, [29, 30]).completed).toBe(2);
  });
});
