"use client";

import { useState } from "react";

const KEY = "landledger_remembered_email";

export function useRememberedEmail() {
  const [email] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(KEY) ?? "";
  });

  function save(value: string) {
    localStorage.setItem(KEY, value);
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  return { email, save, clear };
}
