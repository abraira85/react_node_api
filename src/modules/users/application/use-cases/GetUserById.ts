import { User } from '@/modules/users/domain/entities';
import { UserRepository } from '@/modules/users/domain/repositories';

export default class GetUserByIdUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: number): Promise<User | null> {
        return await this.userRepository.getUserById(userId);
    }
}
