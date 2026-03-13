import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import CitiesPage from "./pages/CitiesPage";
import CityDetailPage from "./pages/CityDetailPage";
import ExplorePage from "./pages/ExplorePage";
import EventsPage from "./pages/EventsPage";
import EstablishmentDetailPage from "./pages/EstablishmentDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import EstablishmentsAdminPage from "./pages/admin/EstablishmentsAdminPage";
import CitiesAdminPage from "./pages/admin/CitiesAdminPage";
import CategoriesAdminPage from "./pages/admin/CategoriesAdminPage";
import TagsAdminPage from "./pages/admin/TagsAdminPage";
import EventsAdminPage from "./pages/admin/EventsAdminPage";
import BannersAdminPage from "./pages/admin/BannersAdminPage";
import SobrePage from "./pages/SobrePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/paineladmin");
  const isAuth = ["/login", "/cadastro", "/esqueci-senha", "/reset-password", "/paineladmin/login"].includes(location.pathname);
  const hideChrome = isAdmin || isAuth;

  return (
    <>
      {!hideChrome && <Header />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cidades" element={<CitiesPage />} />
        <Route path="/cidades/:slug" element={<CityDetailPage />} />
        <Route path="/explorar" element={<ExplorePage />} />
        <Route path="/eventos" element={<EventsPage />} />
        <Route path="/estabelecimento/:id" element={<EstablishmentDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/paineladmin/login" element={<AdminLoginPage />} />
        <Route path="/paineladmin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="estabelecimentos" element={<EstablishmentsAdminPage />} />
          <Route path="cidades" element={<CitiesAdminPage />} />
          <Route path="categorias" element={<CategoriesAdminPage />} />
          <Route path="tags" element={<TagsAdminPage />} />
          <Route path="eventos" element={<EventsAdminPage />} />
          <Route path="banners" element={<BannersAdminPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
