import {Router} from "express";
import ProductController from "../app/controllers/v1/product.controller";
import ProductService from "../app/services/product.service";
import {createProductSchema, updateProductSchema} from "../app/validators/product.validator";
import {upload} from "../app/middlewares/upload.middleware";
import {idParamsValidator, paginationQueryValidator, requestBodyValidator} from "../app/validators/base.validator";

export default class ProductRouter {
    router: Router;

    private service = new ProductService();
    private controller = new ProductController(this.service);

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get("", paginationQueryValidator, this.controller.index);
        this.router.post("", upload.array("images"), requestBodyValidator(createProductSchema), this.controller.store);
        this.router.get("/:id", idParamsValidator, this.controller.single);
        this.router.put("/:id", upload.array("images"), idParamsValidator, requestBodyValidator(updateProductSchema), this.controller.update);
        this.router.delete("/:id", idParamsValidator, this.controller.destroy);
    }
}