import {Application} from "express";
import AuthRouter from "./auth.router";
import ProductRouter from "./product.router";
import {verifyJwt} from "../app/middlewares/auth.middleware";
import CategoryRouter from "./category.router";
import BannerRouter from "./banner.router";

export default (app: Application) => {
    app.use("/api/auth", new AuthRouter().router);
    app.use("/api/v1/products", verifyJwt, new ProductRouter().router);
    app.use("/api/v1/categories", verifyJwt, new CategoryRouter().router);
    app.use("/api/v1/banners", verifyJwt, new BannerRouter().router);
}