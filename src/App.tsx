import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import Index from "./pages/Index";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound";
import PertVisualization from "./pages/PertVisualization";
import CostSummary from "./pages/CostSummary";

const queryClient = new QueryClient();

const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <>
      <AppHeader
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onBackToHome={handleBackToHome}
      />
      <Routes>
        <Route path="/" element={<Index darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/pert-visualization" element={<PertVisualization />} />
        <Route path="/cost-summary" element={<CostSummary />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
