import {Router} from "express";
import AuthController from "../app/controllers/v1/auth.controller";
import AuthService from "../app/services/auth.service";
import {createUserSchema, loginSchema} from "../app/validators/user.validator";
import {verifyRefreshToken} from "../app/middlewares/auth.middleware";
import {requestBodyValidator} from "../app/validators/base.validator";


export default class AuthRouter {
    router: Router;

    private authService = new AuthService();
    private controller = new AuthController(this.authService);

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post("/login", requestBodyValidator(loginSchema), this.controller.login);
        this.router.post("/register", requestBodyValidator(createUserSchema), this.controller.register);
        this.router.post("/refresh-token", verifyRefreshToken, this.controller.refreshToken);
    }
}