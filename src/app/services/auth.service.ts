import UserModel, {IUser} from "../models/user.model";
import {omit} from "lodash";
import AuthModel from "../models/auth.models";

export default class AuthService {
    constructor() {
    }

    createSession = async (email: string, password: string) => {
        // find user by email
        const user = await UserModel.findOne({email}).exec();

        if (!user) throw Error("User not found");

        const isValid = await user.comparePassword(password);
        if (!isValid) throw Error("Invalid credentials");

        const token = await user.generateToken();

        const savedToken = await AuthModel.findOne({userId: user._id}).exec();

        if (savedToken) {
            savedToken.accessToken = token.accessToken;
            savedToken.refreshToken = token.refreshToken;
            await savedToken.save();
        } else {
            await AuthModel.create(token);
        }
        return {
            user: omit(user.toJSON(), "password"),
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        };
    }

    createUser = async (userInput: IUser) => {
        const existingUser = await UserModel.findOne({email: userInput.email}).exec();
        if (existingUser) throw Error("User already exists");
        const user = await UserModel.create(userInput);
        return omit(user.toJSON(), "password");
    }

    refreshToken = async (refreshToken: string, userId: string) => {
        const user = await UserModel.findById(userId).exec();
        if (!user) throw Error("User not found");
        const savedToken = await AuthModel.findOne({userId: user._id}).exec();
        if (!savedToken) throw Error("Invalid refresh token");
        const token = await user.generateToken();
        savedToken.accessToken = token.accessToken;
        savedToken.refreshToken = token.refreshToken;
        await savedToken.save();
        return {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        }
    }
}
