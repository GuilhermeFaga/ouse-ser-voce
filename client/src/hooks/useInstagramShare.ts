// OUSE SER VOCÊ – Instagram Share Hook
// Gera mensagens personalizadas para compartilhamento no Instagram

export interface ShareMessage {
  text: string;
  url: string;
}

export function useInstagramShare() {
  const encodeMessage = (text: string): string => {
    return encodeURIComponent(text);
  };

  const generateInstagramUrl = (message: string): string => {
    // Instagram não tem deep link direto como WhatsApp, então abrimos o app
    // e a mensagem é copiada para clipboard
    return `https://www.instagram.com/`;
  };

  // Copiar para clipboard
  const copyToClipboard = (text: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Mensagem copiada para clipboard!");
      })
      .catch(() => {
        console.error("Erro ao copiar para clipboard");
      });
  };

  // Compartilhar conclusão de dia
  const shareDayCompletion = (
    dayNumber: number,
    theme: string,
    mood: number
  ): ShareMessage => {
    const moodEmojis = ["", "😔", "😕", "😐", "🙂", "😊"];
    const moodLabels = [
      "",
      "Muito pesado",
      "Pesado",
      "Neutro",
      "Leve",
      "Muito leve",
    ];

    const message = `🌸 OUSE SER VOCÊ – 30 Dias Para Mudar

Completei o Dia ${dayNumber} da minha jornada! 🎉

📌 Tema: ${theme}
💭 Humor: ${moodEmojis[mood]} ${moodLabels[mood]}

Estou me reconectando comigo mesma, dia após dia. Cada passo é uma vitória. 💪

Quer embarcar nessa jornada comigo? 🤍

#OuseSerVocê #30DiasParaMudar #TransformacaoEmocional #AutoconhecimentoEmocional #BemEstar`;

    return {
      text: message,
      url: generateInstagramUrl(message),
    };
  };

  // Compartilhar conquista desbloqueada
  const shareAchievement = (
    achievementName: string,
    description: string
  ): ShareMessage => {
    const message = `🏆 OUSE SER VOCÊ – Conquista Desbloqueada!

Consegui! 🎊

⭐ ${achievementName}
${description}

Estou transformando minha vida, uma prática por vez. Você também pode! 🌟

#OuseSerVocê #30DiasParaMudar #TransformacaoEmocional #Conquista #AutoestimA`;

    return {
      text: message,
      url: generateInstagramUrl(message),
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

    const message = `📊 OUSE SER VOCÊ – Progresso da Minha Jornada

✅ ${completedDays} de ${totalDays} dias completados (${progressPercent}%)
📍 Semana ${currentWeek}: ${weekTheme}

Estou me transformando! Cada dia me aproxima mais de mim mesma. 🌸

Quer conhecer essa jornada?

#OuseSerVocê #30DiasParaMudar #TransformacaoEmocional #Jornada #AutoconhecimentoEmocional`;

    return {
      text: message,
      url: generateInstagramUrl(message),
    };
  };

  // Compartilhar conclusão de semana
  const shareWeekCompletion = (
    weekNumber: number,
    weekTheme: string,
    daysCompleted: number
  ): ShareMessage => {
    const weekEmojis = ["", "🌱", "🦋", "✨", "👑"];
    const weekEmoji = weekEmojis[weekNumber] || "🌟";

    const message = `${weekEmoji} OUSE SER VOCÊ – Semana ${weekNumber} Completa!

Completei a Semana ${weekNumber}: ${weekTheme} 🎉

✨ ${daysCompleted} dias de práticas transformadoras
💪 Estou mais forte, mais conectada comigo mesma
🌸 Pronta para a próxima semana

Obrigada, Soraya Farias, por essa jornada incrível! 🙏

#OuseSerVocê #Transformacao #AutoconhecimentoEmocional #SemaCompleta #Jornada`;

    return {
      text: message,
      url: generateInstagramUrl(message),
    };
  };

  // Compartilhar conclusão da jornada completa
  const shareJourneyCompletion = (finalMood: number): ShareMessage => {
    const moodEmojis = ["", "😔", "😕", "😐", "🙂", "😊"];
    const moodLabels = [
      "",
      "Muito pesado",
      "Pesado",
      "Neutro",
      "Leve",
      "Muito leve",
    ];

    const message = `🎊 OUSE SER VOCÊ – 30 DIAS COMPLETOS! 🎊

Eu consegui! 🌟

Completei a jornada de 30 dias de transformação emocional!

📈 Meu estado final: ${moodEmojis[finalMood]} ${moodLabels[finalMood]}

✨ Autoconhecimento
💪 Autoconfiança
🌸 Amor-próprio
🎯 Propósito
🙏 Bem-estar

Essa jornada me transformou. Sou mais eu do que nunca! 💫

Obrigada, Soraya Farias, por cada dia, cada exercício, cada áudio.

Quer começar sua transformação? 🤍

#OuseSerVocê #30DiasParaMudar #TransformacaoCompleta #AutoconhecimentoEmocional #JornadaCompleta`;

    return {
      text: message,
      url: generateInstagramUrl(message),
    };
  };

  // Abrir Instagram e copiar mensagem
  const openInstagram = (message: string): void => {
    copyToClipboard(message);
    window.open("https://www.instagram.com/", "_blank");
  };

  return {
    shareDayCompletion,
    shareAchievement,
    shareProgress,
    shareWeekCompletion,
    shareJourneyCompletion,
    openInstagram,
    copyToClipboard,
  };
}
