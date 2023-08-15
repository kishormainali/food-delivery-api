import jwt from "jsonwebtoken";
import {config} from "../config/config";
import {IAuth} from "../app/models/auth.models";
import {Schema, Types} from "mongoose";

// generate access token and refresh token
export function generateJwtToken(id: string): IAuth {
    const accessToken = jwt.sign({id: id}, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
    });
    const refreshToken = jwt.sign({id: id}, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
    });
    return {
        userId: new Types.ObjectId(id),
        accessToken,
        refreshToken,
    };
}
