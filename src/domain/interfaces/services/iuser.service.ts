import { CreateUserCommand } from "../../contracts/commands/create-user";
import { LoginRequest } from "../../contracts/requests/login-request";
import { LoginResponse } from "../../contracts/responses/login-response";
import { UserCreatedResponse } from "../../contracts/responses/user-created-response";

export interface IUserService{
    createUser(user: CreateUserCommand) : Promise<UserCreatedResponse>;
    login(loginRequest: LoginRequest): Promise<LoginResponse>;
}