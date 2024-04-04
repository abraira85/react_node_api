"use client";

import React from "react";
import {useTranslations} from "@/lib/translations";
import Typography from "@/components/Typography";
import UnderConstructionIcon from "@/assets/svg/under-construction.svg"


const UnderConstruction: React.FC = () => {
    const { t } = useTranslations();

    return (
        <section className="container mx-auto px-5 pt-16 max-w-[650px] flex flex-col items-center">
            <UnderConstructionIcon className="h-[400px]" />
            <Typography
                variant="h1"
                className="text-black font-semibold !text-[24px] md:!text-[38px] text-center mt-10"
            >
                {t?.shared.under_construction.title}
            </Typography>
            <Typography
                variant="body1"
                className="text-black !text-[14px] mt-5 text-center"
                isHTML
            >
                {t?.shared.under_construction.subtitle}
            </Typography>
        </section>
    );
};

export default UnderConstruction;
