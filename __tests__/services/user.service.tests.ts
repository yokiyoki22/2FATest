import { Mock } from "moq.ts";
import { CreateUserCommand } from "../../src/domain/contracts/commands/create-user";
import { LoginRequest } from "../../src/domain/contracts/requests/login-request";
import { OtpToken } from "../../src/domain/entities/otp-token";
import { User } from "../../src/domain/entities/user";
import { IValidator } from "../../src/domain/interfaces/ivalidator";
import { ITokenRepository } from "../../src/domain/interfaces/repositories/itoken.repository";
import { IUserRepository } from "../../src/domain/interfaces/repositories/iuser.repository";
import { EmailService } from "../../src/domain/services/email.service";
import { UserService } from "../../src/domain/services/user.service";
import { CreateUserCommandValidator } from "../../src/domain/validators/createusercommand.validator";
import { LoginValidator } from "../../src/domain/validators/login.validator";



describe("User service tests", () => {
    const fakeUser: User = {
        id: "1234",
        fullName: "John Smith",
        email: "John.Smith@domain.tld",
        password: "$2b$12$0um68CofO1zMdmY.khx0SuIckUWcdfWrJcD70HHh.p9dLeYJPXF.i", //hash from Password123!
        twoFactor: false
    };
    const fakeUserWith2fa: User = {
        id: "9876",
        fullName: "John Titor",
        email: "John.Titor@domain.tld",
        password: "$2b$12$0um68CofO1zMdmY.khx0SuIckUWcdfWrJcD70HHh.p9dLeYJPXF.i", //hash from Password123!
        twoFactor: true
    };
    const fakeToken: OtpToken = {
        userId: fakeUserWith2fa.id,
        token: "1122334455",
        expiration: new Date(Date.now() + 1000*60*10)
    }
    const fakeUserRepo = new Mock<IUserRepository>()
        .setup(async repo => repo.getUserByEmail(fakeUser.email))
        .returnsAsync(fakeUser)
        .setup(async repo => repo.getUserByEmail(fakeUserWith2fa.email))
        .returnsAsync(fakeUserWith2fa)
        .object();
    const fakeTokenRepo = new Mock<ITokenRepository>()
        .setup(async repo => repo.getTokenByUserId(fakeUserWith2fa.id))
        .returnsAsync(null)
        .setup(async repo => repo.saveToken(fakeToken))
        .returns(Promise.resolve())
        .object();
    const fakeTokenRepoWithToken = new Mock<ITokenRepository>()
    .setup(async repo => repo.getTokenByUserId(fakeUserWith2fa.id))
    .returnsAsync(fakeToken)
    .setup(async repo => repo.saveToken(fakeToken))
    .returns(Promise.resolve())
    .setup(async repo => repo.invalidateTokenForUserId(fakeUserWith2fa.id))
    .returns(Promise.resolve())
    .object();

    const service = new UserService(
        fakeUserRepo,
        fakeTokenRepo,
        new CreateUserCommandValidator(fakeUserRepo),
        new EmailService(),
        new LoginValidator()
        );

    test("Successful login without 2FA", async () => {
        const response = await service.login({
            email: fakeUser.email,
            password: "Password123!"
        });
        expect(response.jwtToken).toBeTruthy();
        expect(response.succeeded).toBeTruthy();
        expect(response.additionalStepsNecessary).toBeFalsy();
        expect(response.error).toBeFalsy();
    });
    test("Login with 2FA first step", async () => {
        const response = await service.login({
            email: fakeUserWith2fa.email,
            password: "Password123!"
        });
        expect(response.jwtToken).toBeFalsy();
        expect(response.succeeded).toBeTruthy();
        expect(response.additionalStepsNecessary).toBeTruthy();
        expect(response.error).toBeFalsy();
    });
    test("Login with 2FA second step wrong token", async () => {
        const service2 = new UserService(
            fakeUserRepo,
            fakeTokenRepoWithToken,
            new CreateUserCommandValidator(fakeUserRepo),
            new EmailService(),
            new LoginValidator()
            ); 
        const response = await service2.login({
            email: fakeUserWith2fa.email,
            password: "Password123!",
            token: "1234567890"
        });
        expect(response.jwtToken).toBeFalsy();
        expect(response.succeeded).toBeFalsy();
        expect(response.additionalStepsNecessary).toBeFalsy();
        expect(response.error).toBeTruthy();
    });
    test("Login with 2FA second step correct token", async () => {
        const service2 = new UserService(
            fakeUserRepo,
            fakeTokenRepoWithToken,
            new CreateUserCommandValidator(fakeUserRepo),
            new EmailService(),
            new LoginValidator()
            ); 
        const response = await service2.login({
            email: fakeUserWith2fa.email,
            password: "Password123!",
            token: "1122334455"
        });
        expect(response.jwtToken).toBeTruthy();
        expect(response.succeeded).toBeTruthy();
        expect(response.additionalStepsNecessary).toBeFalsy();
        expect(response.error).toBeFalsy();
    });
});