import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIModeProvider } from "@/contexts/AIModeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AppShell } from "@/components/shell/AppShell";
import Index from "./pages/Index";
import Ask from "./pages/Ask";
import Move from "./pages/Move";
import Documents from "./pages/Documents";
import Explore from "./pages/Explore";
import Campus from "./pages/Campus";
import LifeAdmin from "./pages/LifeAdmin";
import Buddies from "./pages/Buddies";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AIModeProvider>
    <SidebarProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Index />} />
            <Route path="/ask" element={<Ask />} />
            <Route path="/move" element={<Move />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/campus" element={<Campus />} />
            <Route path="/life-admin" element={<LifeAdmin />} />
            <Route path="/buddies" element={<Buddies />} />
            <Route path="/plan" element={<Navigate to="/buddies?tab=my-plan" replace />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </SidebarProvider>
    </AIModeProvider>
  </QueryClientProvider>
);

export default App;
