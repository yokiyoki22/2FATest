import { Router } from "express";
import { UserController } from "../controllers/user.controller"

export default function UsersRoute(
    userController: UserController
){
    const router = Router();

    router.post('/', (req, res) => userController.Create(req, res));

    return router;
}