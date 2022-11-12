import { PrismaClient } from '@prisma/client'
import { injectable } from "tsyringe";
import { OtpToken } from '../../domain/entities/otp-token';
import { ITokenRepository } from "../../domain/interfaces/repositories/itoken.repository";

@injectable()
export class TokenRepository implements ITokenRepository{
    private _client: PrismaClient;
    constructor(){
        this._client = new PrismaClient();
    }

    async saveToken(token: OtpToken): Promise<void> {
        await this._client.otpToken.create({data: token});
    }
    async getTokenByUserId(id: string): Promise<OtpToken | null> {
        return await this._client.otpToken.findUnique({where: {userId:id}})
    }
}