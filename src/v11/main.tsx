import { createRoot } from "react-dom/client";
import Home from "./pages/home";
import "../v10/index.css";
import "../v10/theme.css";
import "../v10/i18n";
import { initializeV10Theme } from "../v10/theme-mode";

initializeV10Theme("dark");
createRoot(document.getElementById("root")!).render(<Home />);
