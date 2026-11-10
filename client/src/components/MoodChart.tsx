import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  averageMood,
  MOOD_SCALE,
  moodEmoji,
  moodLabel,
  moodTrend,
} from "@/journey";
import type { DayRecord } from "@/app/state";

const TREND_LABEL = {
  improving: { label: "Melhorando", symbol: "↑", color: "text-green-600" },
  declining: { label: "Desafiador", symbol: "↓", color: "text-amber-600" },
  steady: { label: "Estável", symbol: "→", color: "text-blue-600" },
} as const;

export default function MoodChart({ records }: { records: DayRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 text-center">
        <p className="text-[#B08070] text-sm">
          Comece a registrar seu humor para ver a evolução
        </p>
      </div>
    );
  }

  const moods = records.map(record => record.mood);
  const chartData = records.map(record => ({
    date: `Dia ${record.day}`,
    mood: record.mood,
  }));

  const average = averageMood(moods);
  const trend = TREND_LABEL[moodTrend(moods)];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-3 text-center shadow-sm">
          <p className="text-xs text-[#B08070] font-medium mb-1">Média</p>
          <p className="font-serif text-lg font-bold text-[#C4856A]">
            {average.toFixed(1)}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">
            {moodEmoji(Math.round(average))}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-3 text-center shadow-sm">
          <p className="text-xs text-[#B08070] font-medium mb-1">Melhor</p>
          <p className="font-serif text-lg font-bold text-green-600">
            {Math.max(...moods)}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">
            {moodEmoji(Math.max(...moods))}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-3 text-center shadow-sm">
          <p className="text-xs text-[#B08070] font-medium mb-1">Desafio</p>
          <p className="font-serif text-lg font-bold text-amber-600">
            {Math.min(...moods)}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">
            {moodEmoji(Math.min(...moods))}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-3 text-center shadow-sm">
          <p className="text-xs text-[#B08070] font-medium mb-1">Tendência</p>
          <p className={`font-serif text-lg font-bold ${trend.color}`}>
            {trend.symbol}
          </p>
          <p className="text-[10px] text-[#8B6E5A]">{records.length} dias</p>
        </div>
      </div>

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
                `${value} - ${moodLabel(value)}`,
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

      <div className="bg-[#F5EDE8] rounded-xl p-3 text-xs text-[#6B4C3B] leading-relaxed">
        <p className="font-semibold mb-1.5">Escala de humor:</p>
        <div className="grid grid-cols-5 gap-1">
          {MOOD_SCALE.map(step => (
            <div key={step.value} className="text-center">
              <p className="text-lg mb-0.5">{step.emoji}</p>
              <p className="text-[10px]">{step.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
