import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { APP_PAGES, useNavigation, type AppPage } from "@/app/navigation";
import { useApp } from "@/app/store";
import { useAccess } from "@/app/accessProvider";
import { IMAGES } from "@/app/assets";
import { DAY_COUNT } from "@/journey";
import { Action, ProgressRail } from "@/components/ds";
import CloudBadge from "@/components/CloudBadge";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { state, currentDay, progressPercent, currentStreak } = useApp();
  const { isAdmin } = useAccess();
  const { userName } = state;
  const { currentPage, navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Only the admin entry declares the optional flag, so narrow with `in`.
  const isVisible = (page: (typeof APP_PAGES)[number]) =>
    !("adminOnly" in page) || page.adminOnly !== true || isAdmin;
  const navItems = APP_PAGES.filter(page => page.nav && isVisible(page));
  const bottomNavItems = APP_PAGES.filter(
    page => page.bottomBar && isVisible(page)
  );

  const go = (page: AppPage) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  const nextDayLabel =
    currentDay >= DAY_COUNT
      ? "Revisar o último dia"
      : `Continuar o dia ${currentDay}`;

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="fixed z-20 hidden h-full w-64 flex-col border-r border-line bg-white lg:flex">
        <div className="flex items-center gap-3 border-b border-line px-5 py-5">
          <img
            src={IMAGES.logo}
            alt=""
            className="h-9 w-9 object-contain"
            aria-hidden
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

        <div className="border-b border-line px-5 py-4">
          <p className="text-xs text-ink-subtle">Olá,</p>
          <p className="mb-3 truncate text-sm font-semibold text-ink">
            {userName}
          </p>
          <ProgressRail
            value={progressPercent}
            label="Progresso"
            valueLabel={`${progressPercent}%`}
            size="sm"
          />
          <p className="mt-2 text-xs text-ink-muted">
            <span className="font-semibold tabular-nums text-brand-ink">
              {currentStreak}
            </span>{" "}
            {currentStreak === 1 ? "dia seguido" : "dias seguidos"}
          </p>
          <CloudBadge className="mt-3" />
        </div>

        <nav
          className="flex-1 overflow-y-auto py-3"
          aria-label="Navegação principal"
        >
          {navItems.map(item => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 px-5 py-2.5 text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/40",
                  active
                    ? "border-r-2 border-brand bg-brand-soft font-semibold text-brand-ink"
                    : "text-ink-soft hover:bg-surface hover:text-ink"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-brand-ink" : "text-ink-subtle"
                  )}
                  aria-hidden
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-line p-4">
          <Action
            block
            size="md"
            onClick={() => navigate("day")}
            className="text-xs"
          >
            {nextDayLabel}
          </Action>
          <p className="mt-2 text-center text-[11px] text-ink-subtle">
            Dia {currentDay} de {DAY_COUNT}
          </p>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 border-b border-line bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img
              src={IMAGES.logo}
              alt=""
              className="h-8 w-8 object-contain"
              aria-hidden
            />
            <p className="font-serif text-sm font-semibold text-ink">
              Ouse Ser Você
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium tabular-nums text-brand-ink">
              {currentStreak} {currentStreak === 1 ? "dia" : "dias"}
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
          <div
            className="fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] overflow-y-auto bg-white shadow-2xl lg:hidden"
            style={{ animation: "slideInRight 0.2s ease-out" }}
            role="dialog"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between border-b border-line p-4">
              <div>
                <p className="text-sm font-semibold text-ink">{userName}</p>
                <p className="text-xs text-ink-muted">
                  Dia {currentDay} de {DAY_COUNT}
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-ink-soft"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-b border-line bg-surface px-4 py-3">
              <ProgressRail
                value={progressPercent}
                label="Progresso"
                valueLabel={`${progressPercent}%`}
                size="sm"
              />
              <CloudBadge className="mt-2.5" />
            </div>
            <nav className="py-1" aria-label="Navegação principal">
              {navItems.map(item => {
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 px-5 py-3 text-sm transition-colors",
                      active
                        ? "bg-brand-soft font-semibold text-brand-ink"
                        : "text-ink-soft hover:bg-surface"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-brand-ink" : "text-ink-subtle"
                      )}
                      aria-hidden
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      )}

      <main className="min-h-screen flex-1 pt-14 pb-20 lg:ml-64 lg:pt-0 lg:pb-0">
        <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
          {children}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 backdrop-blur-md shadow-[0_-1px_2px_rgba(44,24,16,0.04)] lg:hidden safe-area-bottom">
        <div className="flex h-16 items-center justify-around px-1">
          {bottomNavItems.map(item => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-xl transition-colors",
                  active
                    ? "bg-brand-soft text-brand-ink"
                    : "text-ink-subtle active:bg-surface"
                )}
              >
                <item.icon
                  className={cn("h-5 w-5", active && "scale-105")}
                  aria-hidden
                />
                <span className="text-[9px] font-medium leading-tight">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
