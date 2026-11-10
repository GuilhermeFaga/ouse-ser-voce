import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, TrendingUp, Trophy, type LucideIcon } from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import { achievements, DAY_COUNT, getDay } from "@/journey";
import { buildShareMessage, type ShareSubject } from "@/share/messages";
import ShareInstagramButton from "@/share/ShareInstagramButton";
import {
  Action,
  Card,
  CardTitle,
  EmptyState,
  Pill,
  ProgressRail,
  Screen,
  ScreenHeader,
  Stat,
  focusRing,
} from "@/components/ds";
import { cn } from "@/lib/utils";

type Tab = "dias" | "conquistas" | "progresso";

const TABS: { id: Tab; label: string; short: string; icon: LucideIcon }[] = [
  { id: "dias", label: "Dias completados", short: "Dias", icon: Calendar },
  { id: "conquistas", label: "Conquistas", short: "Conquistas", icon: Trophy },
  { id: "progresso", label: "Progresso", short: "Progresso", icon: TrendingUp },
];

const tabId = (tab: Tab) => `share-tab-${tab}`;
const PANEL_ID = "share-panel";

/**
 * The literal opening of the text she will copy. The product banner that every
 * message starts with is skipped so the preview reads as the message body.
 */
function messagePreview(subject: ShareSubject, maxLines: number): string {
  const lines = buildShareMessage(subject)
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
  const body = lines[0]?.includes("OUSE SER VOCÊ") ? lines.slice(1) : lines;
  return body.slice(0, maxLines).join("\n");
}

const clampClass = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4" };

/** What leaves the app, in the app's own words — shown before the tap. */
function SharePreview({
  subject,
  lines,
  surface = "soft",
}: {
  subject: ShareSubject;
  lines: 2 | 3 | 4;
  /** "white" when the preview sits on a warm card. */
  surface?: "soft" | "white";
}) {
  return (
    <p
      className={cn(
        "mt-2.5 whitespace-pre-line rounded-xl border border-line px-3 py-2.5",
        "text-xs leading-relaxed text-ink-soft",
        surface === "white" ? "bg-white" : "bg-surface-soft",
        clampClass[lines]
      )}
    >
      <span className="sr-only">Vai copiar: </span>
      {messagePreview(subject, lines)}
    </p>
  );
}

function fadeUp(index: number, reduceMotion: boolean) {
  return {
    initial: reduceMotion ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion
      ? { duration: 0 }
      : {
          duration: 0.22,
          ease: "easeOut" as const,
          delay: Math.min(index, 5) * 0.03,
        },
  };
}

export default function Share() {
  const { state, completedDays, currentDay, progressPercent } = useApp();
  const { navigate } = useNavigation();
  const reduceMotion = useReducedMotion() ?? false;
  const mood = state.days[currentDay]?.mood ?? 3;
  const [tab, setTab] = useState<Tab>("dias");

  const unlocked = achievements.filter(achievement =>
    state.unlockedAchievements.includes(achievement.id)
  );
  const newestFirst = [...completedDays].sort((a, b) => b - a);

  const sharedDays = completedDays.length;
  const allDone = sharedDays >= DAY_COUNT;
  const remaining = DAY_COUNT - sharedDays;
  const openCurrentDay = () => navigate("day");

  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    dias: null,
    conquistas: null,
    progresso: null,
  });

  const moveTab = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex(item => item.id === tab);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const next = TABS[nextIndex];
    setTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <Screen>
      <ScreenHeader
        kicker="Compartilhar"
        title="Mostre sua jornada"
        description="Cada botão copia um texto pronto e abre o Instagram para você colar. Nada além do texto sai do app: seu nome, seu diário e suas avaliações ficam aqui."
      />

      <div
        role="tablist"
        aria-label="O que compartilhar"
        onKeyDown={moveTab}
        className="flex gap-1 rounded-xl border border-line bg-surface-soft p-1"
      >
        {TABS.map(item => {
          const selected = tab === item.id;
          const Icon = item.icon;
          const count =
            item.id === "dias"
              ? sharedDays
              : item.id === "conquistas"
                ? unlocked.length
                : null;
          return (
            <button
              key={item.id}
              ref={node => {
                tabRefs.current[item.id] = node;
              }}
              type="button"
              role="tab"
              id={tabId(item.id)}
              aria-selected={selected}
              aria-controls={PANEL_ID}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(item.id)}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors sm:text-sm",
                focusRing,
                selected
                  ? "bg-white text-ink shadow-[0_1px_2px_rgba(44,24,16,0.04)]"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <Icon className="hidden h-4 w-4 sm:block" aria-hidden />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.short}</span>
              {count !== null && count > 0 && (
                <span className="hidden text-[11px] tabular-nums text-ink-subtle sm:inline">
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      <motion.div
        key={tab}
        id={PANEL_ID}
        role="tabpanel"
        aria-labelledby={tabId(tab)}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.24, ease: "easeOut" }
        }
        className="space-y-5 sm:space-y-6"
      >
        {tab === "dias" &&
          (newestFirst.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Nenhum dia concluído ainda"
              body="O dia concluído vira um texto pronto para o Instagram. Ele aparece aqui, inteiro, antes de sair do app."
              action={
                <Action onClick={openCurrentDay}>
                  Abrir o dia {currentDay}
                </Action>
              }
            />
          ) : (
            <>
              <p className="text-sm leading-relaxed text-ink-muted">
                Cada texto leva o tema do dia e o humor que você registrou.
              </p>
              <Card as="div" padding="none" clip>
                <ul className="divide-y divide-line">
                  {newestFirst.map((dayNumber, index) => {
                    const day = getDay(dayNumber);
                    const subject: ShareSubject = {
                      kind: "day",
                      day: dayNumber,
                      mood: state.days[dayNumber]?.mood ?? 3,
                    };
                    return (
                      <motion.li
                        key={dayNumber}
                        {...fadeUp(index, reduceMotion)}
                        className="px-4 py-4 sm:px-5"
                      >
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <p className="font-serif text-base tabular-nums text-ink">
                            Dia {dayNumber}
                          </p>
                          <p className="min-w-0 truncate text-sm text-ink-soft">
                            {day.theme}
                          </p>
                        </div>
                        <SharePreview subject={subject} lines={2} />
                        <ShareInstagramButton
                          subject={subject}
                          size="md"
                          variant={index === 0 ? "primary" : "secondary"}
                          label={`Compartilhar o dia ${dayNumber}: ${day.theme}`}
                          className="mt-3 w-full sm:w-auto"
                        />
                      </motion.li>
                    );
                  })}
                </ul>
              </Card>
            </>
          ))}

        {tab === "conquistas" &&
          (unlocked.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="Nenhuma conquista desbloqueada ainda"
              body="As conquistas aparecem quando você fecha um marco da jornada. Elas ficam salvas neste dispositivo, mesmo que você pause."
              action={
                <Action onClick={openCurrentDay}>
                  Abrir o dia {currentDay}
                </Action>
              }
            />
          ) : (
            <>
              <p className="text-sm leading-relaxed text-ink-muted">
                Cada texto leva o título e a descrição da conquista.
              </p>
              <Card as="div" padding="none" clip>
                <ul className="divide-y divide-line">
                  {unlocked.map((achievement, index) => {
                    const subject: ShareSubject = {
                      kind: "achievement",
                      achievement: {
                        title: achievement.title,
                        description: achievement.description,
                      },
                    };
                    return (
                      <motion.li
                        key={achievement.id}
                        {...fadeUp(index, reduceMotion)}
                        className="px-4 py-4 sm:px-5"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg"
                            aria-hidden
                          >
                            {achievement.icon}
                          </span>
                          <p className="min-w-0 pt-1.5 text-sm font-medium text-ink">
                            {achievement.title}
                          </p>
                        </div>
                        <SharePreview subject={subject} lines={3} />
                        <ShareInstagramButton
                          subject={subject}
                          size="md"
                          variant={index === 0 ? "primary" : "secondary"}
                          label={`Compartilhar a conquista ${achievement.title}`}
                          className="mt-3 w-full sm:w-auto"
                        />
                      </motion.li>
                    );
                  })}
                </ul>
              </Card>
            </>
          ))}

        {tab === "progresso" && (
          <>
            <Card>
              <Stat
                label="Dias concluídos"
                value={sharedDays}
                unit={`de ${DAY_COUNT}`}
                emphasis
                hint={
                  allDone
                    ? "Os 30 dias concluídos continuam guardados."
                    : `Faltam ${remaining} ${
                        remaining === 1 ? "dia" : "dias"
                      } para a jornada completa.`
                }
              />
              <ProgressRail
                className="mt-4"
                value={progressPercent}
                label="Jornada"
                valueLabel={`${progressPercent}%`}
              />
              <p className="mt-3 text-xs text-ink-muted">
                {unlocked.length}{" "}
                {unlocked.length === 1
                  ? "conquista desbloqueada"
                  : "conquistas desbloqueadas"}
              </p>
            </Card>

            {sharedDays === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="Ainda não há progresso para compartilhar"
                body="A contagem começa no primeiro dia concluído. O texto que sai do app aparece aqui antes de você copiar."
                action={
                  <Action onClick={openCurrentDay}>
                    Abrir o dia {currentDay}
                  </Action>
                }
              />
            ) : (
              <Card tone="warm">
                <CardTitle
                  hint={
                    allDone ? (
                      <Pill tone="success">jornada completa</Pill>
                    ) : (
                      <Pill tone="brand">
                        {sharedDays} de {DAY_COUNT}
                      </Pill>
                    )
                  }
                >
                  {allDone ? "Jornada completa" : "Seu progresso em texto"}
                </CardTitle>

                <SharePreview
                  subject={
                    allDone
                      ? { kind: "journey", mood }
                      : { kind: "progress", completedDays }
                  }
                  lines={3}
                  surface="white"
                />

                <div className="mt-4 flex flex-wrap gap-2">
                  {allDone && (
                    <ShareInstagramButton
                      subject={{ kind: "journey", mood }}
                      size="lg"
                      variant="primary"
                      label="Compartilhar a jornada completa"
                      className="w-full sm:w-auto"
                    />
                  )}
                  <ShareInstagramButton
                    subject={{ kind: "progress", completedDays }}
                    size={allDone ? "md" : "lg"}
                    variant={allDone ? "secondary" : "primary"}
                    label={`Compartilhar meus ${sharedDays} dias`}
                    className="w-full sm:w-auto"
                  />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                  Copia o texto e abre o Instagram. Cole no story ou na legenda
                  do post.
                </p>
              </Card>
            )}
          </>
        )}
      </motion.div>
    </Screen>
  );
}
