"use client";

import { useLocalStorage } from "usehooks-ts";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function ConsentBanner({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useLocalStorage<boolean | null>(
    "analytics_consent",
    null,
  );
  const hasToastShown = useRef(false);

  useEffect(() => {
    if (consent === null && !hasToastShown.current) {
      hasToastShown.current = true;

      toast("Cookie consent", {
        description:
          "By continuing to use Extrapolate, you accept our use of cookies.",
        action: {
          label: "Decline",
          onClick: () => setConsent(false),
        },
        duration: 5000,
      });

      setTimeout(() => {
        setConsent(true);
      }, 7000);
    }

    if (consent === null) {
      setConsent(true);
    }
  }, [consent, setConsent]);

  if (consent === (true || null)) {
    return <>{children}</>;
  }

  return null;
}
