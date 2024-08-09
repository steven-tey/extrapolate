"use client";

import { useLocalStorage } from "usehooks-ts";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "@/components/ui/sonner";
import { headers } from "next/headers";

export function Analytics() {
  const [consent, setConsent] = useLocalStorage<boolean | null>(
    "analytics_consent",
    null,
  );
  const hasToastShown = useRef(false);

  const continent = headers().get("x-vercel-ip-continent");

  useEffect(() => {
    if (consent === null && continent === "EU" && !hasToastShown.current) {
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

    if (consent === null && continent !== "EU") {
      setConsent(true);
    }
  }, [continent, consent, setConsent]);

  return (
    <>
      {consent === (true || null) && <GoogleAnalytics gaId="G-8V7G187WH7" />}
      <Toaster />
    </>
  );
}