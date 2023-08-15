import {model, Schema, UpdateQuery} from "mongoose";
import {generateSlug} from "../../utils/slug.utils";

export interface IBanner {
    name: string;
    slug: string;
    description: string;
    image: string;
    active: boolean;
}

export interface BannerDocument extends IBanner, Document {
    createdAt: Date;
    updatedAt: Date;
}

const bannerSchema = new Schema({
    name: {type: String, required: true, index: true},
    slug: {type: String, default: ''},
    description: {type: String, default: ''},
    image: {type: String, required: true},
    active: {type: Boolean, default: true},
});


bannerSchema.pre('save', function (next) {
    this.slug = generateSlug(this.name);
    return next();
});

bannerSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate() as UpdateQuery<IBanner>;
    if (update) {
        if (update.$set?.name) {
            update.$set.slug = generateSlug(update.$set.name);
        }
    }
    return next();
});


export default model<BannerDocument>('Banner', bannerSchema);