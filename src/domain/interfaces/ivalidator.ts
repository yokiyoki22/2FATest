import { ValidationResult } from "../contracts/validation/validation-result";

export interface IValidator<T>{
    validate(item: T) : Promise<ValidationResult>
}