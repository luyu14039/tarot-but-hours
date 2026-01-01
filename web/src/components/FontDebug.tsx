"use client";

import { useEffect } from "react";

export function FontDebug() {
  useEffect(() => {
    const computed = getComputedStyle(document.body);
    console.log("Body Font Family:", computed.fontFamily);
    console.log("--font-cormorant:", computed.getPropertyValue("--font-cormorant"));
    console.log("--font-noto-serif-sc:", computed.getPropertyValue("--font-noto-serif-sc"));
    console.log("--font-serif:", computed.getPropertyValue("--font-serif"));
  }, []);

  return null;
}