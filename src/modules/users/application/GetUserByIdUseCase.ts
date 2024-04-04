import { User } from "@/modules/users/domain/entities";
import { UserRepository } from "@/modules/users/domain/repositories";
import { Database } from "@/modules/common/infrastructure";

export default class GetUserByIdUseCase {
    private database: Database;

    constructor(private userRepository: UserRepository) {
        this.database = Database.getInstance();
    }

    async execute(userId: number): Promise<User | null> {
        // Establish connection to database before getting a user
        await this.database.connect();

        try {
            // Get user by ID through the repository
            return await this.userRepository.getUserById(userId);
        } catch (error) {
            // Handle any errors that may occur during user acquisition
            console.error("Error getting a user:", error);
            throw error;
        } finally {
            // Close the connection to the database upon completion of the operation
            await this.database.disconnect();
        }
    }
}
