import passport from "passport";
import { Strategy as LocalStategy } from "passport-local";
import { userModel } from "../models/usersModel.js";
import { createHash, isValidPassword } from "../../utils";

export function initializePassport() {

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
                done(error, null)
            }
        }));


    passport.use("login", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        session: true
    },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({email: username});
                if(user){
                    if(isValidPassword(password, user.password)){
                        done(null, user);
                    }else{
                        done(null, false);
                    }
                }
            } catch (error) {
                done(error, null)
            }
        }));


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = userModel.findById(id);
        done(null, user);
    });

}