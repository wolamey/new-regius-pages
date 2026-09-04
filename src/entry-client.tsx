import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./styles.css";
import "./production.css";
import "./campaigns.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container is missing");
}

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

if (document.documentElement.dataset.prerendered === "true" && container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
