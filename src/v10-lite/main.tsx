import { createRoot } from "react-dom/client";
import App from "../v10/App";
import "../v10/index.css";
import "../v10/i18n";
import "./index.css";

document.documentElement.classList.remove("dark");
document.documentElement.classList.add("v10-light");

createRoot(document.getElementById("root")!).render(<App />);
