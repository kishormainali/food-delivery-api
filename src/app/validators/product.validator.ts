import Joi from "joi";
import {errorMessages} from "./base.validator";


const createProductSchema = Joi.object({
    name: Joi.string().required().messages(errorMessages),
    description: Joi.string().required().messages(errorMessages),
    image: Joi.array<string>().optional().messages(errorMessages),
    price: Joi.number().required().messages(errorMessages),
    category: Joi.string().required().min(24).max(24).messages(errorMessages),
});

const updateProductSchema = Joi.object({
    name: Joi.string().optional().messages(errorMessages),
    description: Joi.string().optional().messages(errorMessages),
    image: Joi.array<string>().optional().messages(errorMessages),
    price: Joi.number().optional().messages(errorMessages),
    category: Joi.string().optional().min(24).max(24).messages(errorMessages),
});


export {createProductSchema, updateProductSchema}
