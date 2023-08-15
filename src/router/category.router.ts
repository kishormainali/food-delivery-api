import {Router} from "express";
import {upload} from "../app/middlewares/upload.middleware";
import {createCategorySchema, updateCategorySchema} from "../app/validators/category.validator";
import CategoryController from "../app/controllers/v1/category.controller";
import CategoryService from "../app/services/category.service";
import {idParamsValidator, paginationQueryValidator, requestBodyValidator} from "../app/validators/base.validator";

export default class CategoryRouter {

    router: Router;

    private service = new CategoryService();
    private controller = new CategoryController(this.service);

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('', paginationQueryValidator, this.controller.index);
        this.router.post('', upload.single('image'), requestBodyValidator(createCategorySchema), this.controller.store);
        this.router.get('/:id', idParamsValidator, this.controller.single);
        this.router.put('/:id', upload.single('image'), idParamsValidator, requestBodyValidator(updateCategorySchema), this.controller.update);
        this.router.delete('/:id', idParamsValidator, this.controller.destroy);
    }
}