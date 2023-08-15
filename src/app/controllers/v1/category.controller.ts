import {Request, Response} from "express";

import CategoryService from "../../services/category.service";
import {internalServerError, successResponse} from "../../../utils/response.utils";
import {getFileUrl} from "../../../utils/url.utils";
import {ICategoryQuery} from "../../models/category.model";

export default class CategoryController {
    constructor(private readonly service: CategoryService) {
    }

    index = async (req: Request, res: Response) => {
        const query: ICategoryQuery = this.parseQuery(req);
        const categories = await this.service.index(query);
        return successResponse(res, "Categories fetched successfully.", categories);
    }

    single = async (req: Request, res: Response) => {
        try {
            const category = await this.service.single(req.params.id);
            if (!category) return internalServerError(res, "Category not found");
            return successResponse(res, "Category fetched successfully", category);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    store = async (req: Request, res: Response) => {
        try {
            const categoryInput = req.body;
            if (req.file) {
                categoryInput.image = getFileUrl(req, req.file.path);
            }
            const category = await this.service.store(categoryInput);
            if (!category) return internalServerError(res, "Unable to create category");
            return successResponse(res, "Category created successfully", category);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const categoryInput = req.body;
            if (req.file) {
                categoryInput.image = getFileUrl(req, req.file.path);
            }
            const category = await this.service.update(id, categoryInput);
            if (!category) return internalServerError(res, "Unable to update category");

            return successResponse(res, "Category updated successfully", category);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    destroy = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            await this.service.destroy(id);
            return successResponse(res, "Category deleted successfully", null);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    private parseQuery(req: Request): ICategoryQuery {
        const {page, limit, search} = req.query;
        return {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 20,
            search: search ? String(search) : "",
        };
    }

}