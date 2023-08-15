import CategoryModel, {CategoryDocument, ICategoryQuery} from "../models/category.model";
import {PaginationModel} from "mongoose-paginate-ts";

export default class CategoryService {
    constructor() {
    }

    index = async (query: ICategoryQuery): Promise<PaginationModel<CategoryDocument> | undefined> => {
        return CategoryModel.paginate({
            limit: query.limit,
            page: query.page,
            aggregate: [
                {
                    $match: {
                        name: query.search ? {$regex: query.search, $options: "i"} : {$exists: true},
                    }
                }
            ],
        });
    }

    single = async (id: string): Promise<CategoryDocument | null> => {
        return CategoryModel.findById(id);
    }

    store = async (input: any): Promise<CategoryDocument | null> => {
        return CategoryModel.create(input);
    }

    update = async (id: string, input: any): Promise<CategoryDocument | null> => {
        return CategoryModel.findByIdAndUpdate(id, {
            $set: input,
        }, {
            new: true,
        });
    }

    destroy = async (id: string): Promise<void> => {
        await CategoryModel.findByIdAndDelete(id);
    }


}