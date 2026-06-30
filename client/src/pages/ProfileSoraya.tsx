// OUSE SER VOCÊ – Perfil da Psicóloga Soraya Farias
// Design: Clínica Emocional Sofisticada | Credibilidade + Acolhimento

import { motion } from "framer-motion";
import {
  GraduationCap,
  Heart,
  Award,
  BookOpen,
  Users,
  Clock,
  MapPin,
  Mail,
  Instagram,
  Sparkles,
  Quote,
  CheckCircle2,
} from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80";

export default function ProfileSoraya() {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="bg-gradient-to-br from-[#F5EDE8] via-[#FAF6F1] to-[#F0E4DC] rounded-2xl p-6 sm:p-8 border border-[#E8D5CC]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={HERO_IMG}
                  alt="Soraya Farias - Psicóloga Clínica"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-400 border-3 border-white" />
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-serif text-2xl sm:text-3xl text-[#2C1810] mb-1">
                Soraya Farias
              </h1>
              <p className="text-[#C4856A] font-medium text-sm mb-2">
                Psicóloga Clínica · CRP 06/157053
              </p>
              <p className="text-[#6B4C3B] text-sm leading-relaxed max-w-md">
                Especialista em autoestima feminina, reconexão emocional e desenvolvimento pessoal.
                Criadora do programa OUSE SER VOCÊ.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                {["Autoestima", "Identidade", "Bem-estar", "Propósito"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/80 text-[#8B6E5A] text-xs font-medium rounded-full border border-[#E8D5CC]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-white rounded-xl p-5 border border-[#F0E4DC] shadow-sm"
      >
        <Quote className="w-6 h-6 text-[#E8D5CC] absolute top-4 left-4" />
        <p className="text-[#6B4C3B] italic text-sm leading-relaxed pl-8 pr-4">
          "Acredito que toda mulher carrega dentro de si uma força extraordinária. Meu trabalho é
          ajudá-la a se reconectar com essa essência — sem julgamentos, sem pressa, com profundidade
          e acolhimento genuíno."
        </p>
        <p className="text-[#C4856A] text-xs font-medium mt-3 pl-8">— Soraya Farias</p>
      </motion.div>

      {/* Biografia */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-[#C4856A]" />
          <h2 className="font-serif text-xl text-[#2C1810]">Sobre Mim</h2>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#F0E4DC] space-y-4">
          <p className="text-[#4A3728] text-sm leading-relaxed">
            Sou Soraya Farias, psicóloga clínica com mais de 10 anos de experiência no atendimento
            a mulheres que se sentem desconectadas de si mesmas. Minha jornada na psicologia começou
            pela curiosidade de entender por que tantas mulheres brilhantes se apagam ao longo da vida.
          </p>
          <p className="text-[#4A3728] text-sm leading-relaxed">
            Ao longo dos anos, percebi um padrão: mulheres entre 30 e 60 anos que dedicaram tanto
            tempo aos outros — filhos, parceiros, trabalho — que esqueceram quem são. Não por
            fraqueza, mas por excesso de entrega. Esse foi o ponto de partida para criar o programa
            OUSE SER VOCÊ.
          </p>
          <p className="text-[#4A3728] text-sm leading-relaxed">
            Minha abordagem combina psicologia clínica com práticas de autoconhecimento, oferecendo
            um caminho estruturado e acolhedor para que cada mulher possa se reencontrar, estabelecer
            limites saudáveis e construir uma vida alinhada com seus valores e desejos mais profundos.
          </p>
        </div>
      </section>

      {/* Formação e Credenciais */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-[#C4856A]" />
          <h2 className="font-serif text-xl text-[#2C1810]">Formação e Credenciais</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              title: "Graduação em Psicologia",
              institution: "Universidade de São Paulo (USP)",
              detail: "Formação completa em Psicologia Clínica",
            },
            {
              title: "Especialização em Terapia Cognitivo-Comportamental",
              institution: "Instituto de Psicologia Aplicada",
              detail: "Foco em autoestima e padrões emocionais",
            },
            {
              title: "Pós-graduação em Psicologia Positiva",
              institution: "Instituto Brasileiro de Psicologia Positiva",
              detail: "Bem-estar, propósito e florescimento humano",
            },
            {
              title: "Formação em Mindfulness e Autocompaixão",
              institution: "Center for Mindful Self-Compassion",
              detail: "Práticas contemplativas aplicadas à clínica",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-[#F0E4DC] flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#F5EDE8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Award className="w-4 h-4 text-[#C4856A]" />
              </div>
              <div>
                <p className="font-medium text-[#2C1810] text-sm">{item.title}</p>
                <p className="text-[#8B6E5A] text-xs mt-0.5">{item.institution}</p>
                <p className="text-[#B08070] text-xs mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Abordagem Terapêutica */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#C4856A]" />
          <h2 className="font-serif text-xl text-[#2C1810]">Abordagem Terapêutica</h2>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#F0E4DC] space-y-4">
          <p className="text-[#4A3728] text-sm leading-relaxed">
            Minha abordagem é integrativa e personalizada, combinando diferentes vertentes da
            psicologia para atender às necessidades únicas de cada mulher:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                name: "Terapia Cognitivo-Comportamental",
                desc: "Identificação e reestruturação de crenças limitantes",
              },
              {
                name: "Psicologia Positiva",
                desc: "Fortalecimento de recursos internos e bem-estar",
              },
              {
                name: "Mindfulness",
                desc: "Presença, autoconsciência e regulação emocional",
              },
              {
                name: "Autocompaixão",
                desc: "Gentileza consigo mesma e redução da autocrítica",
              },
            ].map((approach, i) => (
              <div key={i} className="p-3 bg-[#FAF6F1] rounded-lg border border-[#F0E4DC]">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C4856A]" />
                  <p className="font-medium text-[#2C1810] text-xs">{approach.name}</p>
                </div>
                <p className="text-[#8B6E5A] text-xs pl-5.5">{approach.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Números */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-[#C4856A]" />
          <h2 className="font-serif text-xl text-[#2C1810]">Impacto</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { number: "10+", label: "Anos de experiência" },
            { number: "2.500+", label: "Mulheres atendidas" },
            { number: "98%", label: "Satisfação" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-[#F0E4DC] text-center"
            >
              <p className="font-serif text-xl sm:text-2xl text-[#C4856A] font-bold">
                {stat.number}
              </p>
              <p className="text-[#8B6E5A] text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre o Programa */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#C4856A]" />
          <h2 className="font-serif text-xl text-[#2C1810]">Sobre o Programa</h2>
        </div>
        <div className="bg-gradient-to-br from-[#F5EDE8] to-white rounded-xl p-5 border border-[#E8D5CC]">
          <p className="text-[#4A3728] text-sm leading-relaxed mb-4">
            O programa <strong>OUSE SER VOCÊ – 30 Dias Para Mudar</strong> nasceu da minha
            experiência clínica com milhares de mulheres. É uma jornada estruturada que condensa
            os pilares mais transformadores do meu trabalho em um formato acessível e prático.
          </p>
          <div className="space-y-2">
            {[
              "Baseado em evidências científicas da psicologia",
              "Estrutura progressiva de 4 módulos semanais",
              "Exercícios práticos testados em consultório",
              "Áudios guiados para aprofundamento diário",
              "Acompanhamento do progresso emocional",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C4856A] flex-shrink-0" />
                <p className="text-[#4A3728] text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-5 h-5 text-[#C4856A]" />
          <h2 className="font-serif text-xl text-[#2C1810]">Contato</h2>
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#F0E4DC] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F5EDE8] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#C4856A]" />
            </div>
            <div>
              <p className="text-[#2C1810] text-sm font-medium">Localização</p>
              <p className="text-[#8B6E5A] text-xs">São Paulo, SP — Atendimento presencial e online</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F5EDE8] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#C4856A]" />
            </div>
            <div>
              <p className="text-[#2C1810] text-sm font-medium">Horário de atendimento</p>
              <p className="text-[#8B6E5A] text-xs">Segunda a sexta, 8h às 19h</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F5EDE8] flex items-center justify-center">
              <Instagram className="w-4 h-4 text-[#C4856A]" />
            </div>
            <div>
              <p className="text-[#2C1810] text-sm font-medium">Instagram</p>
              <p className="text-[#8B6E5A] text-xs">@soraya.farias.psi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F5EDE8] flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#C4856A]" />
            </div>
            <div>
              <p className="text-[#2C1810] text-sm font-medium">E-mail</p>
              <p className="text-[#8B6E5A] text-xs">contato@sorayafarias.com.br</p>
            </div>
          </div>
        </div>
      </section>

      {/* CRP Badge */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5EDE8] rounded-full border border-[#E8D5CC]">
          <Award className="w-4 h-4 text-[#C4856A]" />
          <span className="text-xs text-[#6B4C3B] font-medium">
            CRP 06/157053 · Conselho Regional de Psicologia
          </span>
        </div>
      </div>
    </div>
  );
}
