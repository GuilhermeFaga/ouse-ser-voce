import type { ComponentType } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider, useApp } from "@/app/store";
import { AuthProvider, useAuth } from "@/app/auth";
import { AccessProvider, useAccess } from "@/app/accessProvider";
import { CloudSyncProvider } from "@/app/sync";
import {
  NavigationProvider,
  useNavigation,
  type AppPage,
} from "@/app/navigation";
import { IMAGES } from "@/app/assets";
import AuthShell from "@/components/AuthShell";
import AppLayout from "@/components/AppLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Card, ScreenHeader } from "@/components/ds";
import Login from "@/pages/Login";
import AccessPending from "@/pages/AccessPending";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Journey from "@/pages/Journey";
import DayView from "@/pages/DayView";
import Journal from "@/pages/Journal";
import Notes from "@/pages/Notes";
import CalendarView from "@/pages/CalendarView";
import Achievements from "@/pages/Achievements";
import Scanner from "@/pages/Scanner";
import Assessment from "@/pages/Assessment";
import SettingsPage from "@/pages/SettingsPage";
import Share from "@/pages/Share";
import Community from "@/pages/Community";
import Favorites from "@/pages/Favorites";
import ProfileSoraya from "@/pages/ProfileSoraya";
import AdminAccess from "@/pages/AdminAccess";

const PAGES: Record<AppPage, ComponentType> = {
  home: Dashboard,
  journey: Journey,
  day: DayView,
  journal: Journal,
  notes: Notes,
  calendar: CalendarView,
  achievements: Achievements,
  scanner: Scanner,
  assessment: Assessment,
  settings: SettingsPage,
  share: Share,
  community: Community,
  favorites: Favorites,
  profile: ProfileSoraya,
  admin: AdminAccess,
};

function Splash() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-surface px-6">
      <div className="text-center">
        <img
          src={IMAGES.logo}
          alt=""
          aria-hidden
          className="mx-auto h-14 w-14 object-contain"
        />
        <p aria-live="polite" className="mt-4 font-serif text-lg text-ink">
          Preparando sua jornada…
        </p>
      </div>
    </div>
  );
}

function SetupRequired({ reason }: { reason: "missing" | "failed" }) {
  return (
    <AuthShell>
      <ScreenHeader
        size="display"
        kicker="Login indisponível"
        title="Não foi possível abrir o acesso."
        description={
          reason === "missing"
            ? "A configuração do Firebase não foi encontrada neste app. Defina as variáveis VITE_FIREBASE_* e recarregue a página."
            : "O login não carregou agora. Verifique sua conexão e recarregue a página."
        }
      />
      <Card className="mt-6" padding="sm">
        <p className="text-sm leading-relaxed text-ink-muted">
          Se você está vendo esta tela em produção, avise a administração.
        </p>
      </Card>
    </AuthShell>
  );
}

function AppContent() {
  const { state } = useApp();
  const { currentPage } = useNavigation();

  if (!state.onboardingComplete) return <Onboarding />;

  const Page = PAGES[currentPage];
  return (
    <AppLayout>
      <Page />
    </AppLayout>
  );
}

function AppGate() {
  const { configured, status, user } = useAuth();
  const access = useAccess();

  if (!configured) return <SetupRequired reason="missing" />;
  if (status === "loading") return <Splash />;
  if (status === "unavailable") return <SetupRequired reason="failed" />;
  if (!user) return <Login />;

  if (access.status === "checking") return <Splash />;
  if (access.status === "denied" || access.status === "error") {
    return <AccessPending />;
  }

  return (
    <CloudSyncProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </CloudSyncProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster />
      <AppProvider>
        <AuthProvider>
          <AccessProvider>
            <AppGate />
          </AccessProvider>
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
