"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/adminRoute.ts
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
router.get("/", checkAuth_1.ensureAdmin, (req, res) => {
    const store = req.sessionStore;
    if (!store || typeof store.all !== "function") {
        return res.status(500).send("Session store does not support listing sessions.");
    }
    store.all((err, sessions) => {
        if (err)
            return res.status(500).send("Error reading sessions");
        const list = Object.entries(sessions || {}).map(([sid, sess]) => {
            var _a, _b;
            const userId = (_b = (_a = sess === null || sess === void 0 ? void 0 : sess.passport) === null || _a === void 0 ? void 0 : _a.user) !== null && _b !== void 0 ? _b : null;
            return { sid, userId };
        });
        res.render("admin", { sessions: list, count: list.length });
    });
});
router.post("/revoke", checkAuth_1.ensureAdmin, express_1.default.urlencoded({ extended: true }), (req, res) => {
    const targetUserId = Number(req.body.userId);
    if (!Number.isFinite(targetUserId))
        return res.status(400).send("Invalid userId");
    const store = req.sessionStore;
    if (!store || typeof store.all !== "function" || typeof store.destroy !== "function") {
        return res.status(500).send("Session store does not support revocation.");
    }
    store.all((err, sessions) => {
        if (err)
            return res.status(500).send("Error reading sessions");
        const toDestroy = Object.entries(sessions || {})
            .filter(([, sess]) => { var _a; return ((_a = sess === null || sess === void 0 ? void 0 : sess.passport) === null || _a === void 0 ? void 0 : _a.user) === targetUserId; })
            .map(([sid]) => sid);
        let pending = toDestroy.length;
        if (pending === 0)
            return res.redirect("/admin");
        toDestroy.forEach(sid => {
            store.destroy(sid, () => {
                pending -= 1;
                if (pending === 0)
                    res.redirect("/admin");
            });
        });
    });
});
router.post("/revoke-sid", checkAuth_1.ensureAdmin, express_1.default.urlencoded({ extended: true }), (req, res) => {
    const sid = String(req.body.sid || "");
    if (!sid)
        return res.status(400).send("Missing sid");
    const store = req.sessionStore;
    if (!store || typeof store.destroy !== "function") {
        return res.status(500).send("Session store does not support revocation.");
    }
    store.destroy(sid, () => res.redirect("/admin"));
});
exports.default = router;
