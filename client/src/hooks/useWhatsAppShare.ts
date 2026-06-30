// OUSE SER VOCÊ – WhatsApp Share Hook
// Gera mensagens personalizadas para compartilhamento no WhatsApp

export interface ShareMessage {
  text: string;
  url: string;
}

export function useWhatsAppShare() {
  const encodeMessage = (text: string): string => {
    return encodeURIComponent(text);
  };

  const generateWhatsAppUrl = (message: string): string => {
    return `https://wa.me/?text=${encodeMessage(message)}`;
  };

  // Compartilhar conclusão de dia
  const shareDayCompletion = (dayNumber: number, theme: string, mood: number): ShareMessage => {
    const moodEmojis = ["", "😔", "😕", "😐", "🙂", "😊"];
    const moodLabels = ["", "Muito pesado", "Pesado", "Neutro", "Leve", "Muito leve"];

    const message = `🌸 *OUSE SER VOCÊ – 30 Dias Para Mudar*

Completei o Dia ${dayNumber} da minha jornada! 🎉

📌 *Tema:* ${theme}
💭 *Humor:* ${moodEmojis[mood]} ${moodLabels[mood]}

Estou me reconectando comigo mesma, dia após dia. Cada passo é uma vitória. 💪

Quer embarcar nessa jornada comigo? 🤍`;

    return {
      text: message,
      url: generateWhatsAppUrl(message),
    };
  };

  // Compartilhar conquista desbloqueada
  const shareAchievement = (achievementName: string, description: string): ShareMessage => {
    const message = `🏆 *OUSE SER VOCÊ – Conquista Desbloqueada!*

Consegui! 🎊

⭐ *${achievementName}*
${description}

Estou transformando minha vida, uma prática por vez. Você também pode! 🌟

#OuseSerVocê #30DiasParaMudar #TransformacaoEmocional`;

    return {
      text: message,
      url: generateWhatsAppUrl(message),
    };
  };

  // Compartilhar progresso geral
  const shareProgress = (
    completedDays: number,
    totalDays: number,
    currentWeek: number,
    weekTheme: string
  ): ShareMessage => {
    const progressPercent = Math.round((completedDays / totalDays) * 100);
    const progressBar = generateProgressBar(progressPercent);

    const message = `📊 *OUSE SER VOCÊ – Progresso da Minha Jornada*

${progressBar} ${progressPercent}%

✅ *${completedDays} de ${totalDays} dias completados*
📍 *Semana ${currentWeek}:* ${weekTheme}

Estou me transformando! Cada dia me aproxima mais de mim mesma. 🌸

Quer conhecer essa jornada? #OuseSerVocê`;

    return {
      text: message,
      url: generateWhatsAppUrl(message),
    };
  };

  // Compartilhar conclusão de semana
  const shareWeekCompletion = (weekNumber: number, weekTheme: string, daysCompleted: number): ShareMessage => {
    const weekEmojis = ["", "🌱", "🦋", "✨", "👑"];
    const weekEmoji = weekEmojis[weekNumber] || "🌟";

    const message = `${weekEmoji} *OUSE SER VOCÊ – Semana ${weekNumber} Completa!*

Completei a Semana ${weekNumber}: *${weekTheme}* 🎉

✨ ${daysCompleted} dias de práticas transformadoras
💪 Estou mais forte, mais conectada comigo mesma
🌸 Pronta para a próxima semana

Obrigada, Soraya Farias, por essa jornada incrível! 🙏

#OuseSerVocê #Transformacao #AutoconhecimentoEmocional`;

    return {
      text: message,
      url: generateWhatsAppUrl(message),
    };
  };

  // Compartilhar conclusão da jornada completa
  const shareJourneyCompletion = (finalMood: number): ShareMessage => {
    const moodEmojis = ["", "😔", "😕", "😐", "🙂", "😊"];
    const moodLabels = ["", "Muito pesado", "Pesado", "Neutro", "Leve", "Muito leve"];

    const message = `🎊 *OUSE SER VOCÊ – 30 DIAS COMPLETOS!* 🎊

Eu consegui! 🌟

Completei a jornada de 30 dias de transformação emocional!

📈 *Meu estado final:* ${moodEmojis[finalMood]} ${moodLabels[finalMood]}

✨ Autoconhecimento
💪 Autoconfiança
🌸 Amor-próprio
🎯 Propósito
🙏 Bem-estar

Essa jornada me transformou. Sou mais eu do que nunca! 💫

Obrigada, Soraya Farias, por cada dia, cada exercício, cada meditação.

Quer começar sua transformação? 🤍

#OuseSerVocê #30DiasParaMudar #TransformacaoCompleta`;

    return {
      text: message,
      url: generateWhatsAppUrl(message),
    };
  };

  // Gerar barra de progresso visual
  const generateProgressBar = (percent: number): string => {
    const filled = Math.round(percent / 10);
    const empty = 10 - filled;
    return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
  };

  // Abrir WhatsApp com mensagem
  const openWhatsApp = (message: string): void => {
    window.open(generateWhatsAppUrl(message), "_blank");
  };

  return {
    shareDayCompletion,
    shareAchievement,
    shareProgress,
    shareWeekCompletion,
    shareJourneyCompletion,
    openWhatsApp,
  };
}
