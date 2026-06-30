// OUSE SER VOCÊ – Achievement Image Generator Hook
// Gera imagens visuais de conquistas para compartilhamento em Stories

export interface AchievementImageOptions {
  title: string;
  description: string;
  icon: string;
  backgroundColor?: string;
  accentColor?: string;
}

export function useAchievementImage() {
  const generateAchievementImage = (options: AchievementImageOptions): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      
      // Dimensões para Stories (1080x1920 é ideal, mas usaremos 1080x1350 para melhor compatibilidade)
      const width = 1080;
      const height = 1350;
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("");
        return;
      }

      const bgColor = options.backgroundColor || "#F5EDE8";
      const accentColor = options.accentColor || "#C4856A";

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, bgColor);
      gradient.addColorStop(1, "#FAF6F1");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Decorative circles
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.arc(width * 0.2, height * 0.15, 300, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(width * 0.85, height * 0.8, 250, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Top accent line
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(150, 100);
      ctx.lineTo(width - 150, 100);
      ctx.stroke();

      // Icon circle background
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

      // Icon
      ctx.font = "bold 120px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(options.icon, iconBgX, iconBgY);

      // Badge label
      ctx.fillStyle = accentColor;
      ctx.font = "bold 28px 'Playfair Display', serif";
      ctx.textAlign = "center";
      ctx.fillText("CONQUISTA DESBLOQUEADA", width / 2, height * 0.45);

      // Title
      ctx.fillStyle = "#2C1810";
      ctx.font = "bold 64px 'Playfair Display', serif";
      ctx.textAlign = "center";
      
      // Word wrap for title
      const titleMaxWidth = width - 200;
      const titleLines = wrapText(ctx, options.title, titleMaxWidth, 64);
      let titleY = height * 0.55;
      
      titleLines.forEach((line, index) => {
        ctx.fillText(line, width / 2, titleY + index * 80);
      });

      // Description
      ctx.fillStyle = "#8B6E5A";
      ctx.font = "32px 'DM Sans', sans-serif";
      ctx.textAlign = "center";
      
      const descMaxWidth = width - 200;
      const descLines = wrapText(ctx, options.description, descMaxWidth, 32);
      let descY = titleY + titleLines.length * 80 + 60;
      
      descLines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(line, width / 2, descY + index * 50);
      });

      // Bottom accent
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 6;
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(150, height - 120);
      ctx.lineTo(width - 150, height - 120);
      ctx.stroke();
      ctx.setLineDash([]);

      // Logo/branding at bottom
      ctx.fillStyle = accentColor;
      ctx.font = "bold 24px 'Playfair Display', serif";
      ctx.textAlign = "center";
      ctx.fillText("OUSE SER VOCÊ", width / 2, height - 50);

      ctx.fillStyle = "#B08070";
      ctx.font = "18px 'DM Sans', sans-serif";
      ctx.fillText("30 Dias Para Mudar", width / 2, height - 10);

      // Convert to image
      const imageUrl = canvas.toDataURL("image/png", 0.95);
      resolve(imageUrl);
    });
  };

  // Helper function to wrap text
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    fontSize: number
  ): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Download image
  const downloadImage = (imageUrl: string, filename: string): void => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    generateAchievementImage,
    downloadImage,
  };
}
