import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CreateWorkflow from "@/pages/CreateWorkflow";
import Templates from "@/pages/Templates";
import Settings from "@/pages/Settings";
import WorkflowList from "@/pages/WorkflowList";
import SubscriptionPage from "@/pages/SubscriptionPage";
import AuthPage from "@/pages/auth-page";
import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={DashboardRoute} />
      <ProtectedRoute path="/create" component={CreateWorkflowRoute} />
      <ProtectedRoute path="/templates" component={TemplatesRoute} />
      <ProtectedRoute path="/settings" component={SettingsRoute} />
      <ProtectedRoute path="/workflows" component={WorkflowListRoute} />
      <ProtectedRoute path="/subscription" component={SubscriptionRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Wrapper components for protected routes
function DashboardRoute() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}

function CreateWorkflowRoute() {
  return (
    <AppLayout>
      <CreateWorkflow />
    </AppLayout>
  );
}

function TemplatesRoute() {
  return (
    <AppLayout>
      <Templates />
    </AppLayout>
  );
}

function SettingsRoute() {
  return (
    <AppLayout>
      <Settings />
    </AppLayout>
  );
}

function WorkflowListRoute() {
  return (
    <AppLayout>
      <WorkflowList />
    </AppLayout>
  );
}

function SubscriptionRoute() {
  return (
    <AppLayout>
      <SubscriptionPage />
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
