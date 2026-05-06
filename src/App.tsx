import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Student from "./pages/Student.tsx";
import Parent from "./pages/Parent.tsx";
import SplitStrategyLearn from "./pages/SplitStrategyLearn.tsx";
import SplitStrategyWeDo from "./pages/SplitStrategyWeDo.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student" element={<Student />} />
          <Route path="/parent" element={<Parent />} />
          <Route path="/learn/split-strategy" element={<SplitStrategyLearn />} />
          <Route path="/learn/split-strategy/we-do" element={<SplitStrategyWeDo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
