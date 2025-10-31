"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/authRoute.ts
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
router.get("/login", checkAuth_1.forwardAuthenticated, (req, res) => {
    var _a, _b;
    const lastMessage = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b.slice(-1)[0];
    if (req.session)
        req.session.messages = []; // clear after showing
    res.render("login", { message: lastMessage });
});
router.post("/login", passport_1.default.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
}));
// GitHub OAuth
router.get("/github", passport_1.default.authenticate("github"));
router.get("/github/callback", passport_1.default.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
}));
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err)
            console.error(err);
        res.redirect("/auth/login");
    });
});
exports.default = router;
