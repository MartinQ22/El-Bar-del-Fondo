import { Router, urlencoded } from "express"
import passport from "passport"
import { userModel } from "../models/usersModel.js";
import { isValidPassword, createHash } from "../../utils.js";

const router = Router();

router.use(urlencoded({extended: true}))

router.post("/register", async (req,res, next) => {
  const {first_name, last_name, email, password} = req.body
  
      try {
        if(req.session.user){
            return res.redirect("/profile")
        }
        const hashedPassword = createHash(password)
        let users = await userModel.create({
          first_name,
          last_name,
          email,
          password: hashedPassword
        })
        res.json(users);
      } catch (error) {
          console.log(error.message);
          res.status(500).json({message: "Error al registrar usuario", error: error.message})
      }
})

router.post("/login", async (req,res, next) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(401).json({message: "Usuario no encontrado"})
        }
        if(isValidPassword(password, user.password)){
          req.session.user = user
          res.status(200).redirect("/profile")
        }else{
            res.status(403).json({message: "No se puede loguear, intentelo nuevamente"})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Error en el servidor"})
    }
})

//Rutas de autenticacion GitHubb
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))

router.get("/githubcallback", 
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
        req.session.user = req.user;
        res.redirect("/profile");
    }
)

//Ruta de error generico 
router.use((req, res)=>{
    res.status(404).send("404 - La ruta no se encuentra")
})

export default router
