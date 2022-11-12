import { User } from "../../entities/user";

export interface IUserRepository{
    getUserByEmail(email: string) : Promise<User | null>,
    createUser(user: User) : Promise<void>
}