import React from "react";
import { useTranslations } from "@/lib/translations";
import {
    Checkbox,
    Input,
    Radio,
    RadioGroup,
    Select,
    SelectItem,
    Textarea,
} from "@nextui-org/react";
import EyeIcon from "@/assets/svg/eye.svg";
import EyeClosedIcon from "@/assets/svg/eye-slash.svg";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const CustomInputs = ({ field, form, ...props }) => {
    const [isVisiblePassword, setIsVisiblePassword] = React.useState(false);

    const toggleVisibilityPassword = () =>
        setIsVisiblePassword(!isVisiblePassword);

    const { t } = useTranslations();

    if (props.type === "select") {
        const { type, ...restProps } = props;

        return (
            <Select
                {...field}
                {...restProps}
                classNames={{
                    base: "relative",
                    inputWrapper: "bg-white",
                    helperWrapper: "absolute top-[2px] right-[30px]",
                }}
            >
                {props.options.map((opt: { value: string; label: string }) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </Select>
        );
    } else if (props.type === "radio_group") {
        const { type, ...restProps } = props;

        return (
            <RadioGroup
                {...field}
                {...restProps}
                orientation="horizontal"
                classNames={{
                    base: "flex items-start",
                    label: "text-[14px] text-black",
                    wrapper: "h-[30px] flex items-center",
                }}
            >
                {props.options.map((opt: { value: string; label: string }) => {
                    return (
                        <Radio
                            key={opt.value}
                            value={opt.value}
                            classNames={{
                                base: "flex items-start",
                                label: "text-[14px] mr-4",
                            }}
                        >
                            {opt.label}
                        </Radio>
                    );
                })}
            </RadioGroup>
        );
    } else if (props.type === "checkbox") {
        return (
            <Checkbox
                {...field}
                {...props}
                classNames={{
                    base: "flex items-start",
                    label: "text-[14px]",
                }}
            />
        );
    } else if (props.type === "textarea") {
        return (
            <Textarea
                {...field}
                {...props}
                classNames={{
                    base: "relative",
                    inputWrapper: "bg-white",
                    input: "no-resize min-h-[240px]",
                    helperWrapper: "absolute top-[28px] right-[10px]",
                }}
            />
        );
    } else if (props.type === "password") {
        return (
            <Input
                {...field}
                {...props}
                type={isVisiblePassword ? "text" : "password"}
                classNames={{
                    base: "relative",
                    inputWrapper: "bg-white",
                    helperWrapper: "absolute top-[2px] right-[10px]",
                }}
                endContent={
                    <button
                        className="focus:outline-none absolute -top-7 right-4 flex items-center"
                        type="button"
                        onClick={toggleVisibilityPassword}
                    >
                        {isVisiblePassword ? (
                            <>
                                <EyeClosedIcon className="text-2xl text-default-400 pointer-events-none pr-1" />
                                <span className="text-[14px] text-grey-500">
                                    {t?.shared.actions.hide}
                                </span>
                            </>
                        ) : (
                            <>
                                <EyeIcon className="text-2xl text-default-400 pointer-events-none pr-1" />
                                <span className="text-[14px] text-grey-500">
                                    {t?.shared.actions.show}
                                </span>
                            </>
                        )}
                    </button>
                }
            />
        );
    } else {
        return (
            <Input
                {...field}
                {...props}
                classNames={{
                    base: "relative",
                    inputWrapper: "bg-white",
                    helperWrapper: "absolute top-[2px] right-[10px]",
                }}
            />
        );
    }
};

export default CustomInputs;
