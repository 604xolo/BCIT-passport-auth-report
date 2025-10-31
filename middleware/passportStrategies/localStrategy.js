"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userModel_1 = require("../../models/userModel");
const localStrategyInstance = new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => {
    try {
        const user = userModel_1.userModel.findOneByEmail(email);
        if (!user) {
            // email not found
            return done(null, false, { message: `Couldn't find user with email ${email}` });
        }
        if (user.password !== password) {
            // email exists, wrong password
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
});
void passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
void passport_1.default.deserializeUser((id, done) => {
    try {
        const user = userModel_1.userModel.findById(id);
        done(null, user || false);
    }
    catch (_a) {
        done(null, false);
    }
});
const passportLocalStrategy = {
    name: "local",
    strategy: localStrategyInstance,
};
exports.default = passportLocalStrategy;
