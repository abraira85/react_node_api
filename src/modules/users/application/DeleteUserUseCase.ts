import { UserRepository } from "@/modules/users/domain/repositories";
import { Database } from "@/modules/common/infrastructure";

export default class DeleteUserUseCase {
    private database: Database;

    constructor(private userRepository: UserRepository) {
        this.database = Database.getInstance();
    }

    async execute(userId: number): Promise<boolean> {
        // Establish connection to database before delete a user
        await this.database.connect();

        try {
            // Remove user by ID through the repository
            return await this.userRepository.deleteUser(userId);
        } catch (error) {
            // Handle any errors that may occur during user elimination
            console.error("Error deleting a user:", error);
            throw error;
        } finally {
            // Close the connection to the database upon completion of the operation
            await this.database.disconnect();
        }
    }
}
