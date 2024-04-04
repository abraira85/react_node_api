import { User } from "@/modules/users/domain/entities";
import { UserRepository } from "@/modules/users/domain/repositories";
import { Database } from "@/modules/common/infrastructure";

export default class UpdateUserUseCase {
    private database: Database;

    constructor(private userRepository: UserRepository) {
        this.database = Database.getInstance();
    }

    async execute(userId: number, updatedUser: User): Promise<User | null> {
        if (!userId) {
            throw new Error("User ID cannot be null");
        }

        if (!updatedUser) {
            throw new Error("User cannot be null");
        }

        // Establish connection to database before updating user
        await this.database.connect();

        try {
            // Update the user through the repository
            return await this.userRepository.updateUser(userId, updatedUser);
        } catch (error) {
            // Handle any errors that may occur during user update
            console.error("Error updating user:", error);
            throw error;
        } finally {
            // Close the connection to the database upon completion of the operation
            await this.database.disconnect();
        }
    }
}
