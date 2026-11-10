import type { Achievement } from "@/journey";
import {
  DAY_COUNT,
  currentDayOf,
  getDay,
  moodEmoji,
  moodLabel,
  progressPercent,
  weekOfDay,
} from "@/journey";

export type ShareSubject =
  | { kind: "day"; day: number; mood: number }
  | {
      kind: "achievement";
      achievement: Pick<Achievement, "title" | "description">;
    }
  | { kind: "progress"; completedDays: number[] }
  | { kind: "journey"; mood: number }
  | { kind: "story"; name: string; daysCompleted: number };

export function buildShareMessage(subject: ShareSubject): string {
  switch (subject.kind) {
    case "day": {
      const day = getDay(subject.day);
      return `🌸 OUSE SER VOCÊ – 30 Dias Para Mudar

Completei o Dia ${day.day} da minha jornada! 🎉

📌 Tema: ${day.theme}
💭 Humor: ${moodEmoji(subject.mood)} ${moodLabel(subject.mood)}

Estou me reconectando comigo mesma, dia após dia. Cada passo é uma vitória. 💪

Quer embarcar nessa jornada comigo? 🤍

#OuseSerVocê #30DiasParaMudar #TransformacaoEmocional #AutoconhecimentoEmocional #BemEstar`;
    }
    case "achievement":
      return `🏆 OUSE SER VOCÊ – Conquista Desbloqueada!

Consegui! 🎊

⭐ ${subject.achievement.title}
${subject.achievement.description}

Estou transformando minha vida, uma prática por vez. Você também pode! 🌟

#OuseSerVocê #30DiasParaMudar #TransformacaoEmocional #Conquista #AutoestimA`;
    case "progress": {
      const completed = subject.completedDays.length;
      const percent = progressPercent(subject.completedDays);
      const week = weekOfDay(currentDayOf(subject.completedDays));
      return `📊 OUSE SER VOCÊ – Progresso da Minha Jornada

✅ ${completed} de ${DAY_COUNT} dias completados (${percent}%)
📍 Semana ${week.week}: ${week.theme}

Estou me transformando! Cada dia me aproxima mais de mim mesma. 🌸

Quer conhecer essa jornada?

#OuseSerVocê #30DiasParaMudar #TransformacaoEmocional #Jornada #AutoconhecimentoEmocional`;
    }
    case "story": {
      const journey =
        subject.daysCompleted >= DAY_COUNT
          ? `Ela completou a jornada de ${DAY_COUNT} dias`
          : `Ela chegou ao dia ${subject.daysCompleted} da jornada`;
      return `✨ Inspirada pela história de ${subject.name}. ${journey} do OUSE SER VOCÊ e se transformou. Vem conhecer essa comunidade. 🌸`;
    }
    case "journey":
      return `🎊 OUSE SER VOCÊ – 30 DIAS COMPLETOS! 🎊

Eu consegui! 🌟

Completei a jornada de 30 dias de transformação emocional!

📈 Meu estado final: ${moodEmoji(subject.mood)} ${moodLabel(subject.mood)}

✨ Autoconhecimento
💪 Autoconfiança
🌸 Amor-próprio
🎯 Propósito
🙏 Bem-estar

Essa jornada me transformou. Sou mais eu do que nunca! 💫

Obrigada, Soraya Farias, por cada dia, cada exercício, cada áudio.

Quer começar sua transformação? 🤍

#OuseSerVocê #30DiasParaMudar #TransformacaoCompleta #AutoconhecimentoEmocional #JornadaCompleta`;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const INSTAGRAM_URL = "https://www.instagram.com/";

// Instagram has no share deep link that accepts text, so the copy is the payload
// and the opened tab is where the user pastes it.
export function openInstagram(): void {
  window.open(INSTAGRAM_URL, "_blank");
}

export function buildStoriesCaption(achievementTitle: string): string {
  return `Desbloqueei a conquista "${achievementTitle}" em OUSE SER VOCÊ! 🎉 #OuseSerVocê #30DiasParaMudar`;
}

export function openWhatsApp(message: string): void {
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
}

/** Soraya's direct WhatsApp, in wa.me format (country + area + number). */
export const SORAYA_WHATSAPP = "5511940558778";

export function sorayaWhatsAppUrl(message: string): string {
  return `https://wa.me/${SORAYA_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
