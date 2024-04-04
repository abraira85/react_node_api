"use client";

import React from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useLocale } from "@react-aria/i18n";
import { Formik, Form, Field, FormikValues } from "formik";
import { Button } from "@nextui-org/react";
import { useTranslations } from "@/lib/translations";
import CustomInputs from "@/components/CustomsInputs";
import { toCamelCase } from "@/utils/string";
import { AvatarGenerator } from "random-avatar-generator";
import { User } from "@/modules/users/domain/entities";

interface UserFormProps {
    user?: User;
    onlyView?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onlyView }) => {
    const { locale } = useLocale();
    const { t } = useTranslations();
    const router = useRouter();

    const initialValues = {
        fullname: user?.fullname || "",
        email: user?.email || "",
        password: "",
        account_status: "active",
        birthdate: user?.birthDate || "",
        address: user?.address || "",
        phone_number: user?.phoneNumber || "",
    };

    const validationSchema = Yup.object().shape({
        fullname: Yup.string().required(t?.users.form.fullname.required),
        email: Yup.string()
            .email(t?.users.form.email.invalid)
            .required(t?.users.form.email.required),
        password: Yup.string()
            .required(t?.users.form.password.required as string)
            .min(8, t?.users.form.password.min as string)
            .matches(/[0-9]/, t?.users.form.password.numeric as string)
            .matches(/[a-z]/, t?.users.form.password.lower as string)
            .matches(/[A-Z]/, t?.users.form.password.upper as string)
            .matches(/[.,*!?¿¡/#$@%&]/, t?.users.form.password.symbol as string)
            .matches(/^(\S*)$/, t?.users.form.password.space as string),
        account_status: Yup.string().notRequired(),
        birthdate: Yup.string().notRequired(),
        address: Yup.string().notRequired(),
        phone_number: Yup.string()
            .matches(
                /^\+(?:[0-9] ?){6,14}[0-9]$|^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                t?.users.form.phone_number.invalid as string,
            )
            .notRequired(),
    });

    // Create an event handler, so you can call the verification on form submit
    const handleOnSubmit = async (
        values: FormikValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
    ) => {
        try {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                const camelCaseKey = toCamelCase(key);
                formData.append(camelCaseKey, value);
            });

            let res;

            if (!user?.id) {
                const generator = new AvatarGenerator();
                formData.append("avatar", generator.generateRandomAvatar());

                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                    method: "POST",
                    body: formData,
                });
            } else {
                res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
                    {
                        method: "PUT",
                        body: formData,
                    },
                );
            }

            if (res.ok) {
                router.push(`/${locale}/admin/users`);
            } else {
                console.error("Error creating user:", await res.text());
            }
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleOnSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form className="flex flex-col gap-5 w-full">
                        <div className="flex flex-col md:flex-row justify-center w-full gap-5">
                            <Field
                                type="text"
                                name="fullname"
                                labelPlacement="outside"
                                label={t?.users.form.fullname.label}
                                placeholder={t?.users.form.fullname.placeholder}
                                variant="bordered"
                                isRequired
                                isDisabled={onlyView}
                                isInvalid={!!errors.fullname}
                                errorMessage={errors.fullname}
                                component={CustomInputs}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row justify-center w-full gap-5">
                            <Field
                                type="email"
                                name="email"
                                labelPlacement="outside"
                                label={t?.users.form.email.label}
                                placeholder={t?.users.form.email.placeholder}
                                variant="bordered"
                                isRequired
                                isDisabled={onlyView}
                                isInvalid={!!errors.email}
                                errorMessage={errors.email}
                                component={CustomInputs}
                            />
                            <Field
                                type="text"
                                name="phone_number"
                                labelPlacement="outside"
                                label={t?.users.form.phone_number.label}
                                placeholder={
                                    t?.users.form.phone_number.placeholder
                                }
                                variant="bordered"
                                isDisabled={onlyView}
                                isInvalid={!!errors.phone_number}
                                errorMessage={errors.phone_number}
                                component={CustomInputs}
                            />
                        </div>
                        <div className="flex flex-col justify-center w-full gap-5">
                            <Field
                                type="password"
                                name="password"
                                labelPlacement="outside"
                                label={t?.users.form.password.label}
                                placeholder={t?.users.form.password.placeholder}
                                isRequired
                                variant="bordered"
                                isDisabled={onlyView}
                                isInvalid={!!errors.password}
                                errorMessage={errors.password}
                                component={CustomInputs}
                            />
                            <span className="text-[12px] text-grey-500 relative -top-4">
                                {t?.users.form.password.help}
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-center w-full gap-5">
                            <Field
                                type="text"
                                name="birthdate"
                                labelPlacement="outside"
                                label={t?.users.form.birthdate.label}
                                placeholder={
                                    t?.users.form.birthdate.placeholder
                                }
                                variant="bordered"
                                isDisabled={onlyView}
                                isInvalid={!!errors.birthdate}
                                errorMessage={errors.birthdate}
                                component={CustomInputs}
                            />
                            <Field
                                type="text"
                                name="address"
                                labelPlacement="outside"
                                label={t?.users.form.address.label}
                                placeholder={t?.users.form.address.placeholder}
                                variant="bordered"
                                isDisabled={onlyView}
                                isInvalid={!!errors.address}
                                errorMessage={errors.address}
                                component={CustomInputs}
                            />
                        </div>
                        <div className="flex justify-center w-full">
                            <Button
                                type={!onlyView ? "submit" : "button"}
                                size="lg"
                                color="primary"
                                variant="solid"
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                                className="text-white text-[16px] font-medium px-8 h-[40px] mt-5 rounded-full shadow-xl"
                                onPress={()=> {
                                    if (onlyView) {
                                        router.push(`/${locale}/admin/users`)
                                    }
                                }}>
                                {!onlyView
                                    ? t?.shared.actions.save
                                    : t?.shared.actions.close}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default UserForm;
