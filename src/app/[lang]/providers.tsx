"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NextUIProvider } from "@nextui-org/react";
import { TranslationsProvider } from "@/lib/translations";
import { TransType } from "@/locales/trans.type";

const Providers = ({
    children,
    locale,
    t,
}: {
    children: React.ReactNode;
    locale: string;
    t: TransType;
}) => {
    const router = useRouter();

    return (
        <NextUIProvider locale={locale} navigate={router.push}>
            <TranslationsProvider initialValue={t}>
                {children}
            </TranslationsProvider>
        </NextUIProvider>
    );
};

export default Providers;
