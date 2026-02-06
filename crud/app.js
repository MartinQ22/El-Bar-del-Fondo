import express, { json, urlencoded, } from "express"
import { engine } from "express-handlebars"
import mongoConnect from "./database/mongoConnection.js"
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
import http from "http";
import session from "express-session"

// config()
const app = express()
const PORT = env.PORT
const server = http.createServer(app);

//HandleBars Config
app.engine("handlebars", engine({
    defaultLayout: "main",
    layoutsDir: serverRoot + "/src/views/layouts"
}))
app.set("view engine", "handlebars");
app.set("views", serverRoot + "/src/views")

app.use(express.static(serverRoot + "/public"))
app.use(json())
app.use(express.json())
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
app.use("/", viewsRouter)
app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);
app.use("/mail", mailingRouter)

server.listen(PORT, () => {
    mongoConnect().then(() => console.log("Base de datos conectada"));
})