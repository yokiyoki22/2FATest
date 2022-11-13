import { LoginRequest } from "../../src/domain/contracts/requests/login-request";
import { LoginValidator } from "../../src/domain/validators/login.validator"

describe("Login DTO validator", () => {
    test('Correct request passes', async () => { 
        const validator = new LoginValidator();
        const okRequest = {
            email: "name.surname@domain.tld",
            password: "something"
        };

        expect((await validator.validate(okRequest)).isValid).toBeTruthy();
    });

    test('No email fails', async () => { 
        const validator = new LoginValidator();
        const badRequest = {
            password: "something"
        };

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });

    test('No password fails', async () => { 
        const validator = new LoginValidator();
        const badRequest = {
            email: "name.surname@domain.tld"
        };

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });

    test('Empty object fails', async () => { 
        const validator = new LoginValidator();
        const badRequest = {};

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });

    test('Weird email fails', async () => { 
        const validator = new LoginValidator();
        const badRequest = {
            email: "name@.surname@domain..tld",
            password: "something"
        };

        expect((await validator.validate(badRequest)).isValid).toBeFalsy();
    });
});