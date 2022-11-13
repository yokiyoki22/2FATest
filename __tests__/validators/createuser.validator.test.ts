import { Mock } from "moq.ts";
import { IUserRepository } from "../../src/domain/interfaces/repositories/iuser.repository";
import { User } from "../../src/domain/entities/user";
import { CreateUserCommand } from "../../src/domain/contracts/commands/create-user";
import { CreateUserCommandValidator } from "../../src/domain/validators/createusercommand.validator";

describe("Create user DTO validator", () => {
    const fakeUser: User = {
        id: "1234",
        fullName: "John Smith",
        email: "name.surname@domain.tld",
        password: "Password123!",
        twoFactor: false
    };
    const fakeRepo = new Mock<IUserRepository>()
        .setup(async repo => repo.getUserByEmail("name.surname@domain.tld"))
        .returnsAsync(fakeUser)
        .object();

    test('Correct request passes', async () => { 
        const validator = new CreateUserCommandValidator(fakeRepo);
        const okRequest: CreateUserCommand = {
            email: "other.person@domain.tld",
            password: "something",
            passwordConfirm: "something",
            fullName: "John Titor",
            enable2fa: false
        }

        expect((await validator.validate(okRequest)).isValid).toBeTruthy();
    });

    test('Weird email fails', async () => { 
        const validator = new CreateUserCommandValidator(fakeRepo);
        const badRequest = {
            email: "name@.surname@domain..tld",
            password: "something"
        };

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });

    test('No email fails', async () => { 
        const validator = new CreateUserCommandValidator(fakeRepo);
        const badRequest: CreateUserCommand = {
            password: "something",
            passwordConfirm: "something",
            fullName: "John Titor",
            enable2fa: false
        }

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });

    test('Different passwords fails', async () => { 
        const validator = new CreateUserCommandValidator(fakeRepo);
        const badRequest: CreateUserCommand = {
            email: "other.person@domain.tld",
            password: "something",
            passwordConfirm: "something-else",
            fullName: "John Titor",
            enable2fa: false
        }

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });

    test('Missing password fails', async () => { 
        const validator = new CreateUserCommandValidator(fakeRepo);
        const badRequest: CreateUserCommand = {
            email: "other.person@domain.tld",
            passwordConfirm: "something",
            fullName: "John Titor",
            enable2fa: false
        }

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });

    test('Missing password confirmation fails', async () => { 
        const validator = new CreateUserCommandValidator(fakeRepo);
        const badRequest: CreateUserCommand = {
            email: "other.person@domain.tld",
            password: "something",
            fullName: "John Titor",
            enable2fa: false
        }

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });

    test('Missing name fails', async () => { 
        const validator = new CreateUserCommandValidator(fakeRepo);
        const badRequest: CreateUserCommand = {
            email: "other.person@domain.tld",
            password: "something",
            passwordConfirm: "something-else",
            enable2fa: false
        }

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });

    test('Missing 2FA flag fail', async () => { 
        const validator = new CreateUserCommandValidator(fakeRepo);
        const badRequest: CreateUserCommand = {
            email: "other.person@domain.tld",
            password: "something",
            passwordConfirm: "something-else",
            fullName: "John Titor",
        }

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });
});