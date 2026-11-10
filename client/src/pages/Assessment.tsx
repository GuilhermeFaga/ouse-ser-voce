import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/app/store";
import { moodEmoji } from "@/journey";
import {
  FEELING_SCALE,
  FINAL_ASSESSMENT_MIN_DAYS,
  feelingLabel,
  finalAssessmentUnlocked,
} from "@/assessments/assessment";
import { formatLongDate } from "@/lib/dates";

interface FieldSpec {
  key: string;
  label: string;
  placeholder: string;
  optional?: boolean;
}

const INITIAL_FIELDS: FieldSpec[] = [
  {
    key: "mainChallenge",
    label: "Qual é o seu maior desafio agora?",
    placeholder: "O que mais pesa na sua vida hoje?",
  },
  {
    key: "mainGoal",
    label: "O que você quer alcançar com esta jornada?",
    placeholder: "O que você quer sentir, descobrir ou mudar?",
  },
  {
    key: "biggestFear",
    label: "Qual é o seu maior medo nesta jornada? (opcional)",
    placeholder: "O que você teme descobrir ou enfrentar?",
    optional: true,
  },
  {
    key: "selfDescription",
    label: "Como você se descreveria em 3 palavras? (opcional)",
    placeholder: "Três palavras honestas sobre quem você é hoje",
    optional: true,
  },
];

const FINAL_FIELDS: FieldSpec[] = [
  {
    key: "mainTransformation",
    label: "Qual foi sua maior transformação nesses 30 dias?",
    placeholder: "O que mudou em você?",
  },
  {
    key: "biggestLesson",
    label: "Qual foi o maior aprendizado?",
    placeholder: "O que você descobriu que não sabia antes?",
  },
  {
    key: "nextCommitment",
    label: "Qual compromisso você faz a partir de hoje?",
    placeholder: "Uma promessa honesta para você mesma",
  },
  {
    key: "messageToSelf",
    label: "Escreva uma mensagem para você mesma (opcional)",
    placeholder: "O que você quer que a mulher que você é hoje saiba?",
    optional: true,
  },
];

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
  const { state, completedDays, saveInitialAssessment, saveFinalAssessment } =
    useApp();
  const [tab, setTab] = useState<"initial" | "final">("initial");
  const { initialAssessment, finalAssessment } = state;

  const canCompleteFinal =
    finalAssessmentUnlocked(completedDays) || finalAssessment !== null;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
          Avaliação
        </h1>
        <p className="text-[#8B6E5A] text-sm">
          Registre onde você estava e onde chegou
        </p>
      </div>

      <div className="flex gap-1 bg-[#F0E4DC] rounded-xl p-1">
        {(
          [
            ["initial", "Avaliação Inicial"],
            ["final", "Avaliação Final"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? "bg-white text-[#C4856A] shadow-sm"
                : "text-[#8B6E5A]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {tab === "initial" ? (
          <AssessmentForm
            intro="Esta avaliação registra onde você está agora — antes de começar a jornada. Seja honesta. Não existe resposta certa ou errada."
            feelingQuestion="Como você está se sentindo hoje, de forma geral?"
            fields={INITIAL_FIELDS}
            saveLabel="Salvar avaliação inicial"
            completedTitle="Avaliação inicial registrada"
            existing={initialAssessment}
            initialValues={initialValues(initialAssessment)}
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
        ) : (
          <AssessmentForm
            intro="Você chegou até aqui. Esta avaliação final é o espelho da sua transformação — compare com onde você estava no começo."
            feelingQuestion="Como você está se sentindo agora?"
            fields={FINAL_FIELDS}
            saveLabel="Salvar avaliação final"
            completedTitle="Avaliação final registrada"
            existing={finalAssessment}
            initialValues={finalValues(finalAssessment)}
            lockedMessage={
              canCompleteFinal
                ? undefined
                : `A avaliação final fica disponível a partir do Dia ${FINAL_ASSESSMENT_MIN_DAYS}. Continue a jornada!`
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
        )}
      </motion.div>
    </div>
  );
}

function AssessmentForm({
  intro,
  feelingQuestion,
  fields,
  saveLabel,
  completedTitle,
  existing,
  initialValues,
  onSave,
  lockedMessage,
}: {
  intro: string;
  feelingQuestion: string;
  fields: FieldSpec[];
  saveLabel: string;
  completedTitle: string;
  existing: { currentFeeling: number; completedAt: string } | null;
  initialValues: Values;
  onSave: (values: Values) => void;
  lockedMessage?: string;
}) {
  const [feeling, setFeeling] = useState(existing?.currentFeeling ?? 3);
  const [values, setValues] = useState<Values>(initialValues);
  const [editing, setEditing] = useState(existing === null);

  if (lockedMessage && !existing) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-7 h-7 text-[#C4856A]" />
        </div>
        <p className="font-serif text-lg text-[#2C1810] mb-2">Quase lá</p>
        <p className="text-[#8B6E5A] text-sm max-w-xs mx-auto">
          {lockedMessage}
        </p>
      </div>
    );
  }

  if (!editing && existing) {
    const rows = fields
      .filter(field => values[field.key]?.trim())
      .map(field => ({ label: field.label, value: values[field.key] }));
    return (
      <div className="space-y-4">
        <div className="bg-[#F5EDE8] rounded-2xl p-5 border-l-4 border-[#C4856A] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#C4856A] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#2C1810] text-sm">
              {completedTitle}
            </p>
            <p className="text-xs text-[#8B6E5A] mt-0.5">
              {formatLongDate(existing.completedAt)}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm space-y-4">
          <div>
            <p className="text-xs text-[#B08070] font-medium mb-1">
              {feelingQuestion}
            </p>
            <p className="text-sm text-[#4A3728]">
              {moodEmoji(feeling)} {feelingLabel(feeling)}
            </p>
          </div>
          {rows.map(row => (
            <div key={row.label}>
              <p className="text-xs text-[#B08070] font-medium mb-1">
                {row.label.replace(" (opcional)", "")}
              </p>
              <p className="text-sm text-[#4A3728] leading-relaxed">
                {row.value}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-[#B08070] hover:text-[#C4856A] transition-colors"
        >
          Editar avaliação
        </button>
      </div>
    );
  }

  const canSave = fields
    .filter(field => !field.optional)
    .every(field => values[field.key]?.trim());

  return (
    <div className="space-y-4">
      <div className="bg-[#FAF6F1] rounded-2xl border border-[#F0E4DC] p-5">
        <p className="text-sm text-[#6B4C3B] leading-relaxed">{intro}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm space-y-5">
        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-3">
            {feelingQuestion}
          </p>
          <div className="flex justify-between text-lg mb-2">
            {FEELING_SCALE.map(step => (
              <button
                key={step.value}
                onClick={() => setFeeling(step.value)}
                className={`text-2xl transition-transform ${
                  feeling === step.value
                    ? "scale-125"
                    : "opacity-50 hover:opacity-75"
                }`}
              >
                {step.emoji}
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-[#8B6E5A]">
            {feelingLabel(feeling)}
          </p>
        </div>

        {fields.map(field => (
          <div key={field.key}>
            <p className="font-medium text-[#2C1810] text-sm mb-2">
              {field.label}
            </p>
            <Textarea
              value={values[field.key] ?? ""}
              onChange={event =>
                setValues(previous => ({
                  ...previous,
                  [field.key]: event.target.value,
                }))
              }
              placeholder={field.placeholder}
              className={`border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm ${
                field.optional ? "min-h-[70px]" : "min-h-[80px]"
              }`}
            />
          </div>
        ))}

        <Button
          onClick={() => {
            onSave({ ...values, currentFeeling: String(feeling) });
            setEditing(false);
          }}
          disabled={!canSave}
          className="w-full h-11 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl font-medium"
        >
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
