import { useEffect, useState } from "react";
import { getAppOverview } from "./appService";
import { buildFallbackOverview } from "./fallbackData";
import useUserStore from "../store/useUserStore";

export default function useAppData(options = {}) {
  const user = useUserStore((state) => state.user);
  const preferLocal = options.preferLocal || false;
  const [data, setData] = useState(() => (preferLocal ? buildFallbackOverview(user) : null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (preferLocal) {
        if (isMounted) {
          setData(buildFallbackOverview(user));
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const overview = await getAppOverview(user);
        if (isMounted) {
          setData(overview);
        }
      } catch (error) {
        console.error("App overview load failed:", error);
        if (isMounted) {
          setData(buildFallbackOverview(user));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [preferLocal, user]);

  return {
    data,
    loading,
    refresh: async () => {
      if (preferLocal) {
        const fallbackOverview = buildFallbackOverview(user);
        setData(fallbackOverview);
        return fallbackOverview;
      }

      try {
        const overview = await getAppOverview(user);
        setData(overview);
        return overview;
      } catch (error) {
        console.error("App overview refresh failed:", error);
        const fallbackOverview = buildFallbackOverview(user);
        setData(fallbackOverview);
        return fallbackOverview;
      }
    },
  };
}
