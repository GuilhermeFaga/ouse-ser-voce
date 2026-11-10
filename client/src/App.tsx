import type { ComponentType } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider, useApp } from "@/app/store";
import {
  NavigationProvider,
  useNavigation,
  type AppPage,
} from "@/app/navigation";
import AppLayout from "@/components/AppLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
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
};

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

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <NavigationProvider>
          <Toaster />
          <AppContent />
        </NavigationProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
