import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Action,
  Card,
  CardTitle,
  Pill,
  ProgressRail,
  ScreenHeader,
  Field,
  fieldInputClass,
} from "@/components/ds";
import { useApp } from "@/app/store";
import { IMAGES } from "@/app/assets";
import { DAY_COUNT, getDay, weekModules } from "@/journey";
import { cn } from "@/lib/utils";

const STEP_COUNT = 3;
const STEP_NAMES = ["Boas-vindas", "A jornada", "Seu nome"] as const;
const DAY_ONE = getDay(1);
const SORAYA_QUOTE =
  "No seu ritmo, com espaço para descobrir o que faz sentido para você.";

/** Copy for each step: the job in the kicker, the promise in the headline. */
const steps = [
  {
    kicker: "Jornada guiada · 30 dias",
    title: "Voltar a se ouvir, um dia por vez.",
    description:
      "Uma prática por dia, escrita pela psicóloga Soraya Farias. Para mulheres que deixaram as próprias vontades para depois.",
    cta: "Quero começar",
    micro: "Duas etapas curtas até o dia 1.",
  },
  {
    kicker: "Quem caminha com você",
    title: "Soraya Farias, psicóloga clínica",
    description:
      "Ela escreveu as reflexões, os exercícios e as meditações das quatro semanas.",
    cta: "Dizer meu nome",
    micro: "Depois do nome, o dia 1 abre.",
  },
  {
    kicker: "Última etapa",
    title: "Como você quer ser chamada?",
    description:
      "Quero falar com você pelo nome, como numa conversa entre nós.",
    cta: "Começar o dia 1",
    micro: `Dia 1 de ${DAY_COUNT} · abre em seguida.`,
  },
];

export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const nameId = useId();

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const trimmedName = name.trim();

  const handleNext = () => {
    if (!isLast) {
      setStep(step + 1);
      setError(null);
      return;
    }
    if (!trimmedName) {
      setError("Digite seu nome para começar.");
      return;
    }
    completeOnboarding(trimmedName);
  };

  const handleBack = () => {
    setStep(previous => Math.max(0, previous - 1));
    setError(null);
  };

  const enter = reduceMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-svh bg-surface lg:flex">
      {/* Trust anchor: the person who guides the journey, not a generic illustration. */}
      <aside className="relative hidden lg:sticky lg:top-0 lg:block lg:h-svh lg:w-[44%] lg:shrink-0 lg:overflow-hidden">
        <img
          src={IMAGES.hero}
          alt="Soraya Farias, psicóloga clínica"
          className="h-full w-full object-cover object-[50%_25%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 p-8 xl:p-10">
          <p className="font-serif text-xl text-white">Soraya Farias</p>
          <p className="mt-1 text-sm text-white/85">
            Psicóloga clínica · criadora desta jornada
          </p>
        </div>
      </aside>

      <main className="flex flex-1 flex-col px-5 pb-8 pt-6 sm:px-8 sm:pt-9 lg:px-12 lg:pb-10 lg:pt-10 xl:px-16">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <p aria-live="polite" className="sr-only">
            {`Etapa ${step + 1} de ${STEP_COUNT}: ${STEP_NAMES[step]}`}
          </p>

          <div>
            <p className="font-serif text-base font-semibold leading-tight tracking-wide text-ink">
              Ouse Ser Você
            </p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-subtle">
              30 dias para mudar
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 sm:mt-10">
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="Voltar para a etapa anterior"
                className="-ml-2.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
            )}
            <ProgressRail
              value={step + 1}
              max={STEP_COUNT}
              label={`Etapa ${step + 1} de ${STEP_COUNT}`}
              valueLabel={STEP_NAMES[step]}
              size="sm"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center py-4 sm:py-8">
            <motion.div
              key={step}
              {...enter}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.26, ease: "easeOut" }
              }
              className="space-y-5"
            >
              <ScreenHeader
                size="display"
                kicker={current.kicker}
                title={current.title}
                description={current.description}
              />

              {step === 0 && (
                <Card as="div" className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <Pill className="bg-surface-soft text-ink-soft">
                      Dia 1 de {DAY_COUNT}
                    </Pill>
                    <span className="text-xs font-medium text-ink-muted">
                      {DAY_ONE.theme}
                    </span>
                  </div>
                  <p className="font-serif text-lg leading-snug text-ink">
                    {DAY_ONE.title}
                  </p>
                  <p className="text-sm leading-relaxed text-ink-soft">
                    Uma reflexão, um exercício, um diário e um áudio.
                  </p>
                  <div className="flex items-center gap-2.5 border-t border-line pt-3">
                    <img
                      src={IMAGES.sorayaPortrait}
                      alt=""
                      aria-hidden
                      className="h-7 w-7 shrink-0 rounded-full object-cover object-top"
                    />
                    <p className="text-xs text-ink-muted">
                      Escrito por Soraya Farias, psicóloga clínica
                    </p>
                  </div>
                </Card>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <Card as="div" tone="warm" className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={IMAGES.sorayaPortrait}
                        alt=""
                        aria-hidden
                        width={56}
                        height={56}
                        className="h-14 w-14 shrink-0 rounded-full object-cover object-top ring-1 ring-line-strong"
                      />
                      <div className="min-w-0">
                        <p className="font-serif text-base text-ink">
                          Soraya Farias
                        </p>
                        <p className="text-xs leading-relaxed text-ink-soft">
                          Psicóloga clínica · há mais de 15 anos acompanhando
                          mulheres
                        </p>
                      </div>
                    </div>
                    <blockquote className="border-l-2 border-brand pl-3">
                      <p className="font-serif text-sm italic leading-relaxed text-ink-soft">
                        “{SORAYA_QUOTE}”
                      </p>
                    </blockquote>
                  </Card>

                  <Card>
                    <CardTitle
                      hint={
                        <span className="tabular-nums text-ink-muted">
                          4 semanas
                        </span>
                      }
                    >
                      O caminho até o dia 30
                    </CardTitle>
                    <ol className="space-y-3">
                      {weekModules.map(week => (
                        <li key={week.week} className="flex gap-3">
                          <span
                            aria-hidden
                            className={cn(
                              "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                              week.palette.dot
                            )}
                          />
                          <div className="min-w-0">
                            <p className="text-sm leading-snug text-ink">
                              <span className="tabular-nums text-ink-muted">
                                Semana {week.week} ·{" "}
                              </span>
                              {week.title}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-muted">
                              {week.theme}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </Card>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <Field
                    label="Seu primeiro nome"
                    htmlFor={nameId}
                    hint="Só o primeiro nome basta."
                    error={error}
                  >
                    <input
                      id={nameId}
                      value={name}
                      onChange={event => {
                        setName(event.target.value);
                        setError(null);
                      }}
                      onKeyDown={event => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleNext();
                        }
                      }}
                      placeholder="Ex.: Ana"
                      autoFocus
                      autoComplete="given-name"
                      maxLength={40}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={
                        error
                          ? `${nameId}-hint ${nameId}-error`
                          : `${nameId}-hint`
                      }
                      className={cn("h-12", fieldInputClass(Boolean(error)))}
                    />
                  </Field>

                  {trimmedName && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.24, ease: "easeOut" }
                      }
                    >
                      <Card
                        as="div"
                        tone="warm"
                        padding="sm"
                        className="space-y-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <img
                            src={IMAGES.sorayaPortrait}
                            alt=""
                            aria-hidden
                            className="h-8 w-8 shrink-0 rounded-full object-cover object-top"
                          />
                          <p className="text-sm leading-relaxed text-ink">
                            Olá, {trimmedName}. Estou aqui com você.
                          </p>
                        </div>
                        <div className="border-t border-line-strong pt-3">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                            Seu ponto de partida
                          </p>
                          <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
                            <span className="font-serif text-2xl tabular-nums leading-none text-ink">
                              1
                            </span>
                            <span className="text-sm text-ink-soft">
                              de {DAY_COUNT} dias
                            </span>
                            <span aria-hidden className="text-ink-faint">
                              ·
                            </span>
                            <span className="text-sm text-ink-soft">
                              {DAY_ONE.theme}
                            </span>
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                <Action
                  block
                  size="lg"
                  onClick={handleNext}
                  disabled={isLast && !trimmedName}
                  aria-describedby="onboarding-cta-hint"
                >
                  {current.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Action>
                <p
                  id="onboarding-cta-hint"
                  className="text-center text-xs leading-relaxed text-ink-muted"
                >
                  {current.micro}
                </p>
              </div>
            </motion.div>
          </div>

          <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">
            Seus dados ficam apenas no seu dispositivo. Nenhuma informação é
            compartilhada.
          </p>
        </div>
      </main>
    </div>
  );
}
