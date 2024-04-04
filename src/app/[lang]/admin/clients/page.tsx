import React from "react";
import { Metadata } from "next";
import { getTranslation } from "@/lib/translations";
import { TransType } from "@/locales/trans.type";
import UnderConstruction from "@/components/UnderConstruction";

export async function generateMetadata({
    params: { lang },
}: PageProps): Promise<Metadata> {
    const t: TransType = await getTranslation(lang);

    return { ...t.clients.meta };
}

export default async function ClientsPage() {
    return <UnderConstruction />;
}
