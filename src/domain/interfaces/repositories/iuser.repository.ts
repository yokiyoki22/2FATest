import { User } from "../../entities/user";

export interface IUserRepository{
    getUserByEmail(email: string) : Promise<User>
}