import { User } from "@/modules/users/domain/entities";
import { UserRepository } from "@/modules/users/domain/repositories";

describe("User CRUD tests", () => {
    let userRepository: UserRepository;

    beforeAll(async () => {
        userRepository = new UserRepository();

        userRepository.initialize();
    });

    afterAll(async () => {});

    test("Create user", async () => {
        const newUser: User = {
            fullname: "John Doe",
            email: "john@example.com",
            password: "password123",
            joinedDate: new Date(),
            accountStatus: "active",
            profile: {
                birthDate: new Date("1990-01-01"),
                address: "123 Main St",
                phoneNumber: "555-1234",
            },
        };

        const createdUser = await userRepository.createUser(newUser);
        expect(createdUser).toHaveProperty("id");
    });
});
