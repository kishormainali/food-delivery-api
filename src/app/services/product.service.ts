import ProductModel, {IProduct, IProductQuery, ProductDocument} from "../models/product.model";
import {PaginationModel} from "mongoose-paginate-ts";
import CategoryModel from "../models/category.model";
import {Types} from "mongoose";

export default class ProductService {

    constructor() {
    }

    index = async (productQuery: IProductQuery): Promise<PaginationModel<ProductDocument> | undefined> => {
        return ProductModel.paginate({
            populate: "category",
            limit: productQuery.limit,
            page: productQuery.page,
            aggregate: [
                {
                    $match: {
                        name: productQuery.search ? {$regex: productQuery.search, $options: "i"} : {$exists: true},
                        category: productQuery.category ? new Types.ObjectId(productQuery.category) : {$exists: true},
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: "$category"
                }
            ]
        });
    }

    single = async (id: string): Promise<ProductDocument | null> => {
        return ProductModel.findById(id).populate("category");
    }

    create = async (input: IProduct): Promise<ProductDocument | null> => {
        const category = await CategoryModel.findOne({_id: input.category});
        if (!category) throw new Error("Category not found");
        const product = await ProductModel.create<IProduct>(input);
        if (!product) throw new Error("Product not created");
        return product.populate("category");
    }

    update = async (id: string, input: IProduct): Promise<ProductDocument | null> => {
        return ProductModel.findByIdAndUpdate(id, {
            $set: {
                name: input.name,
                description: input.description,
                price: input.price,
                category: input.category,
            },
            $push: {
                image: {
                    $each: input.image
                }
            }
        }, {new: true}).populate("category");
    }

    destroy = async (id: string): Promise<void | null> => {
        return ProductModel.findByIdAndDelete(id);
    }

}