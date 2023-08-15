import {model, Schema, Types, UpdateQuery} from "mongoose";
import {generateSlug} from "../../utils/slug.utils";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";

export interface IProductQuery {
    page?: number;
    limit?: number;
    category?: string;
    isFeatured?: boolean;
    search?: string;
}

export interface IProduct {
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    image: Types.Array<string>;
    price: number;
    category: Schema.Types.ObjectId;
    countInStock: number;
    isFeatured: boolean;
}

export interface ProductDocument extends IProduct, Document {
    createdAt: Date;
    updatedAt: Date;
}


const productSchema = new Schema({
    name: {type: String, required: true, index: true},
    slug: {type: String, default: ''},
    description: {type: String, required: true},
    shortDescription: {type: String},
    image: new Types.Array({type: String, required: true, maxlength: 4, default: []}),
    price: {type: Number, default: 0},
    category: {
        type: Types.ObjectId,
        ref: 'Category'
    },
    countInStock: {type: Number, default: 1, min: 0, max: 255},
    isFeatured: {type: Boolean, default: false},

}, {
    timestamps: true
});

productSchema.plugin(mongoosePagination);

productSchema.pre('save', function (next) {
    this.slug = generateSlug(this.name);
    if (this.description) {
        this.shortDescription = this.description.substring(0, 60);
    }
    return next();
});

productSchema.pre('findOneAndUpdate', function (next) {

    const update = this.getUpdate() as UpdateQuery<IProduct>;
    if (update) {
        if (update.$set?.name) {
            update.$set.slug = generateSlug(update.$set.name);
        }
        if (update.$set?.description) {
            update.$set.shortDescription = update.$set.description.substring(0, 60);
        }
    }
    return next();
})


export default model<ProductDocument, Pagination<ProductDocument>>('Product', productSchema);