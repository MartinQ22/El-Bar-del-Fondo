import express,{ json, urlencoded} from "express"
import mongoose from "mongoose"
import usersRouter from "./src/routes/usersRouter.js"
import mongoConnect from "./database/mongoConnection.js"
//cookie-parser
import cookieParser from "cookie-parser"
//FILE STORAGE

//EXPRESS-SESSIONS
import sessions from "express-sessions"


const app = express()
const PORT = 8080

app.use(json())
app.use(urlencoded({ extended: true }))
app.use("/api/users", usersRouter);

//ENDPOINT DE PRUEBA PARA SETEAR Y VER COOKIES
app.get("/set-cookie",  async (req, res) => {
    res.cookie("nombre-cookie", "valor-cookie", {
        maxAge: 3000, httpOnly: false
    })
    .send("cookie seteada")
});

app.get("/get-cookie", async (req, res, next) => {
    res.json(req.cookies);
})

//USAR COOKIE PARSER
app.use(cookieParser());
// ESCONDER LOS DATOS DE LAS COOKIES
app.use(session({
    secret: "secretodecookie", 
    resave: false,
    saveUninitialized: false,
}))





app.listen(PORT, ()=> {
    console.log(`El servidor utiliza el port ${PORT}`)
    mongoConnect().then(()=>console.log("Base de datos conectada"));
    
})