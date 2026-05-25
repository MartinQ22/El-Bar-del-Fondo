import { randomUUID } from "crypto";

export function requestId(req, res, next){
    req.reqId = randomUUID();
    next()
}