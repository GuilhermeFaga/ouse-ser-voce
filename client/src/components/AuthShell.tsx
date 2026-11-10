import type { ReactNode } from "react";
import { IMAGES } from "@/app/assets";

/** Brand frame for the screens shown before the app itself is available. */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-surface">
      <header className="px-5 pt-6 sm:px-8 sm:pt-8">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3">
          <img
            src={IMAGES.logo}
            alt=""
            aria-hidden
            className="h-10 w-10 object-contain"
          />
          <div>
            <p className="font-serif text-sm font-semibold leading-tight text-ink">
              Ouse Ser Você
            </p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-subtle">
              30 dias para mudar
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="px-5 pb-6 sm:px-8">
        <p className="mx-auto max-w-md text-center text-xs leading-relaxed text-ink-muted">
          Uma jornada guiada pela psicóloga Soraya Farias.
        </p>
      </footer>
    </div>
  );
}
