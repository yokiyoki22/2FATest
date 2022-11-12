import { CreateUserCommand } from "../../contracts/commands/create-user";
import { User } from "../../entities/user";

export interface IUserService{
    createUser(user: CreateUserCommand) : Promise<User>;
}