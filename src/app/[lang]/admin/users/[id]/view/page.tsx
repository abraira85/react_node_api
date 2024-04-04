import React from "react";
import { getTranslation } from "@/lib/translations";
import { TransType } from "@/locales/trans.type";
import { Metadata } from "next";
import Section from "@/components/Section";
import UserForm from "@/forms/UserForm";
import Typography from "@/components/Typography";
import { parseDate, parseDateTime } from "@/utils/date";

export async function generateMetadata({
    params: { lang },
}: PageProps): Promise<Metadata> {
    const t: TransType = await getTranslation(lang);

    return { ...t.users.meta };
}

async function getData(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        cache: "no-cache",
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function viewUserPage({
    params: { lang, id },
}: {
    params: { lang: string; id: string };
}) {
    const t: TransType = await getTranslation(lang);

    const { user } = await getData(id);

    const modifiedUser = { ...user };
    modifiedUser.birthDate = parseDate(modifiedUser.birthDate);
    modifiedUser.joinedDate = parseDateTime(modifiedUser.joinedDate);

    return (
        <Section id="user-form" classNames="max-w-[800px] !items-start">
            <Typography
                variant="h1"
                className="text-black font-semibold !text-4xl mt-10"
            >
                {t.users.form.title.view}
            </Typography>

            <UserForm user={modifiedUser} onlyView />
        </Section>
    );
}
