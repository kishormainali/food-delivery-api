import {Model, model, Schema} from "mongoose";
import bcrypt from "bcrypt";
import {IAuth} from "./auth.models";
import {generateJwtToken} from "../../utils/jwt.utils";


export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}


export interface UserDocument extends IUser, Document {
    createdAt: Date;
    updatedAt: Date;

    // method to compare password
    comparePassword(candidatePassword: string): Promise<boolean>;

    // method to generate token
    generateToken(): Promise<IAuth>;
}


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
    },
}, {
    timestamps: true
});

// hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    return next();
});

// method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password).catch((e) => false);
}

// method to generate token
userSchema.methods.generateToken = async function (): Promise<IAuth> {
    return generateJwtToken(this._id);
}

export default model<UserDocument>('User', userSchema);



