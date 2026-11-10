import { describe, expect, it } from "vitest";
import { achievements, getDay, weekOfDay } from "@/journey";
import {
  SORAYA_WHATSAPP,
  buildShareMessage,
  sorayaWhatsAppUrl,
} from "./messages";

const day = getDay(7);
const achievement = achievements[0];

describe("mensagens de compartilhamento", () => {
  it("descreve o dia com o tema e o humor do conteúdo", () => {
    const text = buildShareMessage({ kind: "day", day: 7, mood: 5 });
    expect(text).toContain("Completei o Dia 7");
    expect(text).toContain(day.theme);
    expect(text).toContain("Muito leve");
    expect(text).toContain("#OuseSerVocê");
  });

  it("descreve a conquista desbloqueada", () => {
    const text = buildShareMessage({ kind: "achievement", achievement });
    expect(text).toContain(achievement.title);
    expect(text).toContain(achievement.description);
  });

  it("mostra a contagem e a semana atual no progresso", () => {
    const text = buildShareMessage({
      kind: "progress",
      completedDays: [1, 2, 3, 4, 5, 6, 7],
    });
    const week = weekOfDay(8);
    expect(text).toContain("7 de 30 dias completados (23%)");
    expect(text).toContain(`Semana ${week.week}: ${week.theme}`);
  });

  it("celebra a jornada completa com o humor final", () => {
    const text = buildShareMessage({ kind: "journey", mood: 4 });
    expect(text).toContain("30 DIAS COMPLETOS");
    expect(text).toContain("Leve");
  });

  it("monta o pedido de liberação no WhatsApp da Soraya", () => {
    const url = sorayaWhatsAppUrl("Olá! Meu e-mail é ana@exemplo.com.");
    expect(url.startsWith(`https://wa.me/${SORAYA_WHATSAPP}?text=`)).toBe(true);
    expect(decodeURIComponent(url.split("?text=")[1] ?? "")).toContain(
      "ana@exemplo.com"
    );
  });
});
