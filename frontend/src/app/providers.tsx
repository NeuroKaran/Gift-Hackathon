"use client";

import { SettingsProvider } from "@/lib/SettingsContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return <SettingsProvider>{children}</SettingsProvider>;
}
