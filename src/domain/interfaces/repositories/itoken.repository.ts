import { OtpToken } from "../../entities/otp-token";

export interface ITokenRepository{
    saveToken(token: OtpToken): Promise<void>,
    getTokenByUserId(id: string): Promise<OtpToken | null>
    invalidateTokenForUserId(id: string): Promise<void>
}