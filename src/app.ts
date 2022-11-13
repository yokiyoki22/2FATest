import "reflect-metadata";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CheckConfig, Port } from "./domain/services/configuration.service";
import { container } from "tsyringe";
import { CreateUserCommandValidator } from "./domain/validators/createusercommand.validator";
import { UserService } from "./domain/services/user.service";
import { UserController } from "./web/controllers/user.controller";
import UserRoute from "./web/routes/user.route";
import { UserRepository } from "./infrastructure/repositories/user.repository";
import { TokenRepository } from "./infrastructure/repositories/token.repository";
import { EmailService } from "./domain/services/email.service";
import { PrismaClient } from "@prisma/client";
import { LoginValidator } from "./domain/validators/login.validator";

const app = express();

app.use(express.json());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if(err.status === 400)
      return res.status(err.status).send();
  
    return next(err);
  });

CheckConfig();

const prismaClient = new PrismaClient();
container.register("PrismaClient", {
    useValue: prismaClient
});
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
container.register("IValidator<LoginRequest>",{
    useClass: LoginValidator
});

const usersController = container.resolve(UserController);

app.use("/users", UserRoute(usersController));

app.listen(Port, () => {
    console.log("Listening on port " + Port);
});



