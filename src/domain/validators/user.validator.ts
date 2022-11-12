import { injectable, inject } from "tsyringe";
import { CreateUserCommand } from "../contracts/commands/create-user";
import { ValidationResult } from "../contracts/validation/validation-result";
import { IValidator } from "../interfaces/ivalidator";
import { IUserRepository } from "../interfaces/repositories/iuser.repository";

@injectable()
export class UserValidator implements IValidator<CreateUserCommand>{
    private _repo: IUserRepository;

    constructor(@inject("IUserRepository") usersRepo: IUserRepository){
        this._repo = usersRepo;
    }

    async validate(item: CreateUserCommand): Promise<ValidationResult> {
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        const errors = new Array<string>();

        if(item.fullName === undefined){
            errors.push('Missing fullName.');
        }
        if(item.email === undefined){
            errors.push('Missing email.');
        }
        if(item.email && !emailRegexp.test(item.email)){
            errors.push('Invalid email format.');
        }
        if(item.email && (await this._repo.getUserByEmail(item.email))){
            errors.push('Email already in use.');
        }
        
        if(errors.length == 0){
            return {
                isValid: true
            };
        }
        else{
            return {
                isValid: false,
                error: errors.reduce((prev, curr) => prev + " " + curr)
            }
        }
    }
}