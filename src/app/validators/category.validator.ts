import Joi from "joi";
import {errorMessages} from "./base.validator";


const createCategorySchema = Joi.object({
    name: Joi.string().required().messages(errorMessages),
    description: Joi.string().optional().messages(errorMessages),
    image: Joi.string().optional().messages(errorMessages),
});

const updateCategorySchema = Joi.object({
    name: Joi.string().optional().messages(errorMessages),
    description: Joi.string().optional().messages(errorMessages),
    image: Joi.string().optional().messages(errorMessages),
});

const categoryParamsSchema = Joi.object({
    id: Joi.string().required().min(24).max(24).messages(errorMessages),
});


export {createCategorySchema, updateCategorySchema, categoryParamsSchema}