import { successResponse } from "../utils/apiResponse.utils.js";

export function getProcessInfo(req, res){
    return successResponse (res, {
        message: "Process info",
        payload:{
            pid: process.pid,
            nodeVesion: process.version,
            platform: process.platform,
            uptime: process.uptime()
        }
    })
}
// simulador de tarea pesada
export function blockCpu(req, res){
    const duration = Number(req.query.duration) || 3000;
    const start = Date.now();

    while(Date.now() - start < duration ) {
        //blocking task

    }

    return successResponse(res, {
        message: "Task Completed",
        payload:{
            pid: process.pid,
            durationMs: Date.now() - start
        }
    })
}

