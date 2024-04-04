import { UserRepository } from '@/modules/users/domain/repositories';

export default class DeleteUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: number): Promise<boolean> {
        return await this.userRepository.deleteUser(userId);
    }
}
