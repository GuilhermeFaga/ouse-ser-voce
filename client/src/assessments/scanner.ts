import { PALETTE, type Palette } from "@/journey/palette";
import { scannerQuestions, type ScannerAreaId } from "./questions";

export { scannerQuestions } from "./questions";
export type { ScannerQuestion } from "./questions";

export interface ScannerArea {
  id: ScannerAreaId;
  label: string;
  palette: Palette;
  explanation: string;
  recommendation: string;
}

export const SCANNER_AREAS: ScannerArea[] = [
  {
    id: "identidade",
    label: "Identidade",
    palette: PALETTE.rose,
    explanation:
      "Você está desconectada de quem você realmente é. Seus papéis (mãe, esposa, profissional) tomaram tanto espaço que a mulher por trás deles ficou invisível. O trabalho mais urgente é se reencontrar — descobrir seus valores, desejos e identidade além do que você faz pelos outros.",
    recommendation:
      "Esta semana, reserve 15 minutos por dia para escrever sobre quem você é além dos seus papéis. Comece com: 'Quando ninguém está olhando, eu sou...' Não censure. Deixe fluir.",
  },
  {
    id: "emocional",
    label: "Equilíbrio Emocional",
    palette: PALETTE.amber,
    explanation:
      "Sua vida emocional está sobrecarregada. Você pode estar evitando sentir, se julgando por suas emoções ou operando no limite do esgotamento. O trabalho mais urgente é aprender a acolher suas emoções com compaixão e cuidar da sua saúde emocional.",
    recommendation:
      "Hoje, identifique uma emoção que você tem evitado sentir. Sente-se em silêncio por 5 minutos e permita que ela esteja presente — sem julgamento, sem tentar resolver. Apenas observe.",
  },
  {
    id: "autocuidado",
    label: "Autocuidado",
    palette: PALETTE.teal,
    explanation:
      "Você está no final da sua própria lista de prioridades. O autocuidado foi substituído por obrigações, e a culpa aparece quando você tenta se cuidar. O trabalho mais urgente é se colocar como prioridade — não como luxo, mas como necessidade.",
    recommendation:
      "Hoje, escolha uma coisa pequena que você faria só para você — um chá, uma caminhada, 10 minutos de silêncio. Faça isso sem pedir permissão e sem se justificar para ninguém.",
  },
  {
    id: "relacionamentos",
    label: "Relacionamentos",
    palette: PALETTE.blue,
    explanation:
      "Suas relações estão te drenando mais do que te nutrindo. Você pode estar com dificuldade de estabelecer limites, expressar suas necessidades ou se sentindo invisível nas relações. O trabalho mais urgente é aprender a se comunicar com assertividade e proteger sua energia.",
    recommendation:
      "Esta semana, pratique dizer não para uma coisa que você normalmente diria sim por obrigação. Observe como você se sente antes, durante e depois.",
  },
  {
    id: "proposito",
    label: "Propósito",
    palette: PALETTE.purple,
    explanation:
      "Você está sem direção e sem sentido. Pode estar vivendo no piloto automático, sem clareza sobre o que realmente importa para você. O trabalho mais urgente é reconectar com seus valores, sonhos e o que dá sentido à sua vida.",
    recommendation:
      "Hoje, escreva 3 coisas que te fazem perder a noção do tempo quando você as faz. Essas atividades contêm pistas importantes sobre o que dá sentido à sua vida.",
  },
];

export type ScannerSeverity = "high" | "moderate" | "low";

const SEVERITY_BANDS: {
  min: number;
  severity: ScannerSeverity;
  label: string;
}[] = [
  { min: 70, severity: "high", label: "Alto" },
  { min: 40, severity: "moderate", label: "Moderado" },
  { min: 0, severity: "low", label: "Baixo" },
];

export interface ScannerDiagnosis {
  percentages: Record<string, number>;
  abandonmentLevel: number;
  abandonmentLabel: string;
  severity: ScannerSeverity;
  criticalArea: ScannerArea;
  explanation: string;
  recommendation: string;
}

export const SCANNER_QUESTION_COUNT = scannerQuestions.length;

export function scoreScanner(
  answers: Record<string, number>
): ScannerDiagnosis {
  const totals = new Map<string, { sum: number; count: number }>(
    SCANNER_AREAS.map(area => [area.id, { sum: 0, count: 0 }])
  );

  for (const question of scannerQuestions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;
    const bucket = totals.get(question.area);
    if (!bucket) continue;
    bucket.sum += answer;
    bucket.count += 1;
  }

  const percentages: Record<string, number> = {};
  const answered: { area: ScannerArea; percent: number }[] = [];

  for (const area of SCANNER_AREAS) {
    const bucket = totals.get(area.id)!;
    const percent = bucket.count
      ? Math.round((bucket.sum / bucket.count / 5) * 100)
      : 50;
    percentages[area.id] = percent;
    if (bucket.count) answered.push({ area, percent });
  }

  const average = answered.length
    ? Math.round(
        answered.reduce((sum, entry) => sum + entry.percent, 0) /
          answered.length
      )
    : 0;
  const criticalArea = answered.reduce(
    (lowest, entry) => (entry.percent < lowest.percent ? entry : lowest),
    answered[0] ?? { area: SCANNER_AREAS[0], percent: 0 }
  ).area;
  const abandonmentLevel = 100 - average;

  const band =
    SEVERITY_BANDS.find(entry => abandonmentLevel >= entry.min) ??
    SEVERITY_BANDS[SEVERITY_BANDS.length - 1];

  return {
    percentages,
    abandonmentLevel,
    abandonmentLabel: band.label,
    severity: band.severity,
    criticalArea,
    explanation: criticalArea.explanation,
    recommendation: criticalArea.recommendation,
  };
}
