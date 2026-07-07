import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppProviders from "./app/Providers";
import "./styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <AppProviders>
      <App />
    </AppProviders>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
