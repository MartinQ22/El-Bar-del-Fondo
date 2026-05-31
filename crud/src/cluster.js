import cluster from "cluster";
import os from "os";
import { env } from "./config/enviroment.js";
import { logger } from "./utils/logger.utils.js";

const cpuCount = os.cpus().length
const workersCount = Math.min(env.workers, cpuCount)

if (cluster.isPrimary){
   logger.info( {msg: "Primary process started", primaryPid: process.pid, cpuCount, workersCount});

   for(let i= 0; i < workersCount; i++){
    cluster.fork();
   };
   
}else{
    //Si no es el proceso principal, entonces este es un worker
    await import("./server.js");
}


// Comando para utilizar Cluster con Docker
// docker run --rm -p 8080:8080 --env-file .env bar-del-fondo3:0.4 npm run start:cluster