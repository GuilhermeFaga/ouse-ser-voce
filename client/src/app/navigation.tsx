import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useApp } from "@/app/store";
import { isDayAccessible } from "@/journey";
import {
  BookOpen,
  Bookmark,
  Calendar,
  ClipboardList,
  FileText,
  Heart,
  Home,
  PenLine,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface PageDefinition {
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  /** Shown in the sidebar/menu. Detail views are pages without a nav entry. */
  nav: boolean;
  /** Shown in the mobile bottom bar. */
  bottomBar: boolean;
  /** Hidden from everyone except the administrative e-mails. */
  adminOnly?: boolean;
}

export const APP_PAGES = [
  {
    id: "home",
    label: "Início",
    shortLabel: "Início",
    icon: Home,
    nav: true,
    bottomBar: true,
  },
  {
    id: "journey",
    label: "Jornada",
    shortLabel: "Jornada",
    icon: BookOpen,
    nav: true,
    bottomBar: true,
  },
  {
    id: "journal",
    label: "Diário",
    shortLabel: "Diário",
    icon: PenLine,
    nav: true,
    bottomBar: false,
  },
  {
    id: "notes",
    label: "Anotações",
    shortLabel: "Notas",
    icon: FileText,
    nav: true,
    bottomBar: false,
  },
  {
    id: "calendar",
    label: "Calendário",
    shortLabel: "Calendário",
    icon: Calendar,
    nav: true,
    bottomBar: false,
  },
  {
    id: "achievements",
    label: "Conquistas",
    shortLabel: "Conquistas",
    icon: Trophy,
    nav: true,
    bottomBar: true,
  },
  {
    id: "community",
    label: "Comunidade",
    shortLabel: "Comunidade",
    icon: Users,
    nav: true,
    bottomBar: true,
  },
  {
    id: "scanner",
    label: "Scanner",
    shortLabel: "Scanner",
    icon: Sparkles,
    nav: true,
    bottomBar: false,
  },
  {
    id: "assessment",
    label: "Avaliação",
    shortLabel: "Avaliação",
    icon: ClipboardList,
    nav: true,
    bottomBar: false,
  },
  {
    id: "favorites",
    label: "Favoritos",
    shortLabel: "Favoritos",
    icon: Bookmark,
    nav: true,
    bottomBar: false,
  },
  {
    id: "profile",
    label: "Soraya Farias",
    shortLabel: "Soraya",
    icon: Heart,
    nav: true,
    bottomBar: false,
  },
  {
    id: "share",
    label: "Compartilhar",
    shortLabel: "Compartilhar",
    icon: Share2,
    nav: true,
    bottomBar: true,
  },
  {
    id: "settings",
    label: "Config.",
    shortLabel: "Config.",
    icon: Settings,
    nav: true,
    bottomBar: false,
  },
  {
    id: "admin",
    label: "Acessos",
    shortLabel: "Acessos",
    icon: ShieldCheck,
    nav: true,
    bottomBar: false,
    adminOnly: true,
  },
  {
    id: "day",
    label: "Dia",
    shortLabel: "Dia",
    icon: BookOpen,
    nav: false,
    bottomBar: false,
  },
] as const satisfies readonly PageDefinition[];

export type AppPage = (typeof APP_PAGES)[number]["id"];

const DEFAULT_PAGE: AppPage = "home";

function pageFromHash(): AppPage {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return APP_PAGES.find(page => page.id === hash)?.id ?? DEFAULT_PAGE;
}

interface NavigationValue {
  currentPage: AppPage;
  selectedDay: number | null;
  navigate: (page: AppPage) => void;
  openDay: (day: number) => void;
}

const NavigationContext = createContext<NavigationValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const { currentDay } = useApp();
  const [currentPage, setCurrentPage] = useState<AppPage>(pageFromHash);
  const [selectedDay, setSelectedDay] = useState<number | null>(() =>
    pageFromHash() === "day" ? currentDay : null
  );

  const navigate = useCallback(
    (page: AppPage) => {
      setSelectedDay(page === "day" ? currentDay : null);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [currentDay]
  );

  const openDay = useCallback(
    (day: number) => {
      if (!isDayAccessible(day, currentDay)) return;
      setSelectedDay(day);
      setCurrentPage("day");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [currentDay]
  );

  const value = useMemo(
    () => ({ currentPage, selectedDay, navigate, openDay }),
    [currentPage, selectedDay, navigate, openDay]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}
