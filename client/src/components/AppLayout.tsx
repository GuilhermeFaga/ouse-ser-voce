// OUSE SER VOCÊ – Layout Principal
// Design: Clínica Emocional Sofisticada | Sidebar fixa + conteúdo central

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import {
  Home, BookOpen, PenLine, Calendar, Trophy, Settings,
  Sparkles, ClipboardList, Menu, X, Heart, FileText
} from "lucide-react";

const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663794059331/LaRnsfSwQVxkWuEqKwkmSE/logo-icon-5xGK2KQvieZRSNa3vjnTHA.png";

export type AppPage =
  | "home"
  | "journey"
  | "day"
  | "journal"
  | "notes"
  | "calendar"
  | "achievements"
  | "scanner"
  | "assessment"
  | "settings";

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "home", label: "Início", icon: <Home className="w-5 h-5" /> },
  { id: "journey", label: "Jornada", icon: <BookOpen className="w-5 h-5" /> },
  { id: "journal", label: "Diário", icon: <PenLine className="w-5 h-5" /> },
  { id: "notes", label: "Anotações", icon: <FileText className="w-5 h-5" /> },
  { id: "calendar", label: "Calendário", icon: <Calendar className="w-5 h-5" /> },
  { id: "achievements", label: "Conquistas", icon: <Trophy className="w-5 h-5" /> },
  { id: "scanner", label: "Scanner", icon: <Sparkles className="w-5 h-5" /> },
  { id: "assessment", label: "Avaliação", icon: <ClipboardList className="w-5 h-5" /> },
  { id: "settings", label: "Config.", icon: <Settings className="w-5 h-5" /> },
];

interface AppLayoutProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  children: React.ReactNode;
}

export default function AppLayout({ currentPage, onNavigate, children }: AppLayoutProps) {
  const { state, progressPercent, currentStreak } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#F0E4DC] fixed h-full z-20 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-[#F0E4DC]">
          <div className="flex items-center gap-3">
            <img src={LOGO_IMG} alt="Logo" className="w-8 h-8 opacity-80" />
            <div>
              <p className="font-serif text-sm font-bold text-[#2C1810] leading-tight">Ouse Ser Você</p>
              <p className="text-[10px] text-[#B08070] tracking-wide uppercase">30 Dias Para Mudar</p>
            </div>
          </div>
        </div>

        {/* User greeting */}
        <div className="px-6 py-4 border-b border-[#F0E4DC]">
          <p className="text-xs text-[#B08070] mb-1">Olá,</p>
          <p className="font-semibold text-[#2C1810] text-sm">{state.userName}</p>
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

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-all duration-150 ${
                currentPage === item.id
                  ? "bg-[#F5EDE8] text-[#C4856A] font-semibold border-r-2 border-[#C4856A]"
                  : "text-[#6B4C3B] hover:bg-[#FAF6F1] hover:text-[#C4856A]"
              }`}
            >
              <span className={currentPage === item.id ? "text-[#C4856A]" : "text-[#B08070]"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Day indicator */}
        <div className="p-4 border-t border-[#F0E4DC]">
          <div className="bg-[#F5EDE8] rounded-xl p-3 text-center">
            <p className="text-xs text-[#8B6E5A]">Dia atual</p>
            <p className="font-serif text-2xl font-bold text-[#C4856A]">{state.currentDay}</p>
            <p className="text-xs text-[#8B6E5A]">de 30</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#F0E4DC] shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <img src={LOGO_IMG} alt="Logo" className="w-7 h-7 opacity-80" />
            <p className="font-serif text-sm font-bold text-[#2C1810]">Ouse Ser Você</p>
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
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="lg:hidden fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl"
            style={{ animation: "slideInRight 0.25s ease-out" }}
          >
            <div className="p-4 border-b border-[#F0E4DC] flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#2C1810]">{state.userName}</p>
                <p className="text-xs text-[#8B6E5A]">Dia {state.currentDay} de 30</p>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[#6B4C3B]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="py-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-6 py-3.5 text-sm transition-colors ${
                    currentPage === item.id
                      ? "bg-[#F5EDE8] text-[#C4856A] font-semibold"
                      : "text-[#6B4C3B] hover:bg-[#FAF6F1]"
                  }`}
                >
                  <span className={currentPage === item.id ? "text-[#C4856A]" : "text-[#B08070]"}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0E4DC] z-20 shadow-lg">
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 5).map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                currentPage === item.id ? "text-[#C4856A]" : "text-[#B08070]"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
