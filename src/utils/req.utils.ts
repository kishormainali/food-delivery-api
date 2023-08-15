import {Request} from "express";


export function parsePagination(req: Request): { page: number, limit: number } {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    return {page, limit}
}

