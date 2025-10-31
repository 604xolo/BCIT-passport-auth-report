"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
// middleware/passportStrategies/githubStrategy.ts
require("dotenv/config");
const passport_github2_1 = require("passport-github2");
const userModel_1 = require("../../models/userModel");
const githubStrategyInstance = new passport_github2_1.Strategy({
    clientID: (_a = process.env.GITHUB_CLIENT_ID) !== null && _a !== void 0 ? _a : "",
    clientSecret: (_b = process.env.GITHUB_CLIENT_SECRET) !== null && _b !== void 0 ? _b : "",
    callbackURL: (_c = process.env.GITHUB_CALLBACK_URL) !== null && _c !== void 0 ? _c : "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
    scope: ["user:email"]
}, (_req, _accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value; // may be undefined
        const name = profile.displayName || profile.username || "GitHub User";
        const avatar = (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
        let user = email ? userModel_1.userModel.findOneByEmail(email) : undefined;
        if (!user) {
            user = userModel_1.userModel.createFromGithub({ name, email, avatarUrl: avatar });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
const passportGitHubStrategy = {
    name: "github",
    strategy: githubStrategyInstance
};
exports.default = passportGitHubStrategy;
