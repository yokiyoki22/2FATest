import { Router } from "express";
import { UserController } from "../controllers/user.controller"

export default function UserRoute(
    userController: UserController
){
    const router = Router();

    router.post('/', (req, res) => userController.create(req, res));
    router.post('/login', (req, res) => userController.login(req, res));

    return router;
}