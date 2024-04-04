import React from "react";
import { getTranslation } from "@/lib/translations";
import { TransType } from "@/locales/trans.type";
import { Metadata } from "next";
import UnderConstruction from "@/components/UnderConstruction";

export async function generateMetadata({
    params: { lang },
}: PageProps): Promise<Metadata> {
    const t: TransType = await getTranslation(lang);

    return { ...t.products.meta };
}

export default async function ProductsPage() {
    return <UnderConstruction />;
}
