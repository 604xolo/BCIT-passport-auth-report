"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
require("express-session");
router.get("/", (_req, res) => {
    res.redirect("/auth/login");
});
router.get("/auth/login", checkAuth_1.forwardAuthenticated, (req, res) => {
    var _a, _b, _c;
    const lastMessage = (_c = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b.slice(-1)[0]) !== null && _c !== void 0 ? _c : null; // show only the most recent
    if (req.session)
        req.session.messages = []; // clear after rendering
    res.render("login", { message: lastMessage });
});
router.post("/auth/login", passport_1.default.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
}));
router.get("/dashboard", checkAuth_1.ensureAuthenticated, (req, res) => {
    res.render("dashboard", {
        user: req.user,
    });
});
exports.default = router;
