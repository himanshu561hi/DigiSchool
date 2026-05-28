import React from "react";

import ReactDOM from "react-dom/client";

import App from "@/app/App";
import { AuthProvider } from "@/context/AuthContext";

import AppProviders from "@/app/providers/AppProviders";

import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppProviders>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppProviders>
    </ThemeProvider>
  </React.StrictMode>,
);
