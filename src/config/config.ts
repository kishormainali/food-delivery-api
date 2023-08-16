import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";

const SERVER_PORT = Number(process.env.PORT) || 3000;

export const config = {
    mongo: {
        url: MONGO_URL,
        dbName: process.env.MONGO_DB_NAME || "foody",
    },
    server: {
        port: SERVER_PORT,
    },
    jwt: {
        secret: process.env.JWT_SECRET || "accessTokenSecret",
        refreshSecret: process.env.JWT_REFRESH_SECRET || "refreshTokenSecret",
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        refreshExpiresIn: "1y",
        issuer: process.env.JWT_ISSUER || "foody",
        audience: process.env.JWT_AUDIENCE || "foody",
    },
    multer: {
        dest: `${process.env.UPLOAD_PATH}/`,
        maxSize: 1024 * 1024 * (Number(process.env.MAX_SIZE) || 10),
    }
};
