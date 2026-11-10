import { ArrowUpRight, Instagram, Mail } from "lucide-react";
import { IMAGES } from "@/app/assets";
import {
  Card,
  CardTitle,
  Screen,
  ScreenHeader,
  focusRing,
} from "@/components/ds";

/** Facts she already states in her own bio, lifted into a scannable list. */
const FACTS = [
  { label: "Atuação", value: "Psicóloga clínica" },
  { label: "Tempo de clínica", value: "Mais de 15 anos" },
  { label: "Atendimento", value: "São Paulo, SP · Atendimento online" },
] as const;

const PRIMARY_LINK =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-base font-medium text-ink shadow-[0_1px_2px_rgba(44,24,16,0.12)] transition-colors hover:bg-brand-hover active:scale-[0.99] sm:w-auto";

export default function ProfileSoraya() {
  return (
    <Screen>
      <ScreenHeader kicker="Quem guia você" title="Soraya Farias" />

      <Card as="div" padding="none" clip>
        <div className="grid gap-5 p-5 sm:grid-cols-[176px_minmax(0,1fr)] sm:gap-7 sm:p-6">
          <img
            src={IMAGES.sorayaPortrait}
            alt="Soraya Farias sorrindo"
            width={280}
            height={373}
            decoding="async"
            className="aspect-[3/4] w-full max-w-[148px] rounded-xl border border-line-strong bg-surface-soft object-cover object-center sm:max-w-none"
          />

          <dl className="min-w-0 divide-y divide-line">
            {FACTS.map(fact => (
              <div key={fact.label} className="py-3 first:pt-0 last:pb-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  {fact.label}
                </dt>
                <dd className="mt-0.5 text-sm font-medium leading-relaxed text-ink">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-line bg-brand-wash p-5 sm:p-6">
          <div className="max-w-prose space-y-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            <p>
              Sou Soraya Farias, psicóloga clínica. Há mais de 15 anos,
              acompanho mulheres que querem confiar mais em si e parar de deixar
              suas vontades sempre para depois.
            </p>
            <p>
              Criei o Ouse Ser Você para ajudar você a se escutar, reconhecer o
              que importa na sua vida e se tratar com mais carinho e respeito.
            </p>
            <p>
              Por aqui, vou acompanhar você com reflexões e práticas para levar
              esse cuidado para o dia a dia. No seu ritmo, com espaço para
              descobrir o que faz sentido para você.
            </p>
            <p className="pt-1 font-serif text-lg leading-snug text-ink">
              Que bom ter você aqui!
            </p>
          </div>
        </div>
      </Card>

      <Card as="div">
        <CardTitle id="soraya-contact-title">Falar com Soraya</CardTitle>

        <a
          href="mailto:soraya.farias@gmail.com"
          className={`${PRIMARY_LINK} ${focusRing}`}
        >
          <Mail aria-hidden className="h-4 w-4" />
          Falar com Soraya por e-mail
        </a>
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
          <span className="font-medium break-all text-ink-soft">
            soraya.farias@gmail.com
          </span>
          {" · "}abre o aplicativo de e-mail com o endereço preenchido.
        </p>

        <div className="mt-4 border-t border-line pt-1">
          <a
            href="https://www.instagram.com/sorayafarias.psi/"
            target="_blank"
            rel="noopener noreferrer"
            className={`-mx-2 flex min-h-14 items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-surface-soft ${focusRing}`}
          >
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-soft text-brand-strong"
            >
              <Instagram className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink">
                Falar com Soraya no Instagram
              </span>
              <span className="block text-xs text-ink-muted">
                @sorayafarias.psi · abre o perfil em uma nova aba
              </span>
            </span>
            <ArrowUpRight
              aria-hidden
              className="ml-auto h-4 w-4 shrink-0 text-ink-subtle"
            />
          </a>
        </div>
      </Card>
    </Screen>
  );
}
