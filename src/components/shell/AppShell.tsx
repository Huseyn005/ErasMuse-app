import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { EmergencyButton } from "./EmergencyButton";
import { OnboardingModal } from "@/components/OnboardingModal";

export function AppShell() {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header />
        <main className="flex-1 pb-24 lg:pb-10">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <EmergencyButton />
      <OnboardingModal />
    </div>
  );
}
