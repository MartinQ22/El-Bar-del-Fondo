import express, { json, urlencoded } from "express"
import { engine } from "express-handlebars"
import usersRouter from "./src/routes/usersRouter.js"
import productsRouter from "./src/routes/productsRouter.js"
import cartRouter from "./src/routes/cartRouter.js";
import sessionsRouter from "./src/routes/sessionsRouter.js"
import mailingRouter from "./src/routes/mailingRouter.js"
import viewsRouter from "./src/routes/viewsRouter.js"
import { serverRoot } from "./utils.js"
import cookieParser from "cookie-parser"
import MongoStore from "connect-mongo"
import passport from "passport"
import { env } from "./src/config/enviroment.js"
import { initializePassport } from "./src/config/passport.config.js"
import session from "express-session"
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import {requestLogger} from "./src/middlewares/requestLogger.middleware.js";
import healthRouter from "./src/routes/healthRouter.js";
import { cacheControl } from "./src/middlewares/cacheControl.middleware.js";
import compression from "compression";

// config()
const app = express()

app.use(compression())
app.use(requestLogger);
app.use(cacheControl)

//HandleBars Config
app.engine("handlebars", engine({
    defaultLayout: "main",
    layoutsDir: serverRoot + "/src/views/layouts"
}))
app.set("view engine", "handlebars");
app.set("views", serverRoot + "/src/views")

app.use(express.static(serverRoot + "/public"))
app.use(json())
app.use(urlencoded({ extended: true }))

//USAR COOKIE PARSER
app.use(cookieParser(env.COOKIE_SECRET));

// ESCONDER LOS DATOS DE LAS COOKIES
app.use(session({
    store: new MongoStore({
        autoRemove: "interval",
        autoRemoveInterval: 1,
        mongoUrl: env.URI_MONGO_CONNECT,
        ttl: 60 * 60 * 24 // 24 Horass
    }),
    secret: env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 Horass
}))

//CONFIGURACION DE PASSPORT 
initializePassport();
app.use(passport.initialize())
app.use(passport.session())

//Endpoints Handlers
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter)
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);
app.use("/mail", mailingRouter)
app.use("/api/health", healthRouter)
app.use("/", viewsRouter)

//Error Handler
app.use(errorHandler)

export default app;