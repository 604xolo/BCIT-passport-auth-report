"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = passportMiddleware;
const passport_1 = __importDefault(require("passport"));
const PassportConfig_1 = __importDefault(require("./PassportConfig"));
const localStrategy_1 = __importDefault(require("./passportStrategies/localStrategy"));
const githubStrategy_1 = __importDefault(require("./passportStrategies/githubStrategy"));
let configured = false;
function passportMiddleware(app) {
    if (!configured) {
        // Register all strategies once
        new PassportConfig_1.default([localStrategy_1.default, githubStrategy_1.default]);
        configured = true;
    }
    // Then attach the middlewares
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
}
