import { QueryClient, QueryClientProvider } from "react-query";
import React, { Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";
import { ErrorBoundary } from "react-error-boundary";
import WarningMessage from "./components/errorBoundaryWarp";
import { ReactQueryDevtools } from "react-query/devtools";
import { UseAuthentication } from "./utils/useAuthentication";
import { NotificationModal } from "./components/index.tsx";

import RenderRouter from "./routes";
import { ProgressProvider } from "./context/progressContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 2000,
      suspense: true,
    },
  },
});

const App: React.FC = () => {
  const { logout } = UseAuthentication();
  const location = useLocation();
  const currentUrl = location.pathname;
  const logError = (error: any) => {
    // console.log("app", error.response);
    const token = localStorage.getItem("token");
    if (
      error.response.message === "Expired JWT Token" &&
      error.response.code === 401
    ) {
      // message.error(error.response.message+ "Please check Re-login" );
      if (currentUrl == "/get-quotation") {
        window.location.reload();
      } else {
        NotificationModal({
          description: "Session expired",
          type: "error",
        });
        logout();
        localStorage.clear();
        window.location.reload();
      }
    } else if (error.response.errors[0].message === "Access denied.") {
      if (currentUrl == "/get-quotation") {
        window.location.reload();
      } else {
        if (token == null || token == "null") {
          NotificationModal({
            description: "Session expired",
            type: "error",
          });
          // logout();
          // localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          NotificationModal({
            description: "Access denied",
            type: "error",
          });
        }
      }
    } else {
      console.log("else", error.response.errors[0].message);
    }
  };
  useEffect(() => {
    const bc = new BroadcastChannel("auth");
    bc.onmessage = (event) => {
      if (event.data.type === "LOGOUT") {
        logout();
      } else if (event.data.type === "LOGIN") {
        // Sync login state
        localStorage.setItem("token", event.data.payload.token);
        localStorage.setItem("user", JSON.stringify(event.data.payload.user));
        window.location.reload(); // Optional: Reload to apply login state
      }
    };
    return () => bc.close();
  }, [logout]);
  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider>
        <ErrorBoundary fallback={<WarningMessage />} onError={logError}>
          <Suspense fallback={<Spin className="app-loading-wrapper" />}>
            <RenderRouter />
          </Suspense>
        </ErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </ProgressProvider>
    </QueryClientProvider>
  );
};

export default App;
