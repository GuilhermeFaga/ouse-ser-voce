import { describe, expect, it } from "vitest";
import {
  achievements,
  evaluateAchievements,
  type JourneyProgress,
} from "./index";

const base: JourneyProgress = {
  completedDays: [],
  currentStreak: 0,
  journalEntries: 0,
  scannerCompleted: false,
  assessmentInitialDone: false,
  assessmentFinalDone: false,
};

const progress = (overrides: Partial<JourneyProgress>): JourneyProgress => ({
  ...base,
  ...overrides,
});

describe("conquistas", () => {
  it("não desbloqueia nada no começo", () => {
    expect(evaluateAchievements([], base)).toEqual([]);
  });

  it("desbloqueia as conquistas de uma semana completa", () => {
    const unlocked = evaluateAchievements(
      [],
      progress({
        completedDays: [1, 2, 3, 4, 5, 6, 7],
        currentStreak: 7,
      })
    );
    expect(unlocked).toEqual(
      expect.arrayContaining(["first-day", "week-1", "streak-7"])
    );
    expect(unlocked).not.toContain("week-2");
  });

  it("conta a quarta semana com os nove dias que o conteúdo tem", () => {
    const lastWeek = [22, 23, 24, 25, 26, 27, 28, 29, 30];
    expect(
      evaluateAchievements([], progress({ completedDays: lastWeek }))
    ).toContain("week-4");
    expect(
      evaluateAchievements(
        [],
        progress({ completedDays: lastWeek.slice(0, 8) })
      )
    ).not.toContain("week-4");
    expect(
      evaluateAchievements(
        [],
        progress({ completedDays: lastWeek.slice(0, 7) })
      )
    ).not.toContain("week-4");
  });

  it("só devolve conquistas ainda não desbloqueadas", () => {
    const all = evaluateAchievements(
      [],
      progress({
        completedDays: Array.from({ length: 30 }, (_, index) => index + 1),
        currentStreak: 30,
        journalEntries: 15,
        scannerCompleted: true,
        assessmentInitialDone: true,
        assessmentFinalDone: true,
      })
    );
    expect(all).toHaveLength(achievements.length);
    expect(evaluateAchievements(all, base)).toEqual([]);
  });

  it("liga cada conquista a uma condição avaliada sobre o progresso", () => {
    for (const achievement of achievements) {
      expect(typeof achievement.condition).toBe("function");
      expect(achievement.title.length).toBeGreaterThan(0);
    }
  });
});
