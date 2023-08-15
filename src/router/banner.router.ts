import {Router} from "express";
import {idParamsValidator, requestBodyValidator} from "../app/validators/base.validator";
import BannerService from "../app/services/banner.service";
import {BannerController} from "../app/controllers/v1/banner.controller";
import {upload} from "../app/middlewares/upload.middleware";
import {createBannerSchema, updateBannerSchema} from "../app/validators/banner.validator";


export default class BannerRouter {
    router: Router;

    private service: BannerService = new BannerService();
    private controller = new BannerController(this.service);

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('', this.controller.index);
        this.router.post('', upload.single('image'), requestBodyValidator(createBannerSchema), this.controller.store);
        this.router.get('/:id', idParamsValidator, this.controller.single);
        this.router.put('/:id', upload.single('image'), idParamsValidator, requestBodyValidator(updateBannerSchema), this.controller.update);
        this.router.delete('/:id', idParamsValidator, this.controller.destroy);
        return this.router;
    }

}