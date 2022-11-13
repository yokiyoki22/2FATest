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
    async invalidateTokenForUserId(id: string): Promise<void> {
        await this._client.otpTokens.deleteMany({
            where:{
                userId: id
            }
        });
    }

    async saveToken(token: OtpToken): Promise<void> {
        await this._client.otpTokens.deleteMany({
            where:{
                userId: token.userId
            }
        });
        await this._client.otpTokens.create({
            data: token
        });
    }
    async getTokenByUserId(id: string): Promise<OtpToken | null> {
        return await this._client.otpTokens.findUnique({where: {userId:id}})
    }
}