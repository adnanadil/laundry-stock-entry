import React from "react";
import ReactDOM from "react-dom/client";


import App from "./App.jsx";
import "./index.css";
import { router } from "./routes.jsx";

// Import from react router
import { RouterProvider } from "react-router-dom";

import ThemeProvider from "./theme";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
