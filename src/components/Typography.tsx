import React from "react";

export type FontFamilies = "roboto";

export type TypographyAs =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "span"
    | "p";

export type TypographyVariants =
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "sub1"
    | "sub2"
    | "sub3"
    | "body1"
    | "body2"
    | "list1"
    | "list2"
    | "cap"
    | "btn"
    | "ovl";

export type TypographyProps = {
    as?: TypographyAs;
    variant: TypographyVariants;
    variantMapping?: Exclude<
        { [key in TypographyProps["variant"]]: keyof JSX.IntrinsicElements },
        "variantMapping"
    >;
    fontFamily?: FontFamilies;
    className?: string;
    children: React.ReactNode | string | TrustedHTML;
    isHTML?: boolean;
};

export const VARIANT_MAPPING: {
    [key in TypographyProps["variant"]]: keyof JSX.IntrinsicElements;
} = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    sub1: "p",
    sub2: "p",
    sub3: "p",
    body1: "p",
    body2: "p",
    list1: "ul",
    list2: "ol",
    cap: "span",
    btn: "span",
    ovl: "p",
};

export const DEFAULT_FONT_FAMILY = "roboto";

export const FONT_MAPPING: {
    [key in TypographyProps["variant"]]: string;
} = {
    h1: "text-4xl md:text-6xl",
    h2: "text-3xl md:text-5xl",
    h3: "text-2xl md:text-3xl",
    h4: "text-xl md:text-2xl",
    h5: "text-lg md:text-xl",
    h6: "text-md md:text-lg",
    sub1: "text-lg md:text-xl",
    sub2: "text-7xl md:text-8xl",
    sub3: "text-lg !leading-6 md:text-xl",
    body1: "text-xl md:text-xl",
    body2: "text-xl md:text-2xl",
    list1: "text-xl md:text-xl",
    list2: "text-xl md:text-xl",
    cap: "text-xl md:text-xl",
    btn: "text-xl md:text-xl",
    ovl: "text-xl md:text-xl",
};

const Typography: React.FC<TypographyProps> = ({
    as,
    variant,
    variantMapping,
    children,
    className,
    fontFamily = DEFAULT_FONT_FAMILY,
    isHTML = false,
}) => {
    const Tag =
        as ||
        (variantMapping && variantMapping[variant]) ||
        VARIANT_MAPPING[variant];

    if (isHTML) {
        return (
            <Tag
                className={`font-${fontFamily} ${FONT_MAPPING[variant]} ${
                    className ? className : ""
                } ${variant === "ovl" ? "uppercase" : ""}`}
                dangerouslySetInnerHTML={{
                    __html: children as string | TrustedHTML,
                }}
            />
        );
    } else {
        return (
            <Tag
                className={`font-${fontFamily} ${FONT_MAPPING[variant]} ${
                    className ? className : ""
                } ${variant === "ovl" ? "uppercase" : ""}`}
            >
                {children as React.ReactNode}
            </Tag>
        );
    }
};

export default Typography;
