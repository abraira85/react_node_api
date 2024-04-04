import { NextRequest, NextResponse } from "next/server";
import {
    CreateUserUseCase,
    GetAllUsersUseCase,
} from "@/modules/users/application";
import { UserRepository } from "@/modules/users/domain/repositories";
import { User } from "@/modules/users/domain/entities";
import { parseFormData } from "@/modules/users/domain/utils";

export async function GET() {
    try {
        const userRepository = new UserRepository();
        const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
        const users = await getAllUsersUseCase.execute();

        return NextResponse.json({ users }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            {
                message: error.message,
                code: error?.code,
            },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const {
            fullname,
            email,
            password,
            accountStatus,
            birthDate,
            address,
            phoneNumber,
        } = await parseFormData(request);

        const joinedDate = new Date();

        const userData: User = {
            fullname,
            email,
            password,
            joinedDate,
            accountStatus,
            birthDate,
            address,
            phoneNumber,
        };

        const userRepository = new UserRepository();
        const createUserUseCase = new CreateUserUseCase(userRepository);
        const user = await createUserUseCase.execute(userData);

        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            {
                message: error.message,
                code: error?.code,
            },
            { status: 500 },
        );
    }
}
