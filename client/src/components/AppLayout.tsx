import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { APP_PAGES, useNavigation, type AppPage } from "@/app/navigation";
import { useApp } from "@/app/store";
import { IMAGES } from "@/app/assets";
import { DAY_COUNT } from "@/journey";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { state, currentDay, progressPercent, currentStreak } = useApp();
  const { userName } = state;
  const { currentPage, navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = APP_PAGES.filter(page => page.nav);
  const bottomNavItems = APP_PAGES.filter(page => page.bottomBar);

  const go = (page: AppPage) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#F0E4DC] fixed h-full z-20 shadow-sm">
        <div className="p-6 border-b border-[#F0E4DC]">
          <div className="flex items-center gap-3">
            <img
              src={IMAGES.logo}
              alt="Ouse Ser Você"
              className="w-10 h-10 object-contain"
            />
            <div>
              <p className="font-serif text-sm font-bold text-[#2C1810] leading-tight">
                Ouse Ser Você
              </p>
              <p className="text-[10px] text-[#B08070] tracking-wide uppercase">
                30 Dias Para Mudar
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-[#F0E4DC]">
          <p className="text-xs text-[#B08070] mb-1">Olá,</p>
          <p className="font-semibold text-[#2C1810] text-sm">{userName}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-[#8B6E5A] mb-1">
                <span>Progresso</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 bg-[#F0E4DC] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#C4856A] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#C4856A] font-medium">
              <Heart className="w-3 h-3 fill-current" />
              <span>{currentStreak}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all duration-150 ${
                currentPage === item.id
                  ? "bg-[#F5EDE8] text-[#C4856A] font-semibold border-r-2 border-[#C4856A]"
                  : "text-[#6B4C3B] hover:bg-[#FAF6F1] hover:text-[#C4856A]"
              }`}
            >
              <span
                className={
                  currentPage === item.id ? "text-[#C4856A]" : "text-[#B08070]"
                }
              >
                <item.icon className="w-5 h-5" />
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#F0E4DC]">
          <div className="bg-[#F5EDE8] rounded-xl p-3 text-center">
            <p className="text-xs text-[#8B6E5A]">Dia atual</p>
            <p className="font-serif text-2xl font-bold text-[#C4856A]">
              {currentDay}
            </p>
            <p className="text-xs text-[#8B6E5A]">de {DAY_COUNT}</p>
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F0E4DC] shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <img
              src={IMAGES.logo}
              alt="Ouse Ser Você"
              className="w-9 h-9 object-contain"
            />
            <p className="font-serif text-sm font-bold text-[#2C1810]">
              Ouse Ser Você
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-[#C4856A] font-medium">
              <Heart className="w-3 h-3 fill-current" />
              <span>{currentStreak} dias</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#6B4C3B]"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="lg:hidden fixed right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto"
            style={{ animation: "slideInRight 0.25s ease-out" }}
          >
            <div className="p-4 border-b border-[#F0E4DC] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#2C1810]">{userName}</p>
                <p className="text-xs text-[#8B6E5A]">
                  Dia {currentDay} de {DAY_COUNT}
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#6B4C3B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-4 py-3 border-b border-[#F0E4DC] bg-[#FAF6F1]">
              <div className="flex justify-between text-xs text-[#8B6E5A] mb-1">
                <span>Progresso</span>
                <span className="font-medium text-[#C4856A]">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-1.5 bg-[#F0E4DC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C4856A] rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <nav className="py-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm transition-colors ${
                    currentPage === item.id
                      ? "bg-[#F5EDE8] text-[#C4856A] font-semibold"
                      : "text-[#6B4C3B] hover:bg-[#FAF6F1]"
                  }`}
                >
                  <span
                    className={
                      currentPage === item.id
                        ? "text-[#C4856A]"
                        : "text-[#B08070]"
                    }
                  >
                    <item.icon className="w-5 h-5" />
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen pb-20 lg:pb-0">
        <div className="max-w-svw mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-10">
          {children}
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#F0E4DC] z-20 shadow-lg safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-1">
          {bottomNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-xl transition-all ${
                currentPage === item.id
                  ? "text-[#C4856A] bg-[#F5EDE8]"
                  : "text-[#B08070] active:bg-[#FAF6F1]"
              }`}
            >
              <span
                className={
                  currentPage === item.id
                    ? "scale-110 transition-transform"
                    : ""
                }
              >
                <item.icon className="w-5 h-5" />
              </span>
              <span className="text-[9px] font-medium leading-tight">
                {item.shortLabel}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
