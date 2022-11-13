import { injectable, inject } from "tsyringe";
import { CreateUserCommand } from "../../domain/contracts/commands/create-user";
import { ValidationError } from "../../domain/contracts/validation/validation-error";
import { IUserService } from "../../domain/interfaces/services/iuser.service";
import { Request, Response } from "express";
import { LoginRequest } from "../../domain/contracts/requests/login-request";

@injectable()
export class UserController{
    private _userService: IUserService;
    constructor(@inject("IUserService") userService: IUserService){
        this._userService = userService;
    }

    async create(req: Request, res: Response){
        try{
            const user: CreateUserCommand = req.body;
            const result = await this._userService.createUser(user);
            return res.send(result);
        }
        catch (e) {
            if(e instanceof ValidationError){
                return res.status(400).send({
                    message: e.message
                });
            } else {
                return res.status(500).send({
                    message: "Something went wrong. Please try again."
                });
            }
        }
    }

    async login(req: Request, res: Response){
        try{
            const loginRequest: LoginRequest = req.body;
            const result = await this._userService.login(loginRequest);

            if(result.error){
                return res.status(400).send({
                    message: result.error
                });
            }
            else{
                return res.send(result);
            }
        }
        catch (e) {
            if(e instanceof ValidationError){
                return res.status(400).send({
                    message: e.message
                });
            } else {
                return res.status(500).send({
                    message: "Something went wrong. Please try again."
                });
            }
        }
    }
}