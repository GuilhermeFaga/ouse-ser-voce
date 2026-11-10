import {
  getRandomMotivationalQuote,
  getRandomQuoteFromCategory,
} from "@/lib/motivationalQuotes";

export interface AchievementImageOptions {
  title: string;
  description: string;
  icon: string;
  accentColor?: string;
  categoryId?: string;
}

// Instagram Stories is 1080x1920; 1080x1350 renders without cropping on more clients.
const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1350;

export function generateAchievementImage(
  options: AchievementImageOptions
): Promise<string> {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    canvas.width = STORY_WIDTH;
    canvas.height = STORY_HEIGHT;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve("");
      return;
    }

    const width = STORY_WIDTH;
    const height = STORY_HEIGHT;
    const bgColor = "#F5EDE8";
    const accentColor = options.accentColor || "#C4856A";
    const motivationalQuote = options.categoryId
      ? getRandomQuoteFromCategory(options.categoryId)
      : getRandomMotivationalQuote();

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, "#FAF6F1");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.15, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.85, height * 0.8, 250, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(width - 150, 100);
    ctx.stroke();

    const iconBgX = width / 2;
    const iconBgY = height * 0.25;
    const iconBgRadius = 150;

    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.arc(iconBgX, iconBgY, iconBgRadius + 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(iconBgX, iconBgY, iconBgRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "bold 120px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.icon, iconBgX, iconBgY);

    ctx.fillStyle = accentColor;
    ctx.font = "bold 28px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("CONQUISTA DESBLOQUEADA", width / 2, height * 0.45);

    ctx.fillStyle = "#2C1810";
    ctx.font = "bold 64px 'Playfair Display', serif";
    ctx.textAlign = "center";

    const titleLines = wrapText(ctx, options.title, width - 200);
    const titleY = height * 0.55;
    titleLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, titleY + index * 80);
    });

    ctx.fillStyle = "#8B6E5A";
    ctx.font = "32px 'DM Sans', sans-serif";
    ctx.textAlign = "center";

    const descY = titleY + titleLines.length * 80 + 60;
    const descLines = wrapText(ctx, options.description, width - 200);
    descLines.slice(0, 3).forEach((line, index) => {
      ctx.fillText(line, width / 2, descY + index * 50);
    });

    const quoteY = height - 280;

    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.roundRect(80, quoteY - 40, width - 160, 120, [20, 20, 20, 20]);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(80, quoteY - 40, width - 160, 120, [20, 20, 20, 20]);
    ctx.stroke();

    ctx.fillStyle = "#2C1810";
    ctx.font = "italic 28px 'DM Sans', sans-serif";
    ctx.textAlign = "center";

    const quoteLines = wrapText(ctx, `"${motivationalQuote}"`, width - 200);
    const quoteTextY = quoteY + 10;
    quoteLines.slice(0, 2).forEach((line, index) => {
      ctx.fillText(line, width / 2, quoteTextY + index * 40);
    });

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(150, height - 120);
    ctx.lineTo(width - 150, height - 120);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = accentColor;
    ctx.font = "bold 24px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText("OUSE SER VOCÊ", width / 2, height - 50);

    ctx.fillStyle = "#B08070";
    ctx.font = "18px 'DM Sans', sans-serif";
    ctx.fillText("30 Dias Para Mudar", width / 2, height - 10);

    resolve(canvas.toDataURL("image/png", 0.95));
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  let currentLine = "";

  for (const word of text.split(" ")) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

export function downloadImage(imageUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
