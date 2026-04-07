import React from "react";
import { AppNavigation } from "./src/presentation/navigation/AppNavigation";
import { ThemeProvider } from "./src/context/themeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigation />
    </ThemeProvider>
  );
}