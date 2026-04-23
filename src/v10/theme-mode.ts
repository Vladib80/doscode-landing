export type V10Theme = "light" | "dark";

const THEME_STORAGE_KEY = "doscode-v10-theme";

export function getV10ThemeFromRoot(): V10Theme {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.classList.contains("v10-light") ? "light" : "dark";
}

export function initializeV10Theme(fallback: V10Theme) {
  applyV10Theme(fallback, { persist: false });
}

export function applyV10Theme(theme: V10Theme, options: { syncUrl?: boolean; persist?: boolean } = {}) {
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

  if (!options.syncUrl) {
    return;
  }

  const fileName = light ? "v10-lite.html" : "v10.html";
  const currentPath = window.location.pathname;
  if (!/(^|\/)v10(?:-lite)?\.html$/.test(currentPath)) {
    return;
  }

  const prefix = currentPath.slice(0, currentPath.lastIndexOf("/") + 1);
  window.history.replaceState(null, "", `${prefix}${fileName}${window.location.search}${window.location.hash}`);
}
