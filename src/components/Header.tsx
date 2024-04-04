"use client";

import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    User,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
} from "@nextui-org/react";
import { useLocale } from "@react-aria/i18n";
import { useTranslations } from "@/lib/translations";
import Logo from "@/assets/svg/logo.svg";

const Header: React.FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslations();
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    const [selected, setSelected] = React.useState<string>("users");

    const menuItems = [
        {
            key: "users",
            link: `/${locale}/admin/users`,
            text: t?.shared.header.nav.users,
        },
        {
            key: "clients",
            link: `/${locale}/admin/clients`,
            text: t?.shared.header.nav.clients,
        },
        {
            key: "products",
            link: `/${locale}/admin/products`,
            text: t?.shared.header.nav.products,
        },
    ];

    return (
        <Navbar
            className="flex w-full bg-white shadow-xl z-50"
            maxWidth="full"
            height="60px"
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="lg:hidden"
            />
            <section className="container mx-auto flex justify-between items-center">
                <NavbarBrand>
                    <Logo className="h-[35px]" />
                </NavbarBrand>
                <NavbarContent
                    className="hidden sm:flex gap-4"
                    justify="center"
                >
                    {menuItems.map((item) => {
                        return (
                            <NavbarItem
                                key={item.key}
                                isActive={item.key === selected}
                            >
                                <Link
                                    color={item.key === selected ? "danger" : "foreground"}
                                    href={item.link}
                                    onClick={() => setSelected(item.key)}
                                >
                                    {item.text}
                                </Link>
                            </NavbarItem>
                        );
                    })}
                </NavbarContent>
                <NavbarContent justify="end">
                    <Dropdown placement="bottom-start">
                        <DropdownTrigger>
                            <User
                                as="button"
                                avatarProps={{
                                    isBordered: true,
                                    radius: "md",
                                    src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                                }}
                                className="transition-transform"
                                description="@janedoe"
                                name="Jane Doe"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="User Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-bold">
                                    {t?.shared.header.user_dropdown.login_as}
                                </p>
                                <p className="font-bold">@janedoe</p>
                            </DropdownItem>
                            <DropdownItem key="settings">
                                {t?.shared.header.user_dropdown.profile}
                            </DropdownItem>
                            <DropdownItem key="configurations">
                                {t?.shared.header.user_dropdown.settings}
                            </DropdownItem>
                            <DropdownItem key="help_and_feedback">
                                {t?.shared.header.user_dropdown.help}
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger">
                                {t?.shared.header.user_dropdown.logout}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            </section>
            <NavbarMenu className="flex flex-col gap-10 mt-[40px] items-center overflow-hidden">
                {menuItems.map((item) => {
                    return (
                        <NavbarMenuItem key={item.key}>
                            <Link
                                color="foreground"
                                href={item.link}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                }}
                                className="text-black text-[16px] font-medium hover:opacity-70"
                            >
                                {item.text}
                            </Link>
                        </NavbarMenuItem>
                    );
                })}
            </NavbarMenu>
        </Navbar>
    );
};

export default Header;
