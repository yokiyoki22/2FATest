import { injectable, inject } from "tsyringe";
import { CreateUserCommand } from "../../domain/contracts/commands/create-user";
import { ValidationError } from "../../domain/contracts/validation/validation-error";
import { IUserService } from "../../domain/interfaces/services/iuser.service";
import { Request, Response } from "express";

@injectable()
export class UserController{
    private _userService: IUserService;
    constructor(@inject("IUserService") userService: IUserService){
        this._userService = userService;
    }
    async Create(req: Request, res: Response){
        try{
            const user: CreateUserCommand = req.body;
            const result = await this._userService.createUser(user);
            res.send(result);
        }
        catch (e) {
            if(e instanceof ValidationError){
                res.status(400).send({
                    message: e.message
                });
            } else {
                res.status(500).send({
                    message: "Something went wrong. Please try again."
                });
            }
        }
    }
}