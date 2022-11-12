import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/interfaces/repositories/iuser.repository";
import { PrismaClient } from '@prisma/client'
import { injectable } from "tsyringe";

@injectable()
export class UserRepository implements IUserRepository{
    private _client: PrismaClient;
    constructor(){
        this._client = new PrismaClient();
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this._client.user.findUnique({where: {email}});
    }

    async createUser(user: User): Promise<void> {
        await this._client.user.create({data: user});
    }
}