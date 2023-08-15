import * as url from "url";
import {Request} from "express";


export function getFileUrl(req: Request, path: string): string {
    return url.format(
        {
            protocol: req.protocol,
            host: req.get("host"),
            pathname: path
        }
    );
}