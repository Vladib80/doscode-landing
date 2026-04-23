import { createRoot } from "react-dom/client";
import App from "../v10/App";
import "../v10/index.css";
import "../v10/theme.css";
import "../v10/i18n";
import { initializeV10Theme } from "../v10/theme-mode";

initializeV10Theme("light");
createRoot(document.getElementById("root")!).render(<App />);
