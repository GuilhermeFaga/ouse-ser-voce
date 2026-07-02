// OUSE SER VOCÊ – Mood Variation Chart
// Visualização de tendência de humor ao longo dos dias

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { JournalEntry } from "@/hooks/useAppState";

interface MoodChartProps {
  entries: JournalEntry[];
}

export default function MoodChart({ entries }: MoodChartProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 text-center">
        <p className="text-[#B08070] text-sm">
          Comece a registrar seu humor para ver a evolução
        </p>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = entries
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map(entry => ({
      date: new Date(entry.createdAt).toLocaleDateString("pt-BR", {
        month: "short",
        day: "numeric",
      }),
      mood: entry.mood,
      fullDate: new Date(entry.createdAt),
    }));

  // Calculate statistics
  const moods = entries.map(e => e.mood);
  const avgMood = (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(1);
  const maxMood = Math.max(...moods);
  const minMood = Math.min(...moods);
  const trend =
    moods.length >= 2 && moods[moods.length - 1] > moods[0]
      ? "↑ Melhorando"
      : moods[moods.length - 1] < moods[0]
        ? "↓ Desafiador"
        : "→ Estável";
  const trendColor = trend.includes("Melhorando")
    ? "text-green-600"
    : trend.includes("Desafiador")
      ? "text-amber-600"
      : "text-blue-600";

  const moodLabels = [
    "",
    "Muito pesado",
    "Pesado",
    "Neutro",
    "Leve",
    "Muito leve",
  ];
  const moodEmojis = ["", "😔", "😕", "😐", "🙂", "😊"];

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-3 text-center shadow-sm">
          <p className="text-xs text-[#B08070] font-medium mb-1">Média</p>
          <p className="font-serif text-lg font-bold text-[#C4856A]">
            {avgMood}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">
            {moodEmojis[Math.round(parseFloat(avgMood))]}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-3 text-center shadow-sm">
          <p className="text-xs text-[#B08070] font-medium mb-1">Melhor</p>
          <p className="font-serif text-lg font-bold text-green-600">
            {maxMood}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">{moodEmojis[maxMood]}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-3 text-center shadow-sm">
          <p className="text-xs text-[#B08070] font-medium mb-1">Desafio</p>
          <p className="font-serif text-lg font-bold text-amber-600">
            {minMood}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">{moodEmojis[minMood]}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-3 text-center shadow-sm">
          <p className="text-xs text-[#B08070] font-medium mb-1">Tendência</p>
          <p className={`font-serif text-lg font-bold ${trendColor}`}>
            {trend.split(" ")[0]}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">{entries.length} dias</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#2C1810] mb-4">
          Evolução do seu humor
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 20, left: -20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C4856A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C4856A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E4DC" />
            <XAxis
              dataKey="date"
              stroke="#B08070"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#B08070" }}
            />
            <YAxis
              domain={[0, 5]}
              stroke="#B08070"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#B08070" }}
              label={{
                value: "Humor",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#B08070" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FAF6F1",
                border: "1px solid #E8D5CC",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                `${value} - ${moodLabels[value]}`,
                "Humor",
              ]}
              labelStyle={{ color: "#2C1810" }}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#C4856A"
              strokeWidth={2}
              fill="url(#colorMood)"
              dot={{ fill: "#C4856A", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="bg-[#F5EDE8] rounded-xl p-3 text-xs text-[#6B4C3B] leading-relaxed">
        <p className="font-semibold mb-1.5">Escala de humor:</p>
        <div className="grid grid-cols-5 gap-1">
          {moodLabels.map(
            (label, i) =>
              i > 0 && (
                <div key={i} className="text-center">
                  <p className="text-lg mb-0.5">{moodEmojis[i]}</p>
                  <p className="text-[10px]">{i}</p>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
