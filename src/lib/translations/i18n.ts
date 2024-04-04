import { TransType } from "@/locales/trans.type";

type Translations = {
    [key: string]: () => Promise<TransType>;
};

type TransModule = {
    default: TransType;
};

export const supportedLanguages = ["en", "es"];
export const defaultLanguage = "en";

// Function to dynamically load the translation file based on the language code
const loadTranslation = async (languageCode: string): Promise<TransType> => {
    try {
        const myModule: TransModule = await import(
            `@/locales/${languageCode}.json`
        );
        return myModule.default;
    } catch (error) {
        console.error(
            `Error loading the translation file for language: ${languageCode}`,
            error,
        );
        throw new Error(
            `Translation not available for language: ${languageCode}`,
        );
    }
};

// Dynamically create the i18n object based on supported languages
const i18n: Translations = supportedLanguages.reduce((acc, languageCode) => {
    acc[languageCode] = () => loadTranslation(languageCode);
    return acc;
}, {} as Translations);

export const getTranslation = async (locale: string) => {
    if (!supportedLanguages.includes(locale)) {
        throw new Error(`Language not supported: ${locale}`);
    }
    return i18n[locale]();
};
