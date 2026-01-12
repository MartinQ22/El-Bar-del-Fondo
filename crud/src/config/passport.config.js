import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../models/usersModel.js";
import {Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt" ;
import { createHash, isValidPassword } from "../../utils.js";

export function initializePassport() {
//ESTRATEGIA DE REGISTRO LOCAL
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
        session: true
    },
        async (req, username, password, done) => {
            try {
                password = createHash(password);
                const newUser = await userModel.create({ ...req.body, password });
                done(null, newUser);
            } catch (error) {
                // Handle duplicate key error
                if(error.code === 11000){
                    return done(null, false, {message: "El email ya está registrado"});
                }
                done(error, null)
            }
        }));

//ESTRATEGIA DE LOGIN LOCAL
    passport.use("login", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        session: true
    },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({email: username});
                if(!user){
                    return done(null, false);
                }
                if(isValidPassword(password, user.password)){
                    done(null, user);
                }else{
                    done(null, false);
                }
            } catch (error) {
                done(error, null)
            }
        }));


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
//Estrategia para terceros GitHub
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liqAbZ6HS49VfSOJ",
        clientSecret: "80c2c4fce5fc13291a89a11dfb702c1f775f022f",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
            
            // Check if user already exists
            let user = await userModel.findOne({ email });
            
            if(!user){
                // Split displayName for first_name and last_name
                const nameParts = (profile.displayName || profile.username).split(' ');
                const first_name = nameParts[0] || profile.username;
                const last_name = nameParts.slice(1).join(' ') || 'GitHub User';
                
                // Create new user with all required fields
                user = await userModel.create({ 
                    first_name,
                    last_name,
                    email,
                    password: createHash(accessToken) // Use accessToken as password (hashed)
                });
            }
            return done(null, user.toJSON());
        } catch (error) {
            // Handle duplicate key error
            if(error.code === 11000){
                // User already exists, try to find them
                const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
                const user = await userModel.findOne({ email });
                if(user){
                    return done(null, user.toJSON());
                }
            }
            return done(error, null);
        }
    }))

//Estrategia para JWT
    passport.use("jwt", new JWTStrategy({
       jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
       secretOrKey: "JWT secreto"
    },
    async (payload, done) => {
        try {
            console.log(payload);
            return done(null, payload);
        } catch (error) {
            return done(error, null);
        }
    }));

}

function cookieExtractor(req) {
    if (req && req.cookies) {
        return req.cookies.jwt
    }
}

//CALLBACK PERSONALIZADO
export function passportCall() {
    return async (req, res, next) => {
        passport.authenticate("jwt", (err, user, info)=>{
            if(err) return next(err)
                if(!user){
                    return res.status(401).json({error: info.toString()})
                }
                req.user = user;
                next()
        })(req, res, next)
    }
}