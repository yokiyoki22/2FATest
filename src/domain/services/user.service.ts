import { getuid } from "process";
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

@injectable()
export class UserService implements IUserService{
    private _userRepo: IUserRepository;
    private _tokenRepo: ITokenRepository;
    private _createUserValidator: IValidator<CreateUserCommand>

    constructor(
        @inject("IUserRepository") userRepo: IUserRepository,
        @inject("ITokenRepository") tokenRepo: ITokenRepository,
        @inject("IValidator<CreateUserCommand>") createUserValidator: IValidator<CreateUserCommand>
    ){
        this._userRepo = userRepo,
        this._tokenRepo = tokenRepo,
        this._createUserValidator = createUserValidator
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
            password: user.password
        });

        const created = await this._userRepo.getUserByEmail(user.email);

        if(created === null || created === undefined){
            throw new Error("User creation failed.");
        }

        return {
            id: created.id,
            fullName: created.fullName,
            email: created.email
        };
    }
}