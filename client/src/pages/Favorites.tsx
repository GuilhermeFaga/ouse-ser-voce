import { motion, useReducedMotion } from "framer-motion";
import { Headphones, Lock, Play, Trash2 } from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import { getDay, isDayAccessible, weekOfDay } from "@/journey";
import {
  Action,
  Card,
  EmptyState,
  focusRing,
  Screen,
  ScreenHeader,
} from "@/components/ds";
import { cn } from "@/lib/utils";

const rise = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function Favorites() {
  const { state, currentDay, toggleFavoriteDay } = useApp();
  const { openDay } = useNavigation();
  const reduceMotion = useReducedMotion();

  const favorites = [...state.favoriteAudioDays].sort((a, b) => a - b);
  const total = favorites.length;
  const savedLabel = total === 1 ? "1 áudio salvo" : `${total} áudios salvos`;
  // The first saved audio she can actually open is this screen's one primary action.
  const resumeDay =
    favorites.find(day => isDayAccessible(day, currentDay)) ?? null;

  return (
    <Screen>
      <ScreenHeader
        kicker="Ouvir de novo"
        title="Favoritos"
        description={
          total === 0
            ? "Um atalho para os áudios que você salvou."
            : `${savedLabel}. Um toque retoma o áudio do dia.`
        }
      />

      {total === 0 ? (
        <EmptyState
          icon={Headphones}
          title="Nenhum áudio salvo"
          body="Toque no marcador na tela de um dia e o áudio fica aqui, para ouvir de novo quando quiser."
          action={
            <Action
              onClick={() => openDay(currentDay)}
              icon={<Play className="h-4 w-4" aria-hidden />}
            >
              Ouvir o áudio do dia {currentDay}
            </Action>
          }
        />
      ) : (
        <div className="space-y-3">
          <Card as="div" padding="none">
            <ul className="divide-y divide-line">
              {favorites.map((dayNumber, index) => {
                const day = getDay(dayNumber);
                const week = weekOfDay(dayNumber);
                const accessible = isDayAccessible(dayNumber, currentDay);
                const isPrimary = dayNumber === resumeDay;

                return (
                  <motion.li
                    key={dayNumber}
                    initial={reduceMotion ? false : rise.initial}
                    animate={rise.animate}
                    transition={{
                      duration: 0.22,
                      ease: "easeOut",
                      delay: index * 0.03,
                    }}
                    className="flex items-stretch"
                  >
                    {/* The row is the button: one tap resumes the audio. */}
                    <button
                      type="button"
                      onClick={() => openDay(dayNumber)}
                      disabled={!accessible}
                      aria-label={
                        accessible
                          ? `Ouvir o áudio do dia ${dayNumber}: ${day.title}`
                          : `Dia ${dayNumber} bloqueado, abre quando você chegar no dia ${dayNumber}`
                      }
                      title={
                        accessible
                          ? `Ouvir o áudio do dia ${dayNumber}`
                          : `Abre no dia ${dayNumber}`
                      }
                      className={cn(
                        "flex min-h-16 flex-1 items-center gap-3 px-4 py-3 text-left transition-colors sm:px-5",
                        focusRing,
                        "focus-visible:ring-inset",
                        isPrimary && "bg-brand-wash",
                        accessible && !isPrimary && "hover:bg-surface-soft",
                        !accessible && "cursor-not-allowed bg-surface/60"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                          accessible
                            ? cn("text-ink", week.palette.dot)
                            : "border border-line bg-white/70 text-ink-muted"
                        )}
                        aria-hidden
                      >
                        {dayNumber}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-1.5 text-[11px]">
                          <span
                            className={cn(
                              "font-semibold uppercase tracking-[0.12em]",
                              accessible ? week.palette.text : "text-ink-subtle"
                            )}
                          >
                            Dia {dayNumber}
                          </span>
                          <span className="text-ink-faint" aria-hidden>
                            ·
                          </span>
                          <span className="tabular-nums text-ink-muted">
                            {week.subtitle} · {day.meditationDuration}
                          </span>
                        </span>

                        <span
                          className={cn(
                            "mt-0.5 block truncate font-serif text-base leading-snug",
                            accessible ? "text-ink" : "text-ink-muted"
                          )}
                        >
                          {day.title}
                        </span>

                        {!accessible && (
                          <span className="mt-1 flex items-center gap-1 text-[11px] leading-snug text-ink-muted">
                            <Lock className="h-3 w-3 shrink-0" aria-hidden />
                            Abre quando você chegar no dia {dayNumber}.
                          </span>
                        )}
                      </span>

                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                          isPrimary
                            ? "bg-brand text-white"
                            : accessible
                              ? "border border-line-strong bg-white text-brand-ink"
                              : "border border-line bg-white/70 text-ink-faint"
                        )}
                        aria-hidden
                      >
                        <Play className="h-3.5 w-3.5 translate-x-[1px]" />
                      </span>
                    </button>

                    {/* Removal stays a separate, always-visible 44px target. */}
                    <div className="flex shrink-0 items-center pr-2">
                      <button
                        type="button"
                        onClick={() => toggleFavoriteDay(dayNumber)}
                        aria-label={`Remover o áudio do dia ${dayNumber} dos favoritos`}
                        title="Remover dos favoritos"
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-destructive/5 hover:text-destructive",
                          focusRing
                        )}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </Card>

          <p className="px-1 text-xs leading-relaxed text-ink-muted">
            Novos áudios entram aqui pelo marcador, na tela do dia. Para
            remover, toque na lixeira.
          </p>
        </div>
      )}
    </Screen>
  );
}
