import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload, TokenExpiredError} from "jsonwebtoken";
import {config} from "../../config/config";
import {unAuthorizedError} from "../../utils/response.utils";
import UserModel, {UserDocument} from "../models/user.model";
import passport from "passport";
import Logging from "../../logging/Logging";

/**
 * verify jwt token
 * @param req
 * @param res
 * @param next
 *
 * @returns {void}
 * */
export function verifyJwt(req: Request, res: Response, next: NextFunction): void {
    return passport.authenticate('jwt', {session: false}, (err: any, user: string, info: any) => {
        Logging.log(`info ${err} ${user} ${info}`);
        if (info) {
            if (info instanceof TokenExpiredError) {
                return unAuthorizedError(res, 'Token expired');
            }
            if (info instanceof Error) {
                return unAuthorizedError(res, info.message);
            }
        }
        if (err) {
            return unAuthorizedError(res, err.message);
        }
        req.user = user;
        return next();
    })(req, res, next);
}


/**
 * verify refresh token
 * @param req
 * @param res
 * @param next
 *
 * @returns {void}
 */

export function verifyRefreshToken(req: Request, res: Response, next: NextFunction): void {
    const refreshToken = req.headers["x-refresh-token"] as string;
    if (!refreshToken) {
        return next(Error("Please provide refresh token"));
    }
    const {id} = jwt.verify(refreshToken, config.jwt.refreshSecret) as { id: string };
    Logging.log(`id ${id}`);
    UserModel.findById(id).then((user) => {
        if (!user) {
            return next(Error("User not found"));
        }
        req.user = user._id;
        req.body = {refreshToken};
        return next();
    });
}