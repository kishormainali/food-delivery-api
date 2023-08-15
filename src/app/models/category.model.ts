import {model, Schema, UpdateQuery} from "mongoose";
import {generateSlug} from "../../utils/slug.utils";
import {mongoosePagination, Pagination} from "mongoose-paginate-ts";


export interface ICategoryQuery {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ICategory {
    name: string;
    slug: string;
    description: string;
    image: string;
}

export interface CategoryDocument extends ICategory, Document {
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema(
    {
        name: {type: String, required: true, index: true},
        slug: {type: String, default: ''},
        description: {type: String, default: ''},
        image: {type: String, default: ''},
    },
    {
        timestamps: true
    }
);

categorySchema.plugin(mongoosePagination);

categorySchema.pre('save', function (next) {
    this.slug = generateSlug(this.name);
    return next();
});

categorySchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate() as UpdateQuery<ICategory>;
    if (update) {
        if (update.$set?.name) {
            update.$set.slug = generateSlug(update.$set.name);
        }
    }
    return next();
});

export default model<CategoryDocument, Pagination<CategoryDocument>>('Category', categorySchema);