import BannerModel, {BannerDocument, IBanner} from "../models/banner.model";

export default class BannerService {

    constructor() {
    }

    index = async (): Promise<BannerDocument[]> => {
        return BannerModel.find({active: true}).exec();
    }

    single = async (id: string): Promise<BannerDocument | null> => {
        return BannerModel.findById(id).exec();
    }

    store = async (data: IBanner): Promise<BannerDocument | null> => {
        return BannerModel.create<IBanner>(data);
    }

    update = async (id: string, data: any): Promise<BannerDocument | null> => {
        return BannerModel.findByIdAndUpdate(id, {
            $set: data
        }, {new: true});
    }

    destroy = async (id: string): Promise<void | null> => {
        return BannerModel.findByIdAndDelete(id);

    }

}