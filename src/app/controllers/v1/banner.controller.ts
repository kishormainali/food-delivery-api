import BannerService from "../../services/banner.service";
import {Request, Response} from "express";
import {internalServerError, successResponse} from "../../../utils/response.utils";
import {IBanner} from "../../models/banner.model";
import {getFileUrl} from "../../../utils/url.utils";


export class BannerController {
    constructor(private readonly service: BannerService) {
    }

    index = async (req: Request, res: Response) => {
        const data = await this.service.index();
        return successResponse(res, "Banner fetched successfully", data);
    }

    single = async (req: Request, res: Response) => {
        try {
            const data = await this.service.single(req.params.id);
            if (!data) return successResponse(res, "Banner not found", data);
            return successResponse(res, "Banner fetched successfully", data);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    store = async (req: Request, res: Response) => {
        try {
            const input: IBanner = req.body;
            if (req.file) {
                input.image = getFileUrl(req, req.file.path);
            }
            const data = await this.service.store(input);
            if (!data) return internalServerError(res, "Banner not created");
            return successResponse(res, "Banner created successfully", data);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    update = async (req: Request, res: Response) => {
        try {
            const input: IBanner = req.body;
            if (req.file) {
                input.image = getFileUrl(req, req.file.path);
            }
            const data = await this.service.update(req.params.id, input);
            if (!data) return internalServerError(res, "Banner not updated");
            return successResponse(res, "Banner updated successfully", data);
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

    destroy = async (req: Request, res: Response) => {
        try {
            const data = await this.service.destroy(req.params.id);
            if (!data) return internalServerError(res, "Banner not found");
            return successResponse(res, "Banner deleted successfully");
        } catch (err: any) {
            return internalServerError(res, err.message);
        }
    }

}