import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express, {Express, NextFunction, Request, Response} from "express";
import helmet from "helmet";
import http from "http";
import mongoose from "mongoose";
import passport from "passport";
import {config} from "./config/config";
import passportStrategy from "./config/passport";
import Logging from "./logging/Logging";
import router from "./router";

/// Create express app
const app: Express = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello");
});

/// connect to mongodb
mongoose
.connect(config.mongo.url, {
    retryWrites: true,
    writeConcern: {
        w: 'majority',
    },
    dbName: config.mongo.dbName,
})
.then(() => {
    startServer();
    Logging.log(`Connected to MongoDB at ${config.mongo.url}`);
})
.catch((err) => {
    Logging.error(`Failed to connect to MongoDB at ${config.mongo.url}`);
    Logging.error(err);
});

/**  Start Server When database connection is success */

const startServer = () => {
    app.use((req: Request, res: Response, next: NextFunction) => {
        /**  Log the request */
        Logging.log(`Request::: - Method::: [${req.method}] - URL: [${req.url}]`);
        Logging.log(`Request::: - Headers::: [${req.headers}]`);
        if (req.method != 'GET') {
            Logging.log(`Request Body::: ${req.body}`);
        }
        next();
    });

    // set up passport
    passportStrategy(passport);
    app.use(passport.initialize());

    app.use(helmet());

    /// set up middleware
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(compression({
        level: 6,
        threshold: 10 * 1000,
        filter: (req, res) => {
            if (req.headers["x-no-compression"]) {
                return false;
            }
            return compression.filter(req, res);
        }
    }));
    app.use(bodyParser.json());
    app.use(cors());

    app.use('/uploads', express.static("uploads"));

    // set headers
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept, Authorization, X-Requested-With, x-lang, x-refresh-token"
        );

        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
            return res.status(200).json({});
        }
        next();
    });

    // set up routes
    router(app);

    /** Error Handler */

    app.use((req, res, next) => {
        const error = new Error("Not Found");
        return res.status(404).json({
            message: error.message,
        });
    });

    /// start the server
    http.createServer(app).listen(config.server.port, () => {
        Logging.log(`Server listening on port: ${config.server.port}`);
    });
};
