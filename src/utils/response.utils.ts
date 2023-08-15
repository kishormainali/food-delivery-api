import {Response} from "express";

export type Errors =
    | {
    key: string;
    message: string;
}[]
    | null;

export const validationError = (res: Response, message: string | null, errors: Errors) => {
    return res
    .status(422)
    .json({
        message,
        errors,
    })
    .end();
};

export const unAuthorizedError = (res: Response, message: string) => {
    return res
    .status(401)
    .json({
        message,
    })
    .end();
};

export const badRequestError = (res: Response, message: string) => {
    return res
    .status(400)
    .json({
        message,
    })
    .end();
};

export const notFoundError = (res: Response, message: string) => {
    return res
    .status(404)
    .json({
        message,
    })
    .end();
};

export const internalServerError = (res: Response, message: string) => {
    return res
    .status(500)
    .json({
        message,
    })
    .end();
};

export const successResponse = (res: Response, message: string | null = null, data: any | null = null) => {
    return res
    .status(200)
    .json({
        message,
        data,
    })
    .end();
};
