'use client'

import {useLocalStorage} from 'usehooks-ts'
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { GoogleAnalytics } from '@next/third-parties/google'
import { Toaster } from "@/components/ui/sonner";


export function Analytics() {
  const [consent, setConsent] = useLocalStorage<boolean | null>('analytics_consent', null);
  const hasToastShown = useRef(false);

  useEffect(() => {
    isEUCustomer().then((isEU) => {
      if (consent === null && isEU && !hasToastShown.current) {
        hasToastShown.current = true;

        toast("Cookie consent", {
          description: "By continuing to use Extrapolate, you accept our use of cookies.",
          action: {
            label: "Decline",
            onClick: () => setConsent(false),
          },
          duration: 5000
        })

        setTimeout(() => {
          setConsent(true)
        }, 7000)
      }

      if (consent === null && !isEU) {
        setConsent(true)
      }
    });
  }, []);

  return (
    <>
      {consent === (true || null) && (
        <GoogleAnalytics gaId='G-6GPZ9E276Y' />
      )}
      <Toaster />
    </>
  )
}

async function isEUCustomer() {
  const response = await fetch('https://ipapi.co/json/');
  const location: Location = await response.json();

  return location.country_code === 'EU'
}

type Location = {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}