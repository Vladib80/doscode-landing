import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Home from "./pages/home";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const update = (lng: string) => {
      const base = (lng || "ru").split("-")[0];
      document.documentElement.lang = base;
    };
    update(i18n.language);
    i18n.on("languageChanged", update);
    return () => {
      i18n.off("languageChanged", update);
    };
  }, [i18n]);

  return <Home />;
}

export default App;
