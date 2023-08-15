import {Request, Response} from "express";

import {internalServerError, successResponse} from "../../../utils/response.utils";
import AuthService from "../../services/auth.service";
import {IUser} from "../../models/user.model";
import Logging from "../../../logging/Logging";

export default class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    login = async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const response = await this.authService.createSession(email, password);
            return successResponse(res, "Login Successful", response);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    };

    register = async (req: Request, res: Response) => {
        const userRequest: IUser = req.body;

        try {
            const user = await this.authService.createUser(userRequest);
            return successResponse(res, "User Registered Successfully", user);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    };

    refreshToken = async (req: Request, res: Response) => {
        const {refreshToken} = req.body;
        const userId = req.user as string;
        try {
            const response = await this.authService.refreshToken(refreshToken, userId);
            return successResponse(res, "Refresh Token Successful", response);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }
}
