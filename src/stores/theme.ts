import { defineStore } from "pinia";
import { ThemeModeComponent } from "@/assets/ts/layout";

export const useThemeStore = defineStore("theme", () => {
  const mode = "light"; // Always set to "light"

  function setThemeMode() {
    // Force theme mode to light
    document.documentElement.setAttribute("data-bs-theme", "light");
    ThemeModeComponent.init();
  }

  // Apply light theme on app load
  setThemeMode();

  return {
    mode,
    setThemeMode,
  };
});
