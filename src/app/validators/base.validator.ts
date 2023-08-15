import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {validationError} from "../../utils/response.utils";

const errorMessages = {
    "string.base": '{{#label}} should be a type of "text"',
    "string.empty": "{{#label}} cannot be an empty field",
    "string.min": "{{#label}} should have a minimum length of {#limit}",
    "any.required": "{{#label}} is a required field",
    "string.email": "{{#label}} should be a valid email",
};


const validationErrorHandler = (res: Response, schema: Joi.Schema, property: any, next: NextFunction) => {
    const {error} = schema.validate(property);
    if (error) {
        const errors = error.details.map(({message, context}) => {
            return {
                key: context?.key || "",
                message,
            };
        });
        return validationError(res, "Validation Error", errors);
    }
    return next();
}

const paginationQuerySchema = Joi.object({
    page: Joi.number().integer().greater(0).default(1).messages(errorMessages),
    limit: Joi.number().integer().greater(0).default(20).messages(errorMessages),
    search: Joi.string().default("").messages(errorMessages),
    category: Joi.string().default("").messages(errorMessages),
});

const idParamsSchema = Joi.object({
    id: Joi.string().required().min(24).max(24).messages(errorMessages),
})

const idParamsValidator = (req: Request, res: Response, next: NextFunction) => {
    return validationErrorHandler(res, idParamsSchema, req.params, next);
}


const requestBodyValidator = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return validationErrorHandler(res, schema, req.body, next);
    };
}

const requestQueryValidator = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return validationErrorHandler(res, schema, req.query, next);
    };
}

const requestParamsValidator = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return validationErrorHandler(res, schema, req.params, next);
    };
}

const paginationQueryValidator = (req: Request, res: Response, next: NextFunction) => {
    return validationErrorHandler(res, paginationQuerySchema, req.query, next);
}

export {
    errorMessages,
    idParamsValidator,
    paginationQueryValidator,
    requestBodyValidator,
    requestQueryValidator,
    requestParamsValidator
};