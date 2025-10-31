"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAdmin = exports.forwardAuthenticated = exports.ensureAuthenticated = void 0;
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated())
        return next();
    res.redirect("/auth/login");
};
exports.ensureAuthenticated = ensureAuthenticated;
const forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated())
        return next();
    res.redirect("/dashboard");
};
exports.forwardAuthenticated = forwardAuthenticated;
// ✅ NEW: admin-only guard
const ensureAdmin = (req, res, next) => {
    var _a;
    if (req.isAuthenticated && req.isAuthenticated() && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "admin") {
        return next();
    }
    res.status(403).send("Forbidden: admins only");
};
exports.ensureAdmin = ensureAdmin;
