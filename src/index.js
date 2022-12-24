import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource/roboto";
import "@fontsource/poppins";

// styles
import "./index.css";

// animations
import "./assets/animations/shake.css";

// context
import { ModeProvider } from "./context/ModeProvider";
import { HistoryProvider } from "./context/HistoryProvider";
import { LanguageProvider } from "./context/LanguageProvider";
import { NotificationProvider } from "./context/NotificationProvider";

import App from "./App";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorBoundary/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LanguageProvider>
    <ModeProvider>
      <NotificationProvider>
        <HistoryProvider>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              // reset the state of your app so the error doesn't happen again
            }}
          >
            <App />
          </ErrorBoundary>
        </HistoryProvider>
      </NotificationProvider>
    </ModeProvider>
  </LanguageProvider>
);
