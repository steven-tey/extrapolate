import { headers } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import { ConsentBanner } from "./consent-banner";

export function Analytics() {
  return (
    <Suspense>
      <AnalyticsRSC />
    </Suspense>
  );
}

function AnalyticsRSC() {
  const continent = headers().get("x-vercel-ip-continent");

  if (continent === "EU") {
    return (
      <ConsentBanner>
        <GoogleAnalytics gaId="G-8V7G187WH7" />
      </ConsentBanner>
    );
  }

  return <GoogleAnalytics gaId="G-8V7G187WH7" />;
}
