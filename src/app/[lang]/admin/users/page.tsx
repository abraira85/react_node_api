import React from "react";
import { getTranslation } from "@/lib/translations";
import { TransType } from "@/locales/trans.type";
import { Metadata } from "next";
import DataTable from "@/components/DataTable";
import Section from "@/components/Section";

export async function generateMetadata({
    params: { lang },
}: PageProps): Promise<Metadata> {
    const t: TransType = await getTranslation(lang);

    return { ...t.users.meta };
}

export default function UsersPage() {
    return (
        <Section id="user-list">
            <DataTable />
        </Section>
    );
}
