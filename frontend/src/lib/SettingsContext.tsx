"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
    UserSettings,
    fetchSettings,
    updateSettings as apiUpdateSettings,
    resetProgress as apiResetProgress,
    deleteAccount as apiDeleteAccount,
} from "@/lib/api";

interface SettingsContextType {
    settings: UserSettings;
    loading: boolean;
    updateSettings: (data: Partial<UserSettings>) => Promise<void>;
    resetProgress: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const DEFAULT_SETTINGS: UserSettings = {
    name: "Karan",
    email: "karan@example.com",
    notifications: true,
    soundEffects: true,
    difficulty: "intermediate",
    xp: 850,
    level: 1,
    levelTitle: "Rookie Trader",
};

const SettingsContext = createContext<SettingsContextType>({
    settings: DEFAULT_SETTINGS,
    loading: true,
    updateSettings: async () => { },
    resetProgress: async () => { },
    deleteAccount: async () => { },
});

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings()
            .then(setSettings)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const updateSettings = useCallback(async (data: Partial<UserSettings>) => {
        const updated = await apiUpdateSettings(data);
        setSettings(updated);
    }, []);

    const resetProgress = useCallback(async () => {
        const updated = await apiResetProgress();
        setSettings(updated);
    }, []);

    const deleteAccount = useCallback(async () => {
        const updated = await apiDeleteAccount();
        setSettings(updated);
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings, resetProgress, deleteAccount }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
