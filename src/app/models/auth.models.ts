import {Model, model, Schema, Types} from "mongoose";
import {UserDocument} from "./user.model";

export interface IAuth {
    accessToken: string;
    refreshToken: string;
    userId: Types.ObjectId;
}

export interface AuthDocument extends IAuth, Document {
    createdAt: Date;
    updatedAt: Date;
}

const authenticationSchema = new Schema({
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    userId: Types.ObjectId,
}, {
    timestamps: true
});

const AuthModel = model<AuthDocument>('Auth', authenticationSchema);
export default AuthModel;

