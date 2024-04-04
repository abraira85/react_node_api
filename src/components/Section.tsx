import React from "react";

interface SectionProps {
    id: string;
    children: React.ReactNode;
    classNames?: string;
}

const Section: React.FC<SectionProps> = ({ id, children, classNames }) => {
    return (
        <section
            id={id}
            className={
                "container mx-auto my-10 px-6 h-[100%] flex flex-col items-center gap-10 " +
                classNames
            }
        >
            {children}
        </section>
    );
};

export default Section;
