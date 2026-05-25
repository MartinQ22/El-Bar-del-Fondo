import client from "prom-client";

export const requestCounter = new client.Counter({
    name: "http_request_total",
    help: "request total",
    labelNames: ["method, status"]
})

export const requestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "duracion expresada en segundos",
    buckets: [0.1, 0.5, 1]
});