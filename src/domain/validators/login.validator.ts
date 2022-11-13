import { LoginRequest } from "../contracts/requests/login-request";
import { ValidationResult } from "../contracts/validation/validation-result";
import { IValidator } from "../interfaces/ivalidator";

export class LoginValidator implements IValidator<LoginRequest>{
    async validate(item: LoginRequest): Promise<ValidationResult> {
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        const errors = new Array<string>();
        
        if(!item.email){
            errors.push('Missing email.');
        }
        if(item.email && !emailRegexp.test(item.email)){
            errors.push('Invalid email format.');
        }
        if(!item.password){
            errors.push("Missing password.");
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