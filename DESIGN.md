# DESIGN.md — OUSE SER VOCÊ

The shared contract for every screen. If a screen needs a pattern not described here, add it **inside that screen's file** and note it in the PR; do not invent a parallel visual language.

---

## 1. What this product is

**Promise:** a 30-day guided journey to stop abandoning yourself, written and guided by the psychologist **Soraya Farias**, delivered one day at a time.

**ICP:** Brazilian women, ~30–55, who feel disconnected from themselves after years of priorities built around others (family, work, roles). They are aware of the problem and sceptical of generic self-help. They read on the phone, at night or in short breaks.

**Awareness (Eugene Schwartz):** problem-aware, solution-sceptical. They don't need to be told they feel lost; they need to believe **this** path will be different, and to see proof it is already working after the first days.

**What "revenue" means here:** there is no checkout in this app. The business outcomes are:

1. **Activation** — she finishes day 1 and comes back the next day (TTV = the first completed day's practice).
2. **Retention** — she finishes the 30 days and keeps her record (streak, journal, achievements) as an asset she will not want to lose.
3. **Acquisition** — she shares the journey (Instagram / WhatsApp), which is the top of the funnel for Soraya's program.
4. **Lead** — she contacts Soraya through the profile/contact screen.

Never invent pricing, paywalls, testimonials, statistics or social proof. Use only content that already exists in the repo.

---

## 2. The five rules that decide every screen

1. **One job per screen.** A screen that does everything directs nothing. Each screen opens with the job in its kicker + headline, and has **exactly one primary action** per viewport (Von Restorff effect — if everything is emphasised, nothing is).
2. **Answer "what do I do now?"** Every screen must end in one obvious next action with microcopy answering *what happens, how long it takes, what it costs* ("Concluir o dia · 2 min", "Continuar o dia 4").
3. **Show progress that already started.** Day 1 is never 0%: show the practice as already underway ("você já leu a reflexão", 1 de 4 passos). Goal-gradient effect: people close loops they perceive as closeable.
4. **Retention is built from what she'd lose.** Streak, journal, achievements and favourites are shown as accumulated assets, not as static counters. Frame loss ("sua sequência de 6 dias"), never nagging.
5. **Celebrate the peak, don't just confirm it.** At the moment of highest effort (completed day, finished scan), the screen acknowledges the effort with motion and a concrete result, not a checkmark and a toast.

Secondary rules: cut cognitive load (Hick's law — options, fields and warnings all cost decision time); KPI numbers are large, tabular and top-left; no decimal noise; empty states carry the next action; a screen that shows data must also say what to do with it.

---

## 3. Design system (already implemented — use it, don't restyle it)

**Import from `@/components/ds`:**

```tsx
import {
  Action,        // button: primary | secondary | ghost | quiet | danger, sizes sm/md/lg, block
  Card,          // section shell: tones plain | warm | brand | outline; clip for edge-to-edge children
  CardTitle,     // serif h2 + optional hint
  EmptyState,    // icon + title + body + action, dashed surface
  Field,         // labelled input wrapper: label / hint / optional / required / error — it wires aria-describedby, aria-invalid and aria-required onto the control for you
  fieldInputClass, // class string for input, textarea and select
  focusRing,      // focus treatment for raw buttons/links not using Action
  Pill,          // tiny status badge: neutral | brand | warm | success | warning | danger
  ProgressRail,  // accessible rail with label + value
  Screen,        // page wrapper: vertical rhythm + mobile bottom padding
  ScreenHeader,  // kicker + serif h1 + description + actions
  Stat,          // label + big tabular value + unit + hint (emphasis for the hero KPI)
} from "@/components/ds";
```

### Colour tokens (Tailwind classes — never raw hex)

| Token | Use |
| --- | --- |
| `bg-surface` / `bg-surface-soft` | page background / inset panels |
| `bg-white` | cards |
| `border-line` / `border-line-strong` | hairline / emphasised border |
| `text-ink` | headings and primary text |
| `text-ink-soft` | body copy |
| `text-ink-muted` | supporting copy (6.5:1 on cream) |
| `text-ink-subtle` | labels, captions (4.6:1 on cream, 5.0:1 on white — do not use it on `bg-surface-soft`) |
| `text-ink-faint` | disabled |
| `text-brand-ink` | any terracotta **text or link** (5.37:1) — `text-brand` is for icons and surfaces only |
| `bg-brand` / `hover:bg-brand-hover` | primary action — **filled brand always carries `text-ink`**, never white (white on brand is 3.04:1) |
| `bg-brand-soft` / `bg-brand-wash` | selected state, warm panels |

Week colours live in `@/journey` (`getWeek(n).palette.bg|border|text|dot`). Never hardcode a week colour.

### Type scale

- Display (only Onboarding and the Dashboard greeting): `font-serif text-[30px] sm:text-[38px] leading-[1.12]`
- Page title: `ScreenHeader` default (`text-[26px] sm:text-[30px]`)
- Section title: `CardTitle` / `font-serif text-lg`
- Body: `text-sm leading-relaxed text-ink-soft`
- Label / kicker: `text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle`
- Numbers: `font-serif tabular-nums`

### Space, shape, motion

- Rhythm: `Screen` handles it (`space-y-5 sm:space-y-6`). Inside cards use `space-y-3`/`space-y-4`.
- Padding: cards `p-5 sm:p-6` (via `Card`), compact rows `px-4 py-3`.
- Radius: outer cards `rounded-2xl`, inner blocks `rounded-xl`, pills `rounded-full`.
- Borders: 1px `border-line`. No double borders, no heavy shadows — at most `shadow-[0_1px_2px_rgba(44,24,16,0.04)]`.
- Nested surfaces: a disc/badge that sits on white is `bg-brand-soft`; on a tinted surface (`bg-surface-soft`, `bg-brand-wash`) it is `bg-white`, otherwise it disappears into the card.
- A title row must not be sized by a 44px control in it (`CardTitle`'s hint slot handles this with a negative margin).
- Motion: `framer-motion` only for entrance (opacity + 8–12px rise, 200–300ms, ease-out) and for the one celebration peak. No infinite loops, no bounce, no parallax. Respect `prefers-reduced-motion` by keeping motion decorative and non-blocking.

### Touch and accessibility floor

- Interactive targets ≥ 44px (`Action` md/lg already are).
- Every icon-only button gets `aria-label`; active nav uses `aria-current="page"`.
- Visible focus: `focus-visible:ring-2 ring-brand/40` (in `Action`).
- Form fields keep a `<label>`; errors are text, not colour alone.
- Contrast: body text on cream uses `text-ink-soft` or darker. Never `text-ink-subtle` for body copy.

---

## 4. Copy rules (pt-BR)

- Second person, feminine address: "você", "seu coração", "sua jornada".
- Sentence case. No exclamation marks. No "vamos lá!", "incrível!", "poderosa!".
- Concrete over abstract: "Dia 4 de 30 · Padrões emocionais", not "continue sua evolução".
- Buttons say what happens: "Concluir o dia 4", "Salvar avaliação", "Ouvir o áudio do dia 4". Never "Enviar", "OK", "Continuar" alone when the outcome can be named.
- Microcopy under a CTA answers the friction: "3 minutos · só para você", "salvo neste dispositivo".
- Empty states: what is empty, why it matters, the one action. No apology, no cute metaphors.
- Keep Soraya's voice as it already exists in `journey/content.ts` — do not rewrite her messages, prompts or affirmations.

---

## 5. Screen map — the job, the primary action, the levers

| Screen | One job | Primary action | Levers to apply |
| --- | --- | --- | --- |
| **Onboarding** | Say what this is, for whom, and get her name | "Começar o dia 1" | 5-second clarity (what / for whom / why now); one CTA per step; started-progress (Etapa 1 de 3, bar at 33%); declared intent (the name) before effort; choice-supportive reinforcement at the end |
| **Dashboard (home)** | Answer "what do I do now?" | "Continuar o dia N" | KPI top-left (progress), streak framed as an asset, next-day preview, one primary + at most two secondary CTAs, no blank state on day 1 |
| **Journey** | Show where she is and what comes next | "Dia N" (current) | current day visually dominant, weeks scannable, locks honest (goal gradient), progress rail + per-week counts |
| **DayView** | Complete today's practice | "Concluir o dia N" | 4-step rail (reflexão → exercício → diário → áudio), value before effort, celebration as peak-end, no dead-end tab |
| **Journal** | Write today / revisit what she wrote | "Nova entrada" | retention asset framing (constância, not vanity), insight sentence above the chart, empty state → one action |
| **Notes** | Capture a thought fast | "Nova nota" | lowest friction in the app: one field focus, cards scannable, no decoration |
| **Calendar** | See adherence at a glance | day cell → detail | KPI top-left, legend honesty, selected-day detail with one next action |
| **Achievements** | Show the next unlock and the proof of the last | the action that closes the nearest gap ("Fazer o dia 4", "Escrever no diário") | goal gradient ("faltam 2 dias"), locked items state the rule, unlocked items are shareable proof |
| **Scanner** | Finish 10 questions and understand the diagnosis | "Iniciar diagnóstico" → "Fazer o dia 1" | question-at-a-time, progress from ~10%, big tap targets, one interpretation + one recommendation, results end in the next action |
| **Assessment** | Register the starting point (and later, the arrival) | "Salvar avaliação inicial" | low perceived effort (grouped fields, clear optional marks), why-we-ask microcopy, locked final state with a countdown |
| **Favorites** | Resume a saved audio | "Ouvir" | one-tap resume, locked days honest, empty state points to where favourites come from |
| **Community** | Read one story that mirrors hers | expand a story | proof before ask, precise numbers (not round), antes/depois contrast, comments as support not feed |
| **Share** | Share one thing in two taps | "Compartilhar" (per item) | show what will be shared, milestones as reasons to share, one channel clearly, no fake urgency |
| **ProfileSoraya** | Trust the person guiding her | "Falar com Soraya" (contact) | authority + human, short paragraphs, contact visible, no marketing claims |
| **Settings** | Control her data | "Salvar" (name) | low choice load, danger zone styled as danger, privacy stated in one line |

---

## 6. Definition of done for a screen

- [ ] The job is stated in the kicker/headline and there is exactly one primary action.
- [ ] Every state is designed: loading where relevant, **empty**, partial, completed, error/blocked.
- [ ] No raw hex colours, no new fonts, no new dependencies, no unused imports.
- [ ] Numbers are tabular, rounded and top-left in the hierarchy; no decimals.
- [ ] Copy follows §4; nothing invented (no testimonials, prices, stats).
- [ ] Keyboard reachable, labelled, focus visible, 44px targets.
- [ ] `pnpm check` passes for the file you touched.
- [ ] Behaviour unchanged: same store actions, same navigation, same data.
