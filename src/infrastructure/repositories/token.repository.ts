import { PrismaClient } from '@prisma/client'
import { inject, injectable } from "tsyringe";
import { OtpToken } from '../../domain/entities/otp-token';
import { ITokenRepository } from "../../domain/interfaces/repositories/itoken.repository";

@injectable()
export class TokenRepository implements ITokenRepository{
    private _client: PrismaClient;
    constructor(
        @inject("PrismaClient")client: PrismaClient
    ){
        this._client = client;
    }

    async saveToken(token: OtpToken): Promise<void> {
        await this._client.otpToken.deleteMany({
            where:{
                userId: token.userId
            }
        });
        await this._client.otpToken.create({
            data: token
        });
    }
    async getTokenByUserId(id: string): Promise<OtpToken | null> {
        return await this._client.otpToken.findUnique({where: {userId:id}})
    }
}