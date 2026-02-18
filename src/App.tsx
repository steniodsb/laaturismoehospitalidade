import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import CitiesPage from "./pages/CitiesPage";
import CityDetailPage from "./pages/CityDetailPage";
import ExplorePage from "./pages/ExplorePage";
import EventsPage from "./pages/EventsPage";
import EstablishmentDetailPage from "./pages/EstablishmentDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cidades" element={<CitiesPage />} />
          <Route path="/cidades/:slug" element={<CityDetailPage />} />
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/estabelecimento/:id" element={<EstablishmentDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
