import { faker } from "@faker-js/faker";
import { program } from "commander";
import { UserRepository } from "@/modules/users/domain/repositories";
import { User } from "@/modules/users/domain/entities";
import { CreateUserUseCase } from "@/modules/users/application";
import { Database } from "@/modules/common/infrastructure";

program
    .version("1.0.0")
    .description("Script to generate random users by Rober de Avila Abraira")
    .option("-n, --number <number>", "Number of users to generate")
    .parse(process.argv);

async function generateUsers(count: number): Promise<void> {
    const database = Database.getInstance();
    await database.connect();

    const userRepository = new UserRepository();
    userRepository.initialize();

    const createUserUseCase = new CreateUserUseCase(userRepository);

    for (let i = 0; i < count; i++) {
        const newUser: User = {
            fullname: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            joinedDate: new Date(),
            accountStatus: "active",
            birthDate: faker.date.birthdate(),
            address: faker.location.streetAddress(),
            phoneNumber: faker.phone.number("501-###-###"),
        };

        await createUserUseCase.execute(newUser);
    }

    await database.disconnect();
}

const options = program.opts();
const numberOfUsersToGenerate = parseInt(options.number);

if (!numberOfUsersToGenerate || numberOfUsersToGenerate <= 0) {
    console.error("Error: You must specify a valid number of users.");
    program.help();
} else {
    console.log(`Generating ${numberOfUsersToGenerate} random users...`);

    generateUsers(numberOfUsersToGenerate)
        .then(() => {
            console.log(
                `${numberOfUsersToGenerate} users generated and saved successfully.`,
            );
            process.exit(0);
        })
        .catch((error) => {
            console.error("Error generating users:", error);
            process.exit(1);
        });
}
