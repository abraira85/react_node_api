import React from "react";
import { getTranslation } from "@/lib/translations";
import { TransType } from "@/locales/trans.type";
import { Metadata } from "next";
import Section from "@/components/Section";
import UserForm from "@/forms/UserForm";
import Typography from "@/components/Typography";

export async function generateMetadata({
    params: { lang },
}: PageProps): Promise<Metadata> {
    const t: TransType = await getTranslation(lang);

    return { ...t.users.meta };
}

export default async function NewUserPage({
    params: { lang },
}: {
    params: { lang: string };
}) {
    const t: TransType = await getTranslation(lang);

    return (
        <Section id="user-form" classNames="max-w-[800px] !items-start">
            <Typography
                variant="h1"
                className="text-black font-semibold !text-4xl mt-10"
            >
                {t.users.form.title.new}
            </Typography>

            <UserForm />
        </Section>
    );
}
