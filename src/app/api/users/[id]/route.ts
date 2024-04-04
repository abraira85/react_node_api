import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/modules/users/domain/repositories";
import {
    GetUserByIdUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
} from "@/modules/users/application";
import { parseFormData } from "@/modules/users/domain/utils";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        if (!id) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error("User ID is missing or invalid");
        }

        const userRepository = new UserRepository();
        const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

        const user = await getUserByIdUseCase.execute(Number(id));

        if (!user) {
            return NextResponse.json(
                { error: `User with ID ${id} not found` },
                { status: 404 },
            );
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            {
                message: error.message,
                code: error?.code,
            },
            { status: 500 },
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        if (!id) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error("User ID is missing or invalid");
        }

        const {
            fullname,
            email,
            password,
            accountStatus,
            birthDate,
            address,
            phoneNumber,
        } = await parseFormData(request);

        const userRepository = new UserRepository();
        const updateUserByIdUseCase = new UpdateUserUseCase(userRepository);

        await updateUserByIdUseCase.execute(Number(id), {
            fullname,
            email,
            password,
            accountStatus,
            birthDate,
            address,
            phoneNumber,
        });

        return NextResponse.json(
            { message: `User with ID ${id} updated successfully` },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            {
                message: error.message,
                code: error?.code,
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = params;

        if (!id) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error("User ID is missing or invalid");
        }

        const userRepository = new UserRepository();
        const deleteUserByIdUseCase = new DeleteUserUseCase(userRepository);

        await deleteUserByIdUseCase.execute(Number(id));

        return NextResponse.json(
            { message: `User with ID ${id} deleted successfully` },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            {
                message: error.message,
                code: error?.code,
            },
            { status: 500 },
        );
    }
}
