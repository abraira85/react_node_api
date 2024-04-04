"use client";

import React from "react";
import { TransType } from "@/locales/trans.type";

export interface TranslationsProviderProps {
    initialValue: TransType;
    children: React.ReactNode;
}

interface TranslationsContextType {
    t: TransType | null;
    setT: React.Dispatch<React.SetStateAction<TransType>>;
}

export const TranslationsContext = React.createContext<TranslationsContextType>(
    { t: null, setT: () => {} },
);

export const useTranslations = () => React.useContext(TranslationsContext);

const TranslationsProvider: React.FC<TranslationsProviderProps> = ({
    initialValue,
    children,
}) => {
    const [t, setT] = React.useState(initialValue);

    return (
        <TranslationsContext.Provider value={{ t, setT }}>
            {children}
        </TranslationsContext.Provider>
    );
};

export default TranslationsProvider;
