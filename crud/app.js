import express,{ json, urlencoded, } from "express"
import {engine} from "express-handlebars"
import usersRouter from "./src/routes/usersRouter.js"
import mongoConnect from "./database/mongoConnection.js"
import sessionsRouter from "./src/routes/sessionsRouter.js"
import viewsRouter from "./src/routes/viewsRouter.js"
import { serverRoot } from "./utils.js"
//cookie-parser
import cookieParser from "cookie-parser"
//mongo
import MongoStore from "connect-mongo"
//PASSPORT
import passport from "passport"
//DOTENV
import { env } from "./src/config/enviroment.js"
import { initializePassport } from "./src/config/passport.config.js"

//EXPRESS-SESSIONS
import session from "express-session"

// config()
const app = express()
// const PORT = 8080
const PORT = env.PORT

app.engine("handlebars", engine({
    defaultLayout: "main",
    layoutsDir: serverRoot + "/src/views/layouts"
}))
app.set("view engine", "handlebars");
app.set("views", serverRoot + "/src/views")

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(serverRoot + "/public"))

app.use(json())
app.use(express.json())
app.use(urlencoded({ extended: true }))

//USAR COOKIE PARSER
app.use(cookieParser("secretodecookie"));

// ESCONDER LOS DATOS DE LAS COOKIES - RECORDARME PONERLO ANTES DE PASSPORT
app.use(session({
    store: new MongoStore({
        autoRemove: "interval",
        autoRemoveInterval: 1,
        mongoUrl: "mongodb://localhost:27017/El-bar-del-Fondo",
        ttl: 60 * 60 * 24 // 24 Horass
    }),
    secret: "secretodecookie", 
    resave: true,
    saveUninitialized: true,
    cookie:{ maxAge:1000*60*60*24} // 24 Horass
}))

//CONFIGURACION DE PASSPORT 
initializePassport();
app.use(passport.initialize())
app.use(passport.session())

app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter)
app.use("/", viewsRouter)

//ENDPOINT DE PRUEBA PARA SETEAR Y VER COOKIES
app.get("/set-cookie",  async (req, res) => {
    res.cookie("nombre-cookie", "valor-cookie", {
        maxAge: 3000, httpOnly: false
    })
    .send("cookie seteada")
});

app.get("/get-cookie", async (req, res) => {
    res.send(req.cookies);
})

// app.get("/login", (req, res) => {
//     const { user, password } = req.query
//     if (user !== "coder" || password !== "house") {
//         res.send("Nombre de usuario o contraseña Incorrecto")
//     } else {
//         req.session.user = user
//         req.session.admin = true
//         res.send("Login OK")
//     }
// })

app.post("/session", async (req, res) => {
   req.session.user = req.body
 })

 app.get("/session", async (req, res) => {
    res.json(req.session.user)
 })

app.listen(PORT, ()=> {
    mongoConnect().then(()=>console.log("Base de datos conectada"));
})