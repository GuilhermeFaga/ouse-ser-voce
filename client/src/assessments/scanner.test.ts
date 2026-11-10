import { describe, expect, it } from "vitest";
import { SCANNER_AREAS, scannerQuestions, scoreScanner } from "./scanner";

const answerAll = (value: number) =>
  Object.fromEntries(scannerQuestions.map(question => [question.id, value]));

describe("scanner", () => {
  it("pergunta as cinco áreas", () => {
    expect(SCANNER_AREAS.map(area => area.id)).toEqual([
      "identidade",
      "emocional",
      "autocuidado",
      "relacionamentos",
      "proposito",
    ]);
    for (const question of scannerQuestions) {
      expect(SCANNER_AREAS.map(area => area.id)).toContain(question.area);
      expect(question.options.length).toBeGreaterThan(1);
    }
  });

  it("marca autoabandono alto quando todas as respostas são as piores", () => {
    const result = scoreScanner(answerAll(1));
    expect(result.abandonmentLevel).toBe(80);
    expect(result.abandonmentLabel).toBe("Alto");
    expect(result.percentages).toEqual({
      identidade: 20,
      emocional: 20,
      autocuidado: 20,
      relacionamentos: 20,
      proposito: 20,
    });
  });

  it("marca autoabandono zero quando todas as respostas são as melhores", () => {
    const result = scoreScanner(answerAll(5));
    expect(result.abandonmentLevel).toBe(0);
    expect(result.abandonmentLabel).toBe("Baixo");
  });

  it("aponta a área mais crítica", () => {
    for (const area of SCANNER_AREAS) {
      const answers = Object.fromEntries(
        scannerQuestions.map(question => [
          question.id,
          question.area === area.id ? 1 : 5,
        ])
      );
      const result = scoreScanner(answers);
      expect(result.criticalArea.id).toBe(area.id);
      expect(result.explanation).toBe(area.explanation);
      expect(result.recommendation).toBe(area.recommendation);
    }
  });

  it("mantém as porcentagens dentro da escala", () => {
    const answers = Object.fromEntries(
      scannerQuestions.map((question, index) => [
        question.id,
        question.options[index % question.options.length].value,
      ])
    );
    const result = scoreScanner(answers);
    for (const percent of Object.values(result.percentages)) {
      expect(percent).toBeGreaterThanOrEqual(0);
      expect(percent).toBeLessThanOrEqual(100);
    }
    expect(result.abandonmentLevel).toBeGreaterThanOrEqual(0);
    expect(result.abandonmentLevel).toBeLessThanOrEqual(100);
  });
});
