import Joi from "joi";
import {errorMessages} from "./base.validator";


const createBannerSchema = Joi.object({
    name: Joi.string().required().messages(errorMessages),
    description: Joi.string().optional().messages(errorMessages),
    image: Joi.string().optional().messages(errorMessages),
});

const updateBannerSchema = Joi.object({
    name: Joi.string().optional().messages(errorMessages),
    description: Joi.string().optional().messages(errorMessages),
    image: Joi.string().optional().messages(errorMessages),
});

export {createBannerSchema, updateBannerSchema}