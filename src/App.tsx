import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { Toaster } from "./components/ui/toaster";

const AppRoutes: React.FC = () => {
  const element = useRoutes(routes);
  return element;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
