// OUSE SER VOCÊ – Onboarding
// Design: Clínica Emocional Sofisticada | Playfair Display + DM Sans | Rosa pó + Creme
// Presença de Soraya Farias como psicóloga guia, identidade visual forte

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BookOpen, Heart, Star, Shield, CheckCircle2 } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663794059331/LaRnsfSwQVxkWuEqKwkmSE/hero-woman-YaCZVbHUiWAFQX2m6hz48Q.webp";
const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663794059331/LaRnsfSwQVxkWuEqKwkmSE/logo-icon-5xGK2KQvieZRSNa3vjnTHA.png";

const steps = [
  {
    id: "welcome",
    title: "Bem-vinda.",
    subtitle: "Esta jornada foi criada para você.",
    cta: "Quero começar"
  },
  {
    id: "about",
    title: "O que você vai encontrar aqui",
    subtitle: "30 dias de acompanhamento próximo com a psicóloga Soraya Farias",
    cta: "Continuar"
  },
  {
    id: "name",
    title: "Como posso te chamar?",
    subtitle: "Quero que cada mensagem seja pessoal",
    cta: "Começar minha jornada"
  }
];

const features = [
  { icon: <BookOpen className="w-4 h-4" />, title: "Exercícios reflexivos diários", desc: "Práticas guiadas pela psicóloga Soraya Farias" },
  { icon: <Heart className="w-4 h-4" />, title: "Diário emocional", desc: "Espaço seguro para registrar o que sente" },
  { icon: <Star className="w-4 h-4" />, title: "Scanner de Essência", desc: "Diagnóstico personalizado do seu estado emocional" },
  { icon: <Shield className="w-4 h-4" />, title: "Progresso e conquistas", desc: "Acompanhe sua evolução dia a dia" },
];

const journeyWeeks = [
  { week: 1, title: "Autoconhecimento", color: "#E8A090" },
  { week: 2, title: "Desapego", color: "#D4956A" },
  { week: 3, title: "Autoconfiança", color: "#C4856A" },
  { week: 4, title: "Transformação", color: "#A06040" },
];

export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
    } else {
      if (name.trim()) {
        completeOnboarding(name.trim());
      }
    }
  };

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col lg:flex-row">
      {/* Left panel - image */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Mulher confiante e serena"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#FAF6F1]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E08]/60 via-transparent to-transparent" />

        {/* Soraya's quote at bottom */}
        <div className="absolute bottom-10 left-8 right-8">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5EDE8] flex items-center justify-center flex-shrink-0 border-2 border-[#C4856A]/30">
                <span className="text-[#C4856A] font-serif text-lg font-bold">S</span>
              </div>
              <div>
                <p className="font-serif text-sm text-[#2C1810] italic leading-relaxed mb-1.5">
                  "Você não perdeu quem você é. Só parou de procurar."
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[#C4856A] font-semibold">Soraya Farias</p>
                  <span className="text-[#D4C4BC]">·</span>
                  <p className="text-xs text-[#8B6E5A]">Psicóloga Clínica</p>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 30-day journey visual */}
        <div className="absolute top-8 left-8">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: i < 7 ? "#E8A090" : i < 14 ? "#D4956A" : i < 21 ? "#C4856A" : "#A06040",
                  opacity: 0.6 + (i / 30) * 0.4,
                }}
              />
            ))}
          </div>
          <p className="text-white/80 text-xs mt-1.5 font-medium tracking-wide">30 dias · 4 módulos</p>
        </div>
      </div>

      {/* Right panel - content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:px-12 xl:px-16">
        {/* Logo & Brand */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-1">
            <img src={LOGO_IMG} alt="Logo" className="w-9 h-9 opacity-85" />
            <div>
              <p className="font-serif text-base font-bold text-[#2C1810] tracking-wide leading-none">OUSE SER VOCÊ</p>
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#C4856A] font-medium mt-0.5">30 Dias Para Mudar</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          {/* Progress line - 30-day themed */}
          <div className="mb-8">
            <div className="flex items-center gap-1 mb-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: i <= step ? "#C4856A" : "#E8D5CC",
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-[#B08070] text-right">Etapa {step + 1} de {steps.length}</p>
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
              <p className="text-[#8B6E5A] mb-6 text-sm leading-relaxed">{currentStep.subtitle}</p>

              {currentStep.id === "welcome" && (
                <div className="space-y-4">
                  <p className="text-[#4A3728] leading-relaxed text-sm lg:text-base">
                    Nos próximos 30 dias, você vai se reconectar com quem você realmente é — além dos papéis que desempenha, além das responsabilidades, além do que os outros esperam de você.
                  </p>
                  <p className="text-[#4A3728] leading-relaxed text-sm lg:text-base">
                    Não é sobre ser perfeita. É sobre ser honesta consigo mesma.
                  </p>

                  {/* Journey weeks preview */}
                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {journeyWeeks.map(w => (
                      <div key={w.week} className="text-center">
                        <div
                          className="w-full h-1.5 rounded-full mb-1.5"
                          style={{ backgroundColor: w.color }}
                        />
                        <p className="text-[10px] text-[#8B6E5A] font-medium leading-tight">{w.title}</p>
                        <p className="text-[9px] text-[#B08070]">Semana {w.week}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 p-4 bg-[#F5EDE8] rounded-xl border-l-3 border-[#C4856A]" style={{ borderLeftWidth: "3px" }}>
                    <p className="text-xs text-[#6B4C3B] leading-relaxed">
                      Esta jornada foi desenvolvida pela psicóloga <strong>Soraya Farias</strong> para mulheres entre 30 e 60 anos que se sentem desconectadas de si mesmas.
                    </p>
                  </div>
                </div>
              )}

              {currentStep.id === "about" && (
                <div className="space-y-3">
                  {features.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className="flex items-center gap-3 p-3.5 bg-white rounded-xl shadow-sm border border-[#F0E4DC]"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F5EDE8] flex items-center justify-center text-[#C4856A] flex-shrink-0">
                        {f.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-[#2C1810] text-xs">{f.title}</p>
                        <p className="text-[#8B6E5A] text-[11px] mt-0.5">{f.desc}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-[#C4856A] ml-auto flex-shrink-0" />
                    </motion.div>
                  ))}

                  {/* Soraya presence */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mt-2 flex items-center gap-3 p-4 bg-gradient-to-r from-[#F5EDE8] to-[#FAF6F1] rounded-xl border border-[#E8D5CC]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E8D5CC] flex items-center justify-center flex-shrink-0 border-2 border-[#C4856A]/30">
                      <span className="text-[#C4856A] font-serif text-base font-bold">S</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-xs font-semibold text-[#2C1810]">Soraya Farias</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="text-[10px] text-green-600 font-medium">Disponível</span>
                      </div>
                      <p className="text-[11px] text-[#8B6E5A]">Psicóloga Clínica · CRP 06/157053</p>
                    </div>
                  </motion.div>
                </div>
              )}

              {currentStep.id === "name" && (
                <div className="space-y-4">
                  <p className="text-[#4A3728] leading-relaxed text-sm">
                    Antes de começar, me diga seu nome. Quero que cada mensagem seja pessoal — como uma conversa entre nós.
                  </p>
                  <div className="space-y-2">
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && name.trim() && handleNext()}
                      placeholder="Seu primeiro nome"
                      className="h-12 text-base border-[#E8D5CC] focus:border-[#C4856A] bg-white rounded-xl"
                      autoFocus
                    />
                  </div>
                  {name.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-[#F5EDE8] rounded-xl"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#C4856A]/20 flex items-center justify-center">
                        <span className="text-[#C4856A] font-serif text-sm font-bold">S</span>
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
            Seus dados ficam apenas no seu dispositivo.<br />Nenhuma informação é compartilhada.
          </p>
        </div>
      </div>
    </div>
  );
}
