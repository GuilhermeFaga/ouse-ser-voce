import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Heart,
  Shield,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/app/store";
import { IMAGES } from "@/app/assets";
import { DAY_COUNT, weekModules, weekOfDay } from "@/journey";

const steps = [
  {
    id: "welcome",
    title: "Bem-vinda.",
    subtitle: "Esta jornada foi criada para você.",
    cta: "Quero começar",
  },
  {
    id: "about",
    title: "O que você vai encontrar aqui",
    subtitle: "30 dias de reflexões e práticas com Soraya Farias",
    cta: "Continuar",
  },
  {
    id: "name",
    title: "Como posso te chamar?",
    subtitle: "Quero que cada mensagem seja pessoal",
    cta: "Começar minha jornada",
  },
];

const features = [
  {
    icon: <BookOpen className="w-4 h-4" />,
    title: "Exercícios reflexivos diários",
    desc: "Práticas guiadas pela psicóloga Soraya Farias",
  },
  {
    icon: <Heart className="w-4 h-4" />,
    title: "Diário emocional",
    desc: "Espaço seguro para registrar o que sente",
  },
  {
    icon: <Star className="w-4 h-4" />,
    title: "Scanner de Essência",
    desc: "Diagnóstico personalizado do seu estado emocional",
  },
  {
    icon: <Shield className="w-4 h-4" />,
    title: "Progresso e conquistas",
    desc: "Acompanhe sua evolução dia a dia",
  },
];

export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    if (name.trim()) completeOnboarding(name.trim());
  };

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img
          src={IMAGES.hero}
          alt="Mulher confiante e serena"
          className="w-full h-svh object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FAF6F1]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E08]/60 via-transparent to-transparent" />

        <div className="absolute bottom-10 left-8 right-8">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5EDE8] flex items-center justify-center flex-shrink-0 border-2 border-[#C4856A]/30">
                <span className="text-[#C4856A] font-serif text-lg font-bold">
                  S
                </span>
              </div>
              <div>
                <p className="font-serif text-sm text-[#2C1810] italic leading-relaxed mb-1.5">
                  "No seu ritmo, com espaço para descobrir o que faz sentido para você."
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[#C4856A] font-semibold">
                    Soraya Farias
                  </p>
                  <span className="text-[#D4C4BC]">·</span>
                  <p className="text-xs text-[#8B6E5A]">Psicóloga Clínica</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: DAY_COUNT }, (_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${weekOfDay(index + 1).palette.dot}`}
                style={{ opacity: 0.6 + (index / DAY_COUNT) * 0.4 }}
              />
            ))}
          </div>
          <p className="text-white/80 text-xs mt-1.5 font-medium tracking-wide">
            30 dias · 4 módulos
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:px-12 xl:px-16">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-1">
            <img
              src={IMAGES.logo}
              alt="Ouse Ser Você"
              className="w-12 h-12 object-contain"
            />
            <div>
              <p className="font-serif text-base font-bold text-[#2C1810] tracking-wide leading-none">
                OUSE SER VOCÊ
              </p>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#C4856A] font-medium mt-0.5">
                30 Dias Para Mudar
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-1 mb-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: index <= step ? "#C4856A" : "#E8D5CC",
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-[#B08070] text-right">
              Etapa {step + 1} de {steps.length}
            </p>
          </div>

          <div key={step}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <h1 className="font-serif text-3xl lg:text-4xl text-[#2C1810] mb-2 leading-tight">
                {currentStep.title}
              </h1>
              <p className="text-[#8B6E5A] mb-6 text-sm leading-relaxed">
                {currentStep.subtitle}
              </p>

              {currentStep.id === "welcome" && (
                <div className="space-y-4">
                  <p className="text-[#4A3728] leading-relaxed text-sm lg:text-base">
                    Nos próximos 30 dias, você vai se reconectar com quem você
                    realmente é — além dos papéis que desempenha, além das
                    responsabilidades, além do que os outros esperam de você.
                  </p>
                  <p className="text-[#4A3728] leading-relaxed text-sm lg:text-base">
                    Não é sobre ser perfeita. É sobre ser honesta consigo mesma.
                  </p>

                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {weekModules.map(module => (
                      <div key={module.week} className="text-center">
                        <div
                          className={`w-full h-1.5 rounded-full mb-1.5 ${module.palette.dot}`}
                        />
                        <p className="text-[10px] text-[#8B6E5A] font-medium leading-tight">
                          {module.shortTitle}
                        </p>
                        <p className="text-[9px] text-[#B08070]">
                          Semana {module.week}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 p-4 bg-[#F5EDE8] rounded-xl border-l-4 border-[#C4856A]">
                    <p className="text-xs text-[#6B4C3B] leading-relaxed">
                      Esta jornada foi desenvolvida pela psicóloga{" "}
                      <strong>Soraya Farias</strong> para mulheres que se sentem
                      desconectadas de si mesmas.
                    </p>
                  </div>
                </div>
              )}

              {currentStep.id === "about" && (
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.3 }}
                      className="flex items-center gap-3 p-3.5 bg-white rounded-xl shadow-sm border border-[#F0E4DC]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F5EDE8] flex items-center justify-center text-[#C4856A] flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-[#2C1810] text-xs">
                          {feature.title}
                        </p>
                        <p className="text-[#8B6E5A] text-[11px] mt-0.5">
                          {feature.desc}
                        </p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-[#C4856A] ml-auto flex-shrink-0" />
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-2 flex items-center gap-3 p-4 bg-gradient-to-r from-[#F5EDE8] to-[#FAF6F1] rounded-xl border border-[#E8D5CC]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E8D5CC] flex items-center justify-center flex-shrink-0 border-2 border-[#C4856A]/30">
                      <span className="text-[#C4856A] font-serif text-base font-bold">
                        S
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-xs font-semibold text-[#2C1810]">
                          Soraya Farias
                        </p>
                      </div>
                      <p className="text-[11px] text-[#8B6E5A]">
                        Psicóloga clínica
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}

              {currentStep.id === "name" && (
                <div className="space-y-4">
                  <p className="text-[#4A3728] leading-relaxed text-sm">
                    Antes de começar, me diga seu nome. Quero que cada mensagem
                    seja pessoal — como uma conversa entre nós.
                  </p>
                  <Input
                    value={name}
                    onChange={event => setName(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === "Enter" && name.trim()) handleNext();
                    }}
                    placeholder="Seu primeiro nome"
                    className="h-12 text-base border-[#E8D5CC] focus:border-[#C4856A] bg-white rounded-xl"
                    autoFocus
                  />
                  {name.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-[#F5EDE8] rounded-xl"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#C4856A]/20 flex items-center justify-center">
                        <span className="text-[#C4856A] font-serif text-sm font-bold">
                          S
                        </span>
                      </div>
                      <p className="text-[#C4856A] text-sm font-medium">
                        Olá, {name.trim()}. Estou aqui com você.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          <div className="mt-7">
            <Button
              onClick={handleNext}
              disabled={currentStep.id === "name" && !name.trim()}
              className="w-full h-12 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl font-medium text-base transition-all duration-200 active:scale-[0.97] shadow-md shadow-[#C4856A]/25"
            >
              {currentStep.cta}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <p className="text-center text-xs text-[#B08070] mt-5 leading-relaxed">
            Seus dados ficam apenas no seu dispositivo.
            <br />
            Nenhuma informação é compartilhada.
          </p>
        </div>
      </div>
    </div>
  );
}
