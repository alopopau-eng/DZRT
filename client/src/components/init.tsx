"use client";
import { addData } from "../lib/firebase";
import { setupOnlineStatus } from "../lib/utils";
import { useCallback, useEffect, useState } from "react";
import { FullPageLoader } from "./Loader";
import React from "react";
const visitorId = `dddz-app-${Math.random().toString(36).substring(2, 15)}`;

export function Init() {
  const [loading,setLoading]=useState(true)

  const getLocationAndLog = useCallback(async () => {
    if (!visitorId) return;

    const APIKEY = "d8d0b4d31873cc371d367eb322abf3fd63bf16bcfa85c646e79061cb";
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      localStorage.setItem('visitor',visitorId)
      const country = await response.text();
      await addData({
        createdDate: new Date().toISOString(),
        id: visitorId,
        country: country,
        action: "page_load",
        currentPage: "الرئيسية ",
      });
      setupOnlineStatus(visitorId!);

      localStorage.setItem("country", country); // Consider privacy implications
    } catch (error) {
      console.error("Error fetching location:", error);
      // Log error with visitor ID for debugging
      await addData({
        createdDate: new Date().toISOString(),
        id: visitorId,
        error: `Location fetch failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        action: "location_error",
      });
    }
  }, [visitorId]);

  useEffect(() => {
    if (visitorId) {
      getLocationAndLog().then(() => {
        setLoading(false);
      });
    }
  }, [visitorId, getLocationAndLog]);
  return <>
        {loading&&<FullPageLoader/>}
  </>;
}