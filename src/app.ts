import "reflect-metadata";
import express from 'express';
import { CheckConfig, Port } from "./domain/services/configuration.service";
import { container } from "tsyringe";
import { CreateUserCommandValidator } from "./domain/validators/createusercommand.validator";
import { UserService } from "./domain/services/user.service";
import { UserController } from "./web/controllers/user.controller";
import UserRoute from "./web/routes/user.route";
import { UserRepository } from "./infrastructure/repositories/user.repository";
import { TokenRepository } from "./infrastructure/repositories/token.repository";
import { EmailService } from "./domain/services/email.service";

const app = express();

app.use(express.json());

CheckConfig();
container.register("IEmailService", {
    useClass: EmailService
});
container.register("ITokenRepository",{
    useClass: TokenRepository
});
container.register("IUserRepository", {
    useClass: UserRepository
});
container.register("IUserService", {
    useClass: UserService
});
container.register("IValidator<CreateUserCommand>", {
    useClass: CreateUserCommandValidator
});

const usersController = container.resolve(UserController);

app.use("/users", UserRoute(usersController));

app.listen(Port, () => {
    console.log("Listening on port " + Port);
});



