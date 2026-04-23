export type V10Theme = "light" | "dark";

const THEME_STORAGE_KEY = "doscode-v10-theme";

const isV10Theme = (value: string | null): value is V10Theme =>
  value === "light" || value === "dark";

export function getV10ThemeFromRoot(): V10Theme {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.classList.contains("v10-light") ? "light" : "dark";
}

export function initializeV10Theme(fallback: V10Theme) {
  if (typeof window === "undefined") {
    applyV10Theme(fallback, { persist: false });
    return;
  }

  let storedTheme: string | null = null;
  try {
    storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    storedTheme = null;
  }

  applyV10Theme(isV10Theme(storedTheme) ? storedTheme : fallback, { persist: false });
}

export function applyV10Theme(theme: V10Theme, options: { persist?: boolean } = {}) {
  if (typeof document === "undefined") {
    return;
  }

  const light = theme === "light";
  const root = document.documentElement;
  root.classList.toggle("v10-light", light);
  root.classList.toggle("dark", !light);
  root.dataset.theme = theme;
  root.style.colorScheme = light ? "light" : "dark";

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  themeColor?.setAttribute("content", light ? "#f5f1e6" : "#0a0a0d");

  if (typeof window === "undefined") {
    return;
  }

  if (options.persist !== false) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable in private or embedded contexts; the visual theme still applies.
    }
  }
}
