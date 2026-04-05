import { useEffect, useState } from "react";
import { getAppOverview } from "./appService";
import useUserStore from "../store/useUserStore";

export default function useAppData() {
  const user = useUserStore((state) => state.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const overview = await getAppOverview(user);
      if (isMounted) {
        setData(overview);
        setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return {
    data,
    loading,
    refresh: async () => {
      const overview = await getAppOverview(user);
      setData(overview);
    },
  };
}
