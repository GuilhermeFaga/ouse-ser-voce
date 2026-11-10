import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, PencilLine } from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import { moodEmoji } from "@/journey";
import {
  FEELING_SCALE,
  FINAL_ASSESSMENT_MIN_DAYS,
  feelingLabel,
  finalAssessmentUnlocked,
} from "@/assessments/assessment";
import { formatLongDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  Action,
  Card,
  CardTitle,
  Field,
  fieldInputClass,
  focusRing,
  Pill,
  ProgressRail,
  Screen,
  ScreenHeader,
  Stat,
} from "@/components/ds";

interface FieldSpec {
  key: string;
  label: string;
  placeholder: string;
  /** Why we ask — the perceived-effort lever, one line at a time. */
  hint: string;
  optional?: boolean;
}

const INITIAL_FIELDS: FieldSpec[] = [
  {
    key: "mainChallenge",
    label: "Qual é o seu maior desafio agora?",
    placeholder: "O que mais pesa na sua vida hoje?",
    hint: "Uma frase basta. É o que você vai reler no dia 28 para ver o que mudou.",
  },
  {
    key: "mainGoal",
    label: "O que você quer alcançar com esta jornada?",
    placeholder: "O que você quer sentir, descobrir ou mudar?",
    hint: "O que você quer sentir, descobrir ou mudar até o fim dos 30 dias.",
  },
  {
    key: "biggestFear",
    label: "Qual é o seu maior medo nesta jornada?",
    placeholder: "O que você teme descobrir ou enfrentar?",
    hint: "Só você lê. Nomear o medo já diminui o peso dele.",
    optional: true,
  },
  {
    key: "selfDescription",
    label: "Como você se descreveria em 3 palavras?",
    placeholder: "Três palavras honestas sobre quem você é hoje",
    hint: "Três palavras, sem pensar muito.",
    optional: true,
  },
];

const FINAL_FIELDS: FieldSpec[] = [
  {
    key: "mainTransformation",
    label: "Qual foi sua maior transformação nesses 30 dias?",
    placeholder: "O que mudou em você?",
    hint: "O que mudou em você, na prática.",
  },
  {
    key: "biggestLesson",
    label: "Qual foi o maior aprendizado?",
    placeholder: "O que você descobriu que não sabia antes?",
    hint: "O que você descobriu que não sabia antes.",
  },
  {
    key: "nextCommitment",
    label: "Qual compromisso você faz a partir de hoje?",
    placeholder: "Uma promessa honesta para você mesma",
    hint: "Você vai reler isto quando precisar lembrar do que combinou consigo.",
  },
  {
    key: "messageToSelf",
    label: "Escreva uma mensagem para você mesma",
    placeholder: "O que você quer que a mulher que você é hoje saiba?",
    hint: "Fica guardada nesta página, para reler quando precisar.",
    optional: true,
  },
];

const TABS = [
  { id: "initial", label: "Avaliação inicial" },
  { id: "final", label: "Avaliação final" },
] as const;

type TabId = (typeof TABS)[number]["id"];
type Values = Record<string, string>;

function initialValues(
  existing: {
    mainChallenge: string;
    mainGoal: string;
    biggestFear: string;
    selfDescription: string;
  } | null
): Values {
  return {
    mainChallenge: existing?.mainChallenge ?? "",
    mainGoal: existing?.mainGoal ?? "",
    biggestFear: existing?.biggestFear ?? "",
    selfDescription: existing?.selfDescription ?? "",
  };
}

function finalValues(
  existing: {
    mainTransformation: string;
    biggestLesson: string;
    nextCommitment: string;
    messageToSelf: string;
  } | null
): Values {
  return {
    mainTransformation: existing?.mainTransformation ?? "",
    biggestLesson: existing?.biggestLesson ?? "",
    nextCommitment: existing?.nextCommitment ?? "",
    messageToSelf: existing?.messageToSelf ?? "",
  };
}

export default function Assessment() {
  const {
    state,
    completedDays,
    currentDay,
    saveInitialAssessment,
    saveFinalAssessment,
  } = useApp();
  const { navigate } = useNavigation();
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<TabId>("initial");
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  const { initialAssessment, finalAssessment } = state;

  const canCompleteFinal =
    finalAssessmentUnlocked(completedDays) || finalAssessment !== null;
  const daysRemaining = Math.max(
    0,
    FINAL_ASSESSMENT_MIN_DAYS - completedDays.length
  );
  const finalLocked = tab === "final" && !canCompleteFinal;

  const fields = tab === "final" ? FINAL_FIELDS : INITIAL_FIELDS;
  const requiredCount = fields.filter(field => !field.optional).length;
  const optionalCount = fields.length - requiredCount;
  const savedInTab =
    tab === "final" ? finalAssessment !== null : initialAssessment !== null;

  const header = finalLocked
    ? {
        kicker: "Chegada",
        title: `A avaliação final abre no dia ${FINAL_ASSESSMENT_MIN_DAYS}`,
        description:
          "Até lá, o registro que conta é o do dia a dia. Sua avaliação inicial continua guardada aqui.",
      }
    : tab === "final"
      ? {
          kicker: "Chegada",
          title: "Onde você chegou",
          description:
            "Estas respostas fecham o registro dos 30 dias. O que você escreveu no começo continua guardado para comparar.",
        }
      : {
          kicker: "Ponto de partida",
          title: "Onde você está agora",
          description: `Poucas linhas, sem resposta certa. O que você escrever aqui vira a comparação que você relê no dia ${FINAL_ASSESSMENT_MIN_DAYS}.`,
        };

  const moveTab = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next: TabId = tab === "initial" ? "final" : "initial";
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Screen>
      <ScreenHeader
        kicker={header.kicker}
        title={header.title}
        description={header.description}
        actions={
          !finalLocked &&
          (savedInTab ? (
            <Pill tone="success">registrada</Pill>
          ) : (
            <Pill>
              {requiredCount} obrigatórias · {optionalCount} opcionais
            </Pill>
          ))
        }
      />

      <div
        role="tablist"
        aria-label="Avaliação inicial ou final"
        className="flex gap-1 rounded-xl border border-line bg-surface-soft p-1"
      >
        {TABS.map(item => {
          const selected = tab === item.id;
          const done =
            item.id === "final"
              ? finalAssessment !== null
              : initialAssessment !== null;
          return (
            <button
              key={item.id}
              ref={node => {
                tabRefs.current[item.id] = node;
              }}
              type="button"
              role="tab"
              id={`assessment-tab-${item.id}`}
              aria-selected={selected}
              aria-controls="assessment-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(item.id)}
              onKeyDown={moveTab}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
                focusRing,
                selected
                  ? "bg-white text-ink shadow-[0_1px_2px_rgba(44,24,16,0.04)]"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {item.label}
              {done && (
                <>
                  <Check className="h-3.5 w-3.5 text-brand-ink" aria-hidden />
                  <span className="sr-only">registrada</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <motion.div
        key={tab}
        id="assessment-panel"
        role="tabpanel"
        aria-labelledby={`assessment-tab-${tab}`}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
        }
      >
        {finalLocked ? (
          <FinalLocked
            daysRemaining={daysRemaining}
            completedCount={completedDays.length}
            currentDay={currentDay}
            onContinue={() => navigate("day")}
            initialAssessment={initialAssessment}
          />
        ) : tab === "final" ? (
          <AssessmentForm
            kind="final"
            feelingQuestion="Como você está se sentindo agora?"
            fields={FINAL_FIELDS}
            saveLabel="Salvar avaliação final"
            existing={finalAssessment}
            initialValues={finalValues(finalAssessment)}
            comparison={
              initialAssessment
                ? {
                    beforeValue: initialAssessment.currentFeeling,
                    beforeDate: initialAssessment.completedAt,
                  }
                : null
            }
            onSave={values =>
              saveFinalAssessment({
                currentFeeling: Number(values.currentFeeling),
                mainTransformation: values.mainTransformation,
                biggestLesson: values.biggestLesson,
                nextCommitment: values.nextCommitment,
                messageToSelf: values.messageToSelf,
              })
            }
          />
        ) : (
          <AssessmentForm
            kind="initial"
            feelingQuestion="Como você está se sentindo hoje, de forma geral?"
            fields={INITIAL_FIELDS}
            saveLabel="Salvar avaliação inicial"
            existing={initialAssessment}
            initialValues={initialValues(initialAssessment)}
            finalSaved={finalAssessment !== null}
            onSave={values =>
              saveInitialAssessment({
                currentFeeling: Number(values.currentFeeling),
                mainChallenge: values.mainChallenge,
                mainGoal: values.mainGoal,
                biggestFear: values.biggestFear,
                selfDescription: values.selfDescription,
              })
            }
          />
        )}
      </motion.div>
    </Screen>
  );
}

interface FinalLockedProps {
  daysRemaining: number;
  completedCount: number;
  currentDay: number;
  initialAssessment: {
    currentFeeling: number;
    completedAt: string;
    mainChallenge: string;
  } | null;
  onContinue: () => void;
}

/** Locked final: a countdown with a reachable next action, never a closed door. */
function FinalLocked({
  daysRemaining,
  completedCount,
  currentDay,
  initialAssessment,
  onContinue,
}: FinalLockedProps) {
  const plural = daysRemaining === 1 ? "dia" : "dias";

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <Stat
            label={daysRemaining === 1 ? "Falta" : "Faltam"}
            value={daysRemaining}
            unit={plural}
            emphasis
            hint="até a avaliação final abrir"
          />
          <Pill>abre no dia {FINAL_ASSESSMENT_MIN_DAYS}</Pill>
        </div>

        <ProgressRail
          className="mt-5"
          value={completedCount}
          max={FINAL_ASSESSMENT_MIN_DAYS}
          label="Dias concluídos"
          valueLabel={`${completedCount} de ${FINAL_ASSESSMENT_MIN_DAYS}`}
        />

        <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-soft">
          Quando você chegar ao dia {FINAL_ASSESSMENT_MIN_DAYS}, esta página
          abre com quatro perguntas. Até lá, o registro que importa é o do dia a
          dia.
        </p>

        <div className="mt-4">
          <Action size="lg" block onClick={onContinue}>
            Continuar o dia {currentDay}
          </Action>
        </div>
      </Card>

      {initialAssessment && (
        <Card as="div">
          <CardTitle hint={<Pill tone="success">guardada</Pill>}>
            Onde você começou
          </CardTitle>
          <p className="text-sm text-ink-soft">
            {moodEmoji(initialAssessment.currentFeeling)}{" "}
            {feelingLabel(initialAssessment.currentFeeling)}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {formatLongDate(initialAssessment.completedAt)}
          </p>
          {initialAssessment.mainChallenge.trim() !== "" && (
            <p className="mt-3 border-l-2 border-line-strong pl-3 text-sm leading-relaxed text-ink-soft">
              {initialAssessment.mainChallenge}
            </p>
          )}
          <p className="mt-3 text-xs text-ink-muted">
            É com este registro que a avaliação final vai ser comparada.
          </p>
        </Card>
      )}
    </div>
  );
}

interface AssessmentFormProps {
  kind: "initial" | "final";
  feelingQuestion: string;
  fields: FieldSpec[];
  saveLabel: string;
  existing: { currentFeeling: number; completedAt: string } | null;
  initialValues: Values;
  onSave: (values: Values) => void;
  /** Final only: her first feeling, so the arrival has something to sit beside. */
  comparison?: { beforeValue: number; beforeDate: string } | null;
  /** Initial only: once the final exists, the promise of "you will compare" is kept. */
  finalSaved?: boolean;
}

function AssessmentForm({
  kind,
  feelingQuestion,
  fields,
  saveLabel,
  existing,
  initialValues,
  onSave,
  comparison,
  finalSaved = false,
}: AssessmentFormProps) {
  const reduceMotion = useReducedMotion();
  const [feeling, setFeeling] = useState(existing?.currentFeeling ?? 3);
  const [values, setValues] = useState<Values>(initialValues);
  const [editing, setEditing] = useState(existing === null);
  const [attempted, setAttempted] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const recordRef = useRef<HTMLDivElement | null>(null);

  const optionalFields = fields.filter(field => field.optional);
  const requiredFields = fields.filter(field => !field.optional);
  const missing = requiredFields.filter(
    field => (values[field.key] ?? "").trim() === ""
  );

  const handleSave = () => {
    setAttempted(true);
    if (missing.length > 0) {
      document.getElementById(`${kind}-${missing[0].key}`)?.focus();
      return;
    }
    onSave({ ...values, currentFeeling: String(feeling) });
    setAttempted(false);
    setEditing(false);
    setJustSaved(true);
    window.setTimeout(() => recordRef.current?.focus(), 0);
  };

  if (!editing && existing) {
    const answered = fields.filter(
      field => (values[field.key] ?? "").trim() !== ""
    );
    const isFinal = kind === "final";

    return (
      <div
        ref={recordRef}
        tabIndex={-1}
        role="group"
        aria-labelledby={`${kind}-record-title`}
        className="space-y-4 focus:outline-none"
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }
          }
        >
          <Card tone="warm" as="div">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  {isFinal ? "Registro da chegada" : "Seu ponto de partida"}
                </p>
                <h2
                  id={`${kind}-record-title`}
                  className="mt-1 font-serif text-lg text-ink"
                >
                  {isFinal
                    ? "Você chegou até aqui."
                    : "Seu registro está guardado."}
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Registrado em {formatLongDate(existing.completedAt)}
                </p>
              </div>
              <Pill tone="success">
                {justSaved ? "guardado agora" : "guardado"}
              </Pill>
            </div>

            {isFinal && comparison ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.3, delay: 0.1, ease: "easeOut" }
                }
                className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-line-strong bg-surface p-4"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    No começo
                  </p>
                  <p className="mt-1 font-serif text-lg text-ink">
                    {moodEmoji(comparison.beforeValue)}{" "}
                    {feelingLabel(comparison.beforeValue)}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {formatLongDate(comparison.beforeDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                    Agora
                  </p>
                  <p className="mt-1 font-serif text-lg text-ink">
                    {moodEmoji(feeling)} {feelingLabel(feeling)}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {formatLongDate(existing.completedAt)}
                  </p>
                </div>
              </motion.div>
            ) : !isFinal ? (
              <p className="mt-4 border-t border-line-strong pt-3 text-xs leading-relaxed text-ink-soft">
                {finalSaved
                  ? "A chegada também já está registrada aqui — as duas avaliações ficam lado a lado."
                  : `No dia ${FINAL_ASSESSMENT_MIN_DAYS}, a avaliação final abre nesta página e você relê isto para comparar.`}
              </p>
            ) : null}
          </Card>
        </motion.div>

        <Card as="div">
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium text-ink-muted">
                {feelingQuestion}
              </dt>
              <dd className="mt-1 text-sm text-ink-soft">
                {moodEmoji(feeling)} {feelingLabel(feeling)}
              </dd>
            </div>
            {answered.map(field => (
              <div key={field.key}>
                <dt className="text-xs font-medium text-ink-muted">
                  {field.label}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {values[field.key]}
                </dd>
              </div>
            ))}
          </dl>

          {answered.length === 0 && (
            <p className="mt-4 rounded-xl bg-surface-soft p-3 text-xs leading-relaxed text-ink-soft">
              Só o sentimento ficou registrado. Você pode completar as respostas
              quando quiser.
            </p>
          )}

          <div className="mt-5 border-t border-line pt-4">
            <Action
              variant="secondary"
              onClick={() => setEditing(true)}
              icon={<PencilLine className="h-4 w-4" aria-hidden />}
            >
              Editar avaliação
            </Action>
          </div>
        </Card>
      </div>
    );
  }

  const renderField = (field: FieldSpec) => {
    const inputId = `${kind}-${field.key}`;
    const value = values[field.key] ?? "";
    const invalid = attempted && !field.optional && value.trim() === "";

    return (
      <Field
        key={field.key}
        label={field.label}
        htmlFor={inputId}
        hint={field.hint}
        optional={field.optional}
        required={!field.optional}
        error={invalid ? "Escreva uma frase para salvar." : null}
      >
        <textarea
          id={inputId}
          value={value}
          onChange={event =>
            setValues(previous => ({
              ...previous,
              [field.key]: event.target.value,
            }))
          }
          placeholder={field.placeholder}
          rows={3}
          className={cn(
            fieldInputClass(invalid),
            "min-h-[88px] resize-y py-3 leading-relaxed text-ink-soft"
          )}
        />
      </Field>
    );
  };

  return (
    <form
      className="space-y-4"
      onSubmit={event => {
        event.preventDefault();
        handleSave();
      }}
    >
      <Card as="div">
        <fieldset className="min-w-0">
          <legend className="text-sm font-medium text-ink">
            {feelingQuestion}
          </legend>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Já vem marcado — ajuste se precisar.
          </p>
          <div className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-2">
            {FEELING_SCALE.map(step => {
              const selected = feeling === step.value;
              return (
                <label
                  key={step.value}
                  className={cn(
                    "flex min-h-[60px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 transition-colors focus-within:ring-2 focus-within:ring-brand/40",
                    selected
                      ? "border-brand bg-brand-soft"
                      : "border-line bg-white hover:bg-surface-soft"
                  )}
                >
                  <input
                    type="radio"
                    name={`${kind}-feeling`}
                    value={step.value}
                    checked={selected}
                    onChange={() => setFeeling(step.value)}
                    className="sr-only"
                  />
                  <span aria-hidden className="text-2xl leading-none">
                    {step.emoji}
                  </span>
                  <span
                    className={cn(
                      "text-center text-[10px] leading-tight",
                      selected ? "font-semibold text-ink" : "text-ink-muted"
                    )}
                  >
                    {step.label}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-5 space-y-4 border-t border-line pt-5">
          {requiredFields.map(renderField)}
        </div>

        {optionalFields.length > 0 && (
          <div className="mt-5 space-y-4 rounded-xl border border-line bg-surface-soft p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Se quiser ir mais fundo
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                Pode deixar em branco e salvar do mesmo jeito.
              </p>
            </div>
            {optionalFields.map(renderField)}
          </div>
        )}

        <div className="mt-5 border-t border-line pt-4">
          <Action type="submit" size="lg" block>
            {saveLabel}
          </Action>
          <p className="mt-2 text-center text-xs text-ink-muted">
            {attempted && missing.length > 0
              ? `Faltam ${missing.length} ${
                  missing.length === 1 ? "resposta" : "respostas"
                } para salvar.`
              : "Fica salvo neste dispositivo · dá para editar depois"}
          </p>
        </div>
      </Card>
    </form>
  );
}
