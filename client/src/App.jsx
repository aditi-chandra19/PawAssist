import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import useSettingsStore from "./store/useSettingsStore";
import useUserStore from "./store/useUserStore";

function App() {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const hydrateFromServer = useSettingsStore((state) => state.hydrateFromServer);
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolvedTheme = themeMode === "auto" ? (media.matches ? "dark" : "light") : themeMode;
      document.documentElement.dataset.theme = resolvedTheme;
      document.body.dataset.theme = resolvedTheme;
    };

    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [themeMode]);

  useEffect(() => {
    if (!user?.id || !token) {
      return;
    }

    void hydrateFromServer(user.id);
  }, [hydrateFromServer, token, user?.id]);

  return <AppRoutes />;
}

export default App;
