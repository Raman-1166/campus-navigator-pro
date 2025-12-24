import { useEffect } from "react";
import { useNavigationStore } from "@/store/navigation-store";
import { useAuthStore } from "@/store/auth-store";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
// import Index from "./pages/Index"; // Removed unused import
import Navigate from "./pages/Navigate";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { GoogleOAuthProvider } from '@react-oauth/google';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Trigger fetch on mount and when auth state changes
    useNavigationStore.getState().fetchData?.();

    // Debug Google Client ID
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("CRITICAL: VITE_GOOGLE_CLIENT_ID is missing in environment variables!");
    } else {
      console.log("Google Client ID loaded:", clientId.substring(0, 10) + "...");
    }
  }, [isAuthenticated]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE"}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <Admin />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
