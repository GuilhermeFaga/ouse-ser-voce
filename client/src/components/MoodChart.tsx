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
  MOOD_MAX,
  MOOD_MIN,
  MOOD_SCALE,
  moodEmoji,
  moodLabel,
  moodTrend,
} from "@/journey";
import { Card, CardTitle, Pill } from "@/components/ds";
import type { DayRecord } from "@/app/state";

const TREND_PILL = {
  improving: { label: "Subindo", tone: "success" },
  declining: { label: "Caindo", tone: "warning" },
  steady: { label: "Estável", tone: "neutral" },
} as const;

/** How many entries at the end of the series keep moving in the same direction. */
function trailingRun(moods: number[]): {
  length: number;
  direction: 1 | -1 | 0;
} {
  if (moods.length < 2) return { length: moods.length, direction: 0 };
  const last = moods[moods.length - 1];
  const previous = moods[moods.length - 2];
  const direction = last > previous ? 1 : last < previous ? -1 : 0;
  if (direction === 0) return { length: 1, direction: 0 };

  let length = 1;
  for (let index = moods.length - 1; index > 0; index -= 1) {
    const step = moods[index] - moods[index - 1];
    if ((direction === 1 && step > 0) || (direction === -1 && step < 0)) {
      length += 1;
    } else {
      break;
    }
  }
  return { length, direction };
}

/** Turns the recorded moods into one finding plus what to do with it. */
function insightOf(records: DayRecord[]): { headline: string; body: string } {
  const moods = records.map(record => record.mood);
  const latest = moods[moods.length - 1];
  const average = Math.round(averageMood(moods));
  const run = trailingRun(moods);

  if (moods.length === 1) {
    return {
      headline: `Primeiro registro: humor ${moodLabel(latest).toLowerCase()}.`,
      body: "Com dois registros a curva do seu humor aparece. Escreva também amanhã para começar a comparar.",
    };
  }

  if (run.direction === 1) {
    const runStart = moodLabel(moods[moods.length - run.length]).toLowerCase();
    return {
      headline:
        run.length >= 3
          ? `Seu humor está subindo há ${run.length} registros.`
          : "Seu humor subiu no último registro.",
      body: `De ${runStart} para ${moodLabel(latest).toLowerCase()}. Uma entrada hoje mostra se a curva se mantém.`,
    };
  }

  if (run.direction === -1) {
    const runStart = moodLabel(moods[moods.length - run.length]).toLowerCase();
    return {
      headline:
        run.length >= 3
          ? `Seu humor caiu nos últimos ${run.length} registros.`
          : "Seu humor caiu no último registro.",
      body: `De ${runStart} para ${moodLabel(latest).toLowerCase()}. Os dias pesados rendem as entradas que mais valem reler — escreva hoje, mesmo uma frase.`,
    };
  }

  return {
    headline: `Seu humor está estável, perto de ${moodLabel(average).toLowerCase()}.`,
    body: "Um registro hoje já sustenta a constância e mantém o seu histórico em dia.",
  };
}

export default function MoodChart({ records }: { records: DayRecord[] }) {
  if (records.length === 0) return null;

  const moods = records.map(record => record.mood);
  const chartData = records.map(record => ({
    date: `Dia ${record.day}`,
    mood: record.mood,
  }));

  const insight = insightOf(records);
  const trend = TREND_PILL[moodTrend(moods)];

  if (records.length === 1) {
    return (
      <Card>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
          O que seu registro mostra
        </p>
        <p className="mt-1.5 font-serif text-base leading-snug text-ink">
          {insight.headline}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {insight.body}
        </p>
      </Card>
    );
  }

  const average = Math.round(averageMood(moods));
  const best = Math.max(...moods);
  const worst = Math.min(...moods);
  const firstDay = records[0].day;
  const lastDay = records[records.length - 1].day;

  return (
    <Card>
      <CardTitle hint={<Pill tone={trend.tone}>{trend.label}</Pill>}>
        Seu humor nos registros
      </CardTitle>

      <div className="rounded-xl border border-line-strong bg-brand-wash p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
          O que seus registros mostram
        </p>
        <p className="mt-1.5 font-serif text-base leading-snug text-ink">
          {insight.headline}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {insight.body}
        </p>
      </div>

      <div
        role="img"
        aria-label={`Humor registrado do dia ${firstDay} ao dia ${lastDay}, em ${records.length} registros.`}
        className="mt-4 h-[200px] w-full sm:h-[230px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="var(--border)"
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              minTickGap={24}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[MOOD_MIN, MOOD_MAX]}
              ticks={MOOD_SCALE.map(step => step.value)}
              width={30}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) => moodEmoji(value)}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "none",
                fontSize: 12,
                padding: "8px 12px",
              }}
              labelStyle={{
                color: "var(--muted-foreground)",
                fontSize: 11,
                marginBottom: 2,
              }}
              formatter={(value: number) => [
                `${moodEmoji(value)} ${moodLabel(value)}`,
                "Humor",
              ]}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="var(--chart-1)"
              fillOpacity={0.12}
              dot={{
                r: 3,
                fill: "var(--chart-1)",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "var(--chart-1)",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-2 border-t border-line pt-4 sm:grid-cols-3 sm:gap-3">
        <div className="flex items-baseline justify-between gap-3 sm:block">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Média
          </dt>
          <dd className="flex items-baseline gap-1.5 sm:mt-1">
            <span aria-hidden className="text-base leading-none">
              {moodEmoji(average)}
            </span>
            <span className="text-xs text-ink-muted">{moodLabel(average)}</span>
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 sm:block">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Melhor
          </dt>
          <dd className="flex items-baseline gap-1.5 sm:mt-1">
            <span aria-hidden className="text-base leading-none">
              {moodEmoji(best)}
            </span>
            <span className="text-xs text-ink-muted">{moodLabel(best)}</span>
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 sm:block">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            Mais pesado
          </dt>
          <dd className="flex items-baseline gap-1.5 sm:mt-1">
            <span aria-hidden className="text-base leading-none">
              {moodEmoji(worst)}
            </span>
            <span className="text-xs text-ink-muted">{moodLabel(worst)}</span>
          </dd>
        </div>
      </dl>
    </Card>
  );
}
