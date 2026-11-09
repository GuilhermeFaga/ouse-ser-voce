// OUSE SER VOCE - apresentacao e contatos de Soraya Farias

import { Instagram, Mail, MapPin } from "lucide-react";

const PORTRAIT_SRC = "/images/soraya-portrait.webp";

export default function ProfileSoraya() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-8">
      <section
        aria-labelledby="soraya-profile-title"
        className="overflow-hidden rounded-2xl border border-[#E8D5CC] bg-gradient-to-br from-[#F5EDE8] via-[#FAF6F1] to-white"
      >
        <div className="grid gap-7 p-6 sm:p-8 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:items-start lg:gap-10">
          <div className="mx-auto w-full max-w-[220px]">
            <img
              src={PORTRAIT_SRC}
              alt="Soraya Farias sorrindo"
              width={280}
              height={373}
              decoding="async"
              className="aspect-[3/4] w-full rounded-2xl border-4 border-white object-cover object-center shadow-sm"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[#A66E58]">
              Soraya Farias · Psicóloga clínica
            </p>
            <h1
              id="soraya-profile-title"
              className="mb-6 font-serif text-2xl leading-tight text-[#2C1810] sm:text-3xl"
            >
              Quem está com você nessa jornada
            </h1>
            <div className="space-y-4 text-sm leading-7 text-[#4A3728] sm:text-base">
              <p>
                Sou Soraya Farias, psicóloga clínica. Há mais de 15 anos,
                acompanho mulheres que querem confiar mais em si e parar de
                deixar suas vontades sempre para depois.
              </p>
              <p>
                Criei o Ouse Ser Você para ajudar você a se escutar,
                reconhecer o que importa na sua vida e se tratar com mais
                carinho e respeito.
              </p>
              <p>
                Por aqui, vou acompanhar você com reflexões e práticas para
                levar esse cuidado para o dia a dia. No seu ritmo, com espaço
                para descobrir o que faz sentido para você.
              </p>
              <p className="font-serif text-lg font-medium text-[#A66E58]">
                Que bom ter você aqui!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="soraya-contact-title">
        <h2
          id="soraya-contact-title"
          className="mb-4 font-serif text-xl text-[#2C1810]"
        >
          Contato
        </h2>
        <div className="divide-y divide-[#F0E4DC] rounded-xl border border-[#F0E4DC] bg-white px-5">
          <div className="flex items-start gap-3 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5EDE8] text-[#C4856A]">
              <MapPin aria-hidden="true" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#2C1810]">Localização</p>
              <p className="mt-1 text-sm text-[#6B4C3B]">
                São Paulo, SP · Atendimento online
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5EDE8] text-[#C4856A]">
              <Instagram aria-hidden="true" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#2C1810]">Instagram</p>
              <a
                href="https://www.instagram.com/sorayafarias.psi/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-[#A66E58] underline-offset-4 hover:underline focus-visible:underline"
              >
                @sorayafarias.psi
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5EDE8] text-[#C4856A]">
              <Mail aria-hidden="true" className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#2C1810]">E-mail</p>
              <a
                href="mailto:soraya.farias@gmail.com"
                className="mt-1 inline-block break-all text-sm text-[#A66E58] underline-offset-4 hover:underline focus-visible:underline"
              >
                soraya.farias@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
