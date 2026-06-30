import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Onboarding from "./pages/Onboarding";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Journey from "./pages/Journey";
import DayView from "./pages/DayView";
import Journal from "./pages/Journal";
import Notes from "./pages/Notes";
import CalendarView from "./pages/CalendarView";
import Achievements from "./pages/Achievements";
import Scanner from "./pages/Scanner";
import Assessment from "./pages/Assessment";
import SettingsPage from "./pages/SettingsPage";
import Share from "./pages/Share";
import Community from "./pages/Community";
import { useState } from "react";
import type { AppPage } from "./components/AppLayout";

function AppContent() {
  const { state, updateState } = useApp();
  
  // Support deep-linking via URL hash
  const getInitialPage = (): AppPage => {
    const hash = window.location.hash.replace('#', '');
    const validPages: AppPage[] = ['home', 'journey', 'day', 'journal', 'notes', 'calendar', 'achievements', 'scanner', 'assessment', 'settings', 'share', 'community'];
    if (validPages.includes(hash as AppPage)) return hash as AppPage;
    return 'home';
  };
  
  const [currentPage, setCurrentPage] = useState<AppPage>(getInitialPage);

  const handleNavigate = (page: AppPage, extra?: unknown) => {
    // Support navigating to a specific day
    if (page === "day" && typeof extra === "number") {
      updateState({ currentDay: extra as number });
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!state.onboardingComplete) {
    return <Onboarding />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <Dashboard onNavigate={handleNavigate} />;
      case "journey": return <Journey onNavigate={handleNavigate} />;
      case "day": return <DayView onNavigate={handleNavigate} />;
      case "journal": return <Journal />;
      case "notes": return <Notes />;
      case "calendar": return <CalendarView />;
      case "achievements": return <Achievements />;
      case "scanner": return <Scanner />;
      case "assessment": return <Assessment />;
      case "settings": return <SettingsPage />;
      case "share": return <Share onNavigate={handleNavigate} />;
      case "community": return <Community />;
      default: return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppLayout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </AppLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
