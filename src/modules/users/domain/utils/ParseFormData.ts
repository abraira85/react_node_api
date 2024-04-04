import { NextRequest } from "next/server";
import { User } from "@/modules/users/domain/entities";

export async function parseFormData(request: NextRequest): Promise<User> {
    const formData = await request.formData();

    if (!formData) {
        throw new Error("Request body is empty");
    }

    return {
        fullname: formData.get("fullname") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        accountStatus: formData.get("accountStatus") as
            | "active"
            | "inactive"
            | "suspended",
        birthDate: new Date(formData.get("birthDate") as string),
        address: formData.get("address") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        avatar: formData.get("avatar") as string,
    };
}
