import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getWaitlistCount } from "@/lib/waitlist";

/** Live waitlist count, kept in sync via realtime inserts. */
export const useWaitlistCount = () => {
  const [count, setCount] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setCount(await getWaitlistCount());
  }, []);

  useEffect(() => {
    let active = true;
    getWaitlistCount().then((value) => {
      if (active) setCount(value);
    });

    const channel = supabase
      .channel("waitlist-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "waitlist" },
        () => {
          getWaitlistCount().then((value) => {
            if (active) setCount(value);
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { count, refresh };
};
