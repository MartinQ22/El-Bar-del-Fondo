import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserService } from "../services/users.service.js";
import { userModel } from "../models/usersModel.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { createHash, isValidPassword } from "../../utils.js";
import { env } from "./enviroment.js";

const userService = new UserService();

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
                const newUser = await userService.createUser(req.body);
                done(null, newUser);
            } catch (error) {
                // Codigo para controlar duplicadoss
                if (error.code === 11000 || error.message.includes("duplicate")) {
                    return done(null, false, { message: "El email ya está registrado" });
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
                const user = await userService.getUserByEmail(username);
                if (!user) {
                    return done(null, false);
                }
                if (isValidPassword(password, user.password)) {
                    done(null, user);
                } else {
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
        const user = await userService.getUserById(id);
        done(null, user);
    });

    //Estrategia para terceros GitHub
    passport.use("github", new GitHubStrategy({
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: `${env.BASE_URL}/api/sessions/githubcallback`
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;

            let user = await userService.getUserByEmail(email);

            if (!user) {
                const nameParts = (profile.displayName || profile.username).split(' ');
                const first_name = nameParts[0] || profile.username;
                const last_name = nameParts.slice(1).join(' ') || 'GitHub User';

                user = await userModel.create({
                    first_name,
                    last_name,
                    email,
                    age: 18,
                    password: createHash(accessToken),
                    provider: 'github'
                });
            }
            return done(null, user.toJSON());
        } catch (error) {
            if (error.code === 11000) {
                // busca si el usuario existe 
                const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
                const user = await userService.getUserByEmail(email);
                if (user) {
                    return done(null, user.toJSON());
                }
            }
            return done(error, null);
        }
    }))

    //Estrategia "jwt" para extraer token de cookie y obtener usuario asociado
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: env.JWT_SECRET
    },
        async (payload, done) => {
            try {
                const user = await userService.getUserById(payload.id || payload._id);

                if (!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));

}

export function cookieExtractor(req) {
    if (req && req.cookies) {
        return req.cookies.jwt;
    }
    return null;
}

export function passportCall() {
    return async (req, res, next) => {
        passport.authenticate("jwt", (err, user, info) => {
            if (err) return next(err)
            if (!user) {
                return res.status(401).json({ error: (info && info.message) ? info.message : info.toString() })
            }
            req.user = user;
            next()
        })(req, res, next)
    }
}