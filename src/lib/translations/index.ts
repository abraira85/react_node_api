import TranslationsProvider, { useTranslations } from "./TranslationsProvider";
import { getTranslation, supportedLanguages, defaultLanguage } from "./i18n";
import { TransType } from "@/locales/trans.type";

export {
    TranslationsProvider,
    useTranslations,
    getTranslation,
    supportedLanguages,
    defaultLanguage,
};

export type { TransType };
