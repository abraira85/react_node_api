import React from "react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { getTranslation } from "@/lib/translations";
import { TransType } from "@/locales/trans.type";
import Providers from "@/app/[lang]/providers";
import "../globals.css";

const roboto = Roboto({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default async function RootLayout({
    children,
    params: { lang },
}: {
    children: React.ReactNode;
    params: { lang: string };
}) {
    const t: TransType = await getTranslation(lang);

    return (
        <html lang={lang}>
            <body className={roboto.className}>
                <Providers locale={lang} t={t}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
