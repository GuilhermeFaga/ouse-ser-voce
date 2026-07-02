// OUSE SER VOCÊ – Avaliação Inicial e Final
import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ClipboardList, CheckCircle2 } from "lucide-react";

export default function Assessment() {
  const { state, saveInitialAssessment, saveFinalAssessment } = useApp();
  const [activeTab, setActiveTab] = useState<"initial" | "final">("initial");

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
        <button
          onClick={() => setActiveTab("initial")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "initial"
              ? "bg-white text-[#C4856A] shadow-sm"
              : "text-[#8B6E5A]"
          }`}
        >
          Avaliação Inicial
        </button>
        <button
          onClick={() => setActiveTab("final")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "final"
              ? "bg-white text-[#C4856A] shadow-sm"
              : "text-[#8B6E5A]"
          }`}
        >
          Avaliação Final
        </button>
      </div>

      <div>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "initial" ? (
            <InitialAssessmentForm
              existing={state.initialAssessment}
              onSave={saveInitialAssessment}
            />
          ) : (
            <FinalAssessmentForm
              existing={state.finalAssessment}
              onSave={saveFinalAssessment}
              canComplete={state.completedDays.length >= 28}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function InitialAssessmentForm({
  existing,
  onSave,
}: {
  existing: ReturnType<typeof useApp>["state"]["initialAssessment"];
  onSave: (data: any) => void;
}) {
  const [feeling, setFeeling] = useState(existing?.currentFeeling || 3);
  const [challenge, setChallenge] = useState(existing?.mainChallenge || "");
  const [goal, setGoal] = useState(existing?.mainGoal || "");
  const [fear, setFear] = useState(existing?.biggestFear || "");
  const [description, setDescription] = useState(
    existing?.selfDescription || ""
  );
  const [saved, setSaved] = useState(!!existing);

  const feelingLabels = ["", "Muito mal", "Mal", "Regular", "Bem", "Muito bem"];

  const handleSave = () => {
    onSave({
      mainChallenge: challenge,
      currentFeeling: feeling,
      mainGoal: goal,
      biggestFear: fear,
      selfDescription: description,
    });
    setSaved(true);
  };

  if (saved && existing) {
    return (
      <div className="space-y-4">
        <div className="bg-[#F5EDE8] rounded-2xl p-5 border-l-4 border-[#C4856A] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#C4856A] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#2C1810] text-sm">
              Avaliação inicial registrada
            </p>
            <p className="text-xs text-[#8B6E5A] mt-0.5">
              {new Date(existing.completedAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm space-y-4">
          <div>
            <p className="text-xs text-[#B08070] font-medium mb-1">
              Como eu me sentia
            </p>
            <p className="text-sm text-[#4A3728]">
              {feelingLabels[existing.currentFeeling]}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#B08070] font-medium mb-1">
              Meu maior desafio
            </p>
            <p className="text-sm text-[#4A3728] leading-relaxed">
              {existing.mainChallenge}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#B08070] font-medium mb-1">
              O que eu queria alcançar
            </p>
            <p className="text-sm text-[#4A3728] leading-relaxed">
              {existing.mainGoal}
            </p>
          </div>
          {existing.biggestFear && (
            <div>
              <p className="text-xs text-[#B08070] font-medium mb-1">
                Meu maior medo
              </p>
              <p className="text-sm text-[#4A3728] leading-relaxed">
                {existing.biggestFear}
              </p>
            </div>
          )}
          {existing.selfDescription && (
            <div>
              <p className="text-xs text-[#B08070] font-medium mb-1">
                Como eu me descrevia
              </p>
              <p className="text-sm text-[#4A3728] leading-relaxed">
                {existing.selfDescription}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setSaved(false)}
          className="text-xs text-[#B08070] hover:text-[#C4856A] transition-colors"
        >
          Editar avaliação
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#FAF6F1] rounded-2xl border border-[#F0E4DC] p-5">
        <p className="text-sm text-[#6B4C3B] leading-relaxed">
          Esta avaliação registra onde você está agora — antes de começar a
          jornada. Seja honesta. Não existe resposta certa ou errada.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm space-y-5">
        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-3">
            Como você está se sentindo hoje, de forma geral?
          </p>
          <div className="flex justify-between text-lg mb-2">
            {["😔", "😕", "😐", "🙂", "😊"].map((e, i) => (
              <button
                key={i}
                onClick={() => setFeeling(i + 1)}
                className={`text-2xl transition-transform ${feeling === i + 1 ? "scale-125" : "opacity-50 hover:opacity-75"}`}
              >
                {e}
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-[#8B6E5A]">
            {feelingLabels[feeling]}
          </p>
        </div>

        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-2">
            Qual é o seu maior desafio agora?
          </p>
          <Textarea
            value={challenge}
            onChange={e => setChallenge(e.target.value)}
            placeholder="O que mais pesa na sua vida hoje?"
            className="min-h-[80px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
          />
        </div>

        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-2">
            O que você quer alcançar com esta jornada?
          </p>
          <Textarea
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="O que você quer sentir, descobrir ou mudar?"
            className="min-h-[80px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
          />
        </div>

        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-2">
            Qual é o seu maior medo nesta jornada? (opcional)
          </p>
          <Textarea
            value={fear}
            onChange={e => setFear(e.target.value)}
            placeholder="O que você teme descobrir ou enfrentar?"
            className="min-h-[70px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
          />
        </div>

        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-2">
            Como você se descreveria em 3 palavras? (opcional)
          </p>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Três palavras honestas sobre quem você é hoje"
            className="min-h-[60px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={!challenge.trim() || !goal.trim()}
          className="w-full h-11 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl font-medium"
        >
          Salvar avaliação inicial
        </Button>
      </div>
    </div>
  );
}

function FinalAssessmentForm({
  existing,
  onSave,
  canComplete,
}: {
  existing: ReturnType<typeof useApp>["state"]["finalAssessment"];
  onSave: (data: any) => void;
  canComplete: boolean;
}) {
  const [feeling, setFeeling] = useState(existing?.currentFeeling || 4);
  const [transformation, setTransformation] = useState(
    existing?.mainTransformation || ""
  );
  const [lesson, setLesson] = useState(existing?.biggestLesson || "");
  const [commitment, setCommitment] = useState(existing?.nextCommitment || "");
  const [message, setMessage] = useState(existing?.messageToSelf || "");
  const [saved, setSaved] = useState(!!existing);

  const feelingLabels = ["", "Muito mal", "Mal", "Regular", "Bem", "Muito bem"];

  const handleSave = () => {
    onSave({
      currentFeeling: feeling,
      mainTransformation: transformation,
      biggestLesson: lesson,
      nextCommitment: commitment,
      messageToSelf: message,
    });
    setSaved(true);
  };

  if (!canComplete && !existing) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-7 h-7 text-[#C4856A]" />
        </div>
        <p className="font-serif text-lg text-[#2C1810] mb-2">Quase lá</p>
        <p className="text-[#8B6E5A] text-sm max-w-xs mx-auto">
          A avaliação final fica disponível a partir do Dia 28. Continue a
          jornada!
        </p>
      </div>
    );
  }

  if (saved && existing) {
    return (
      <div className="space-y-4">
        <div className="bg-[#F5EDE8] rounded-2xl p-5 border-l-4 border-[#C4856A] flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#C4856A] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#2C1810] text-sm">
              Avaliação final registrada
            </p>
            <p className="text-xs text-[#8B6E5A] mt-0.5">
              {new Date(existing.completedAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm space-y-4">
          <div>
            <p className="text-xs text-[#B08070] font-medium mb-1">
              Como me sinto agora
            </p>
            <p className="text-sm text-[#4A3728]">
              {feelingLabels[existing.currentFeeling]}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#B08070] font-medium mb-1">
              Minha maior transformação
            </p>
            <p className="text-sm text-[#4A3728] leading-relaxed">
              {existing.mainTransformation}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#B08070] font-medium mb-1">
              Maior aprendizado
            </p>
            <p className="text-sm text-[#4A3728] leading-relaxed">
              {existing.biggestLesson}
            </p>
          </div>
          {existing.messageToSelf && (
            <div className="bg-[#FAF6F1] rounded-xl p-4 border-l-4 border-[#C4856A]">
              <p className="text-xs text-[#B08070] mb-1">
                Mensagem para mim mesma
              </p>
              <p className="font-serif text-sm text-[#4A3728] italic leading-relaxed">
                {existing.messageToSelf}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#FAF6F1] rounded-2xl border border-[#F0E4DC] p-5">
        <p className="text-sm text-[#6B4C3B] leading-relaxed">
          Você chegou até aqui. Esta avaliação final é o espelho da sua
          transformação — compare com onde você estava no começo.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4DC] p-5 shadow-sm space-y-5">
        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-3">
            Como você está se sentindo agora?
          </p>
          <div className="flex justify-between text-lg mb-2">
            {["😔", "😕", "😐", "🙂", "😊"].map((e, i) => (
              <button
                key={i}
                onClick={() => setFeeling(i + 1)}
                className={`text-2xl transition-transform ${feeling === i + 1 ? "scale-125" : "opacity-50 hover:opacity-75"}`}
              >
                {e}
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-[#8B6E5A]">
            {feelingLabels[feeling]}
          </p>
        </div>

        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-2">
            Qual foi sua maior transformação nesses 30 dias?
          </p>
          <Textarea
            value={transformation}
            onChange={e => setTransformation(e.target.value)}
            placeholder="O que mudou em você?"
            className="min-h-[80px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
          />
        </div>

        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-2">
            Qual foi o maior aprendizado?
          </p>
          <Textarea
            value={lesson}
            onChange={e => setLesson(e.target.value)}
            placeholder="O que você descobriu que não sabia antes?"
            className="min-h-[80px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
          />
        </div>

        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-2">
            Qual compromisso você faz a partir de hoje?
          </p>
          <Textarea
            value={commitment}
            onChange={e => setCommitment(e.target.value)}
            placeholder="Uma promessa honesta para você mesma"
            className="min-h-[70px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
          />
        </div>

        <div>
          <p className="font-medium text-[#2C1810] text-sm mb-2">
            Escreva uma mensagem para você mesma (opcional)
          </p>
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="O que você quer que a mulher que você é hoje saiba?"
            className="min-h-[80px] border-[#E8D5CC] focus:border-[#C4856A] bg-[#FAF6F1] rounded-xl resize-none text-sm"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={
            !transformation.trim() || !lesson.trim() || !commitment.trim()
          }
          className="w-full h-11 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl font-medium"
        >
          Salvar avaliação final
        </Button>
      </div>
    </div>
  );
}
