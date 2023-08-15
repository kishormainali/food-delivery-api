import {Request, Response} from "express";
import ProductService from "../../services/product.service";
import {internalServerError, successResponse} from "../../../utils/response.utils";
import {IProduct, IProductQuery} from "../../models/product.model";
import {getFileUrl} from "../../../utils/url.utils";

export default class ProductController {

    constructor(private readonly service: ProductService) {
    }

    index = async (req: Request, res: Response) => {
        try {
            const productQuery: IProductQuery = this.parseProductQuery(req);
            const products = await this.service.index(productQuery);
            return successResponse(res, "Products fetched successfully", products)
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    };

    single = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const product = await this.service.single(id);
            if (!product) return internalServerError(res, "Product not found");
            return successResponse(res, "Product fetched successfully", product);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    store = async (req: Request, res: Response) => {
        try {
            const input: IProduct = req.body;
            if (req.files) {
                // @ts-ignore
                input.image = req.files.map((file: Express.Multer.File) => {
                    return getFileUrl(req, file.path);
                });
            }
            const product = await this.service.create(input);
            if (!product) return internalServerError(res, "Unable to create product");
            return successResponse(res, "Product created successfully", product);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const input: IProduct = req.body;
            if (req.files) {
                // @ts-ignore
                input.image = req.files.map((file: Express.Multer.File) => {
                    return getFileUrl(req, file.path);
                });
            }
            const product = await this.service.update(id, input);
            if (!product) return internalServerError(res, "Unable to update product");
            return successResponse(res, "Product updated successfully", product);

        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    destroy = async (req: Request, res: Response) => {
        try {
            const success = await this.service.destroy(req.params.id);
            if (!success) return internalServerError(res, "Product not found");
            return successResponse(res, "Product deleted successfully");
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    private parseProductQuery(req: Request): IProductQuery {
        const {page, limit, search, category} = req.query;
        return {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
            search: search ? String(search) : "",
            category: category ? String(category) : ""
        };
    }
}
