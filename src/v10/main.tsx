import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./theme.css";
import "./i18n";
import { initializeV10Theme } from "./theme-mode";

initializeV10Theme("dark");
createRoot(document.getElementById("root")!).render(<App />);
