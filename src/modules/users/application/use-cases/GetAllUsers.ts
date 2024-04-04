import { User } from "@/modules/users/domain/entities";
import { UserRepository } from "@/modules/users/domain/repositories";

export default class GetAllUsersUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(): Promise<User[]> {
        return await this.userRepository.getAllUsers();
    }
}
