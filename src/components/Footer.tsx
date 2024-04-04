"use client";

import React from "react";
import { useTranslations } from "@/lib/translations";
import Typography from "@/components/Typography";

export default function Footer() {
    const { t } = useTranslations();

    return (
        <footer className="bg-white fixed w-full h-12 bottom-0 shadow-sh1 flex justify-center items-center z-50">
            <Typography variant="sub1" className="font-semibold !text-[14px]">
                {t?.shared.footer.copyright}
            </Typography>
        </footer>
    );
}
