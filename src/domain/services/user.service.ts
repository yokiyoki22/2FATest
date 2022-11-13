import { inject, injectable } from "tsyringe";
import { CreateUserCommand } from "../contracts/commands/create-user";
import { UserCreatedResponse } from "../contracts/responses/user-created-response";
import { ValidationError } from "../contracts/validation/validation-error";
import { User } from "../entities/user";
import { IValidator } from "../interfaces/ivalidator";
import { ITokenRepository } from "../interfaces/repositories/itoken.repository";
import { IUserRepository } from "../interfaces/repositories/iuser.repository";
import { IUserService } from "../interfaces/services/iuser.service";
import crypto from "crypto";
import { LoginRequest } from "../contracts/requests/login-request";
import { LoginResponse } from "../contracts/responses/login-response";
import { IEmailService } from "../interfaces/services/iemail.service";

@injectable()
export class UserService implements IUserService{
    private _userRepo: IUserRepository;
    private _tokenRepo: ITokenRepository;
    private _createUserValidator: IValidator<CreateUserCommand>;
    private _emailService: IEmailService;

    constructor(
        @inject("IUserRepository") userRepo: IUserRepository,
        @inject("ITokenRepository") tokenRepo: ITokenRepository,
        @inject("IValidator<CreateUserCommand>") createUserValidator: IValidator<CreateUserCommand>,
        @inject("IEmailService") emailService: IEmailService
    ){
        this._userRepo = userRepo;
        this._tokenRepo = tokenRepo;
        this._createUserValidator = createUserValidator;
        this._emailService = emailService;
    }

    async login(loginRequest: LoginRequest): Promise<LoginResponse>{
        const user = await this._userRepo.getUserByEmail(loginRequest.email);

        if(!user){
            return {
                succeeded: false,
                error: "User does not exist."
            }
        }
        if(!this.checkUserPassword(loginRequest.password, user.password)){
            return {
                succeeded: false,
                error: "Incorrect password."
            }
        }
        if(!user.twoFactor){
            return {
                succeeded: true,
                jwtToken: this.getJwtToken(user)
            }
        }
        if(!loginRequest.token){
            const token = this.generateOtpToken()
            await this._tokenRepo.saveToken({
                userId: user.id,
                token: token,
                expiration:  new Date(Date.now() + 1000 * 60 * 10) // 10m expiration
            });

            //TODO: define email template somewhere 
            await this._emailService.sendEmail("noreply@servizio.test", [user.email], token)

            return {
                succeeded:true,
                additionalStepsNecessary: "Retry with otp included."
            }
        }

        return {
            succeeded: true,
            jwtToken: this.getJwtToken(user)
        }
    }

    async createUser(user: CreateUserCommand): Promise<UserCreatedResponse> {
        const validation = await this._createUserValidator.validate(user);

        if(!validation.isValid){
            throw new ValidationError(validation.error ?? "Invalid data.");
        }

        await this._userRepo.createUser({
            id: crypto.randomUUID(),
            email: user.email,
            fullName: user.fullName,
            twoFactor: user.enable2fa,
            password: this.hashAndSalt(user.password)
        });

        const created = await this._userRepo.getUserByEmail(user.email);

        if(created == null){
            throw new Error("User creation failed.");
        }

        return {
            id: created.id,
            fullName: created.fullName,
            email: created.email
        };
    }
    private checkUserPassword(password: string, hashedPassword: string): boolean {
        return password === hashedPassword;
    }
    private hashAndSalt(password: string): string {
        return password;
    }
    private getJwtToken(user: User): string{
        return "asdasd123123adsasd";
    }
    private generateOtpToken(): string{
        return "ABCDEFG"
    }
}