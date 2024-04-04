import { User } from '@/modules/users/domain/entities';
import { UserRepository } from '@/modules/users/domain/repositories';

export default class CreateUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(user: User): Promise<User | null> {
        return await this.userRepository.createUser(user);
    }
}
