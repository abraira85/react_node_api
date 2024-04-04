import { User } from '@/modules/users/domain/entities';
import { UserRepository } from '@/modules/users/domain/repositories';

export default class UpdateUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: number, updatedUser: User): Promise<User | null> {
        return await this.userRepository.updateUser(userId, updatedUser);
    }
}
