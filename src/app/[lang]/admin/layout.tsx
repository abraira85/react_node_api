import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <main className="mb-10 md:mb-32 overflow-hidden">{children}</main>
            <Footer />
        </>
    );
}
