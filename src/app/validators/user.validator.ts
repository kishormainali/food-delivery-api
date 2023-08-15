import Joi from "joi";
import {errorMessages} from "./base.validator";


const createUserSchema = Joi.object({
    firstName: Joi.string().required().messages(errorMessages),
    lastName: Joi.string().required().messages(errorMessages),
    email: Joi.string().email().required().messages(errorMessages),
    password: Joi.string().required().messages(errorMessages),
    phoneNumber: Joi.string().min(10).max(20).required().messages(errorMessages),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages(errorMessages),
    password: Joi.string().required().messages(errorMessages),
});

export {createUserSchema, loginSchema}