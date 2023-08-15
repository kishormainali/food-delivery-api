import {config} from "../../config/config";
import multer from "multer";

import {Request, Express, NextFunction} from "express";
import {Error} from "mongoose";
import path from "path";


const imageFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (!file.mimetype.includes("image")) {
        return cb(new Error("Only image files are supported"), false);
    }
    cb(null, true);
}

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
        cb(null, config.multer.dest);
    },
    filename(req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },

});

const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: config.multer.maxSize,
    },

});
export {upload}
