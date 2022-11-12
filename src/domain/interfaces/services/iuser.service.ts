import { CreateUserCommand } from "../../contracts/commands/create-user";
import { UserCreatedResponse } from "../../contracts/responses/user-created-response";

export interface IUserService{
    createUser(user: CreateUserCommand) : Promise<UserCreatedResponse>;
}