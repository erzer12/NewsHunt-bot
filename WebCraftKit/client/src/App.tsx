import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BackToTop } from "@/components/back-to-top";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import ServicesPage from "@/pages/services-page";
import DashboardPage from "@/pages/dashboard-page";
import PricingPage from "@/pages/pricing-page";
import PortfolioPage from "@/pages/portfolio-page";
import TeamPage from "@/pages/team-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      {/* Public pages */}
      <Route path="/" component={Home}/>
      <Route path="/about" component={AboutPage}/>
      <Route path="/services" component={ServicesPage}/>
      <Route path="/contact" component={ContactPage}/>
      <Route path="/auth" component={AuthPage}/>
      <Route path="/pricing" component={PricingPage}/>
      <Route path="/portfolio" component={PortfolioPage}/>
      <Route path="/team" component={TeamPage}/>
      
      {/* Protected pages */}
      <ProtectedRoute path="/dashboard" component={DashboardPage}/>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <BackToTop />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
