import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteHeader from "./components/SiteHeader.tsx";
import Index from "./pages/Index.tsx";
import Student from "./pages/Student.tsx";
import ContentHome from "./pages/ContentHome.tsx";
import Parent from "./pages/Parent.tsx";
import AdditionStrategies from "./pages/AdditionStrategies.tsx";
import SubtractionStrategies from "./pages/SubtractionStrategies.tsx";
import SplitStrategyLanding from "./pages/SplitStrategyLanding.tsx";
import SplitStrategyLearn from "./pages/SplitStrategyLearn.tsx";
import SplitStrategyWeDo from "./pages/SplitStrategyWeDo.tsx";
import SplitStrategyYouDo from "./pages/SplitStrategyYouDo.tsx";
import SplitStrategyPractise from "./pages/SplitStrategyPractise.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student" element={<Student />} />
          <Route path="/parent" element={<Parent />} />
          <Route path="/student/addition" element={<AdditionStrategies />} />
          <Route path="/student/subtraction" element={<SubtractionStrategies />} />
          <Route path="/split-strategy" element={<SplitStrategyLanding />} />
          <Route path="/learn/split-strategy" element={<SplitStrategyLearn />} />
          <Route path="/learn/split-strategy/we-do" element={<SplitStrategyWeDo />} />
          <Route path="/learn/split-strategy/you-do" element={<SplitStrategyYouDo />} />
          <Route path="/practise/split-strategy" element={<SplitStrategyPractise />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
