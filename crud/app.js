import express,{ json, urlencoded } from "express"
import {engine} from "express-handlebars"
import usersRouter from "./src/routes/usersRouter.js"
import mongoConnect from "./database/mongoConnection.js"
import sessionsRouter from "./src/routes/sessionsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
//cookie-parser
import cookieParser from "cookie-parser"
//mongo
import MongoStore from "connect-mongo"


//EXPRESS-SESSIONS
import session from "express-session"

const app = express()
const PORT = 8080

app.engine("handlebars", engine())
app.set("view engine", "handlebars");
app.set("views", serverRoot + "/public")

app.use(json())
app.use(express.json())
app.use(urlencoded({ extended: true }))

app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter)
app.use("/", viewsRouter)

//USAR COOKIE PARSER
app.use(cookieParser("secretodecookie"));
// ESCONDER LOS DATOS DE LAS COOKIES
app.use(session({
    store: new MongoStore({
        autoRemove: "interval",
        autoRemoveInterval: 1,
        mongoUrl: "mongodb://localhost:27017/El-bar-del-Fondo",
        ttl: 10
    }),
    secret: "secretodecookie", 
    resave: true,
    saveUninitialized: true,
    cookie:{ maxAge:1000*60}
}))

app.post("/session", async (req, res) => {
    req.session.user = req.body
})

app.get("/session", async (req, res) => {
    res.json(req.session.user)
})


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

// Handle favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
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

app.listen(PORT, ()=> {
    console.log(`El servidor utiliza el port ${PORT}`)
    mongoConnect().then(()=>console.log("Base de datos conectada"));
    
})