import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/shell/AppShell";
import Index from "./pages/Index";
import Ask from "./pages/Ask";
import Move from "./pages/Move";
import Documents from "./pages/Documents";
import Explore from "./pages/Explore";
import MapPage from "./pages/MapPage";
import Campus from "./pages/Campus";
import LifeAdmin from "./pages/LifeAdmin";
import Buddies from "./pages/Buddies";
import Plan from "./pages/Plan";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="/map" element={<MapPage />} />
            <Route path="/campus" element={<Campus />} />
            <Route path="/life-admin" element={<LifeAdmin />} />
            <Route path="/buddies" element={<Buddies />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
