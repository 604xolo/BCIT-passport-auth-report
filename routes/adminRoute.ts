// routes/adminRoute.ts
import express, { Request, Response } from "express";
import { ensureAdmin } from "../middleware/checkAuth";

type RawSession = {
  cookie?: unknown;
  passport?: { user?: number };
  [k: string]: any;
};

const router = express.Router();

router.get("/", ensureAdmin, (req: Request, res: Response) => {
  const store: any = req.sessionStore;
  if (!store || typeof store.all !== "function") {
    return res.status(500).send("Session store does not support listing sessions.");
  }

  store.all((err: any, sessions: Record<string, RawSession>) => {
    if (err) return res.status(500).send("Error reading sessions");

    const list = Object.entries(sessions || {}).map(([sid, sess]) => {
      const userId = sess?.passport?.user ?? null;
      return { sid, userId };
    });

    res.render("admin", { sessions: list, count: list.length });
  });
});

router.post("/revoke", ensureAdmin, express.urlencoded({ extended: true }), (req: Request, res: Response) => {
  const targetUserId = Number(req.body.userId);
  if (!Number.isFinite(targetUserId)) return res.status(400).send("Invalid userId");

  const store: any = req.sessionStore;
  if (!store || typeof store.all !== "function" || typeof store.destroy !== "function") {
    return res.status(500).send("Session store does not support revocation.");
  }

  store.all((err: any, sessions: Record<string, RawSession>) => {
    if (err) return res.status(500).send("Error reading sessions");

    const toDestroy = Object.entries(sessions || {})
      .filter(([, sess]) => sess?.passport?.user === targetUserId)
      .map(([sid]) => sid);

    let pending = toDestroy.length;
    if (pending === 0) return res.redirect("/admin");

    toDestroy.forEach(sid => {
      store.destroy(sid, () => {
        pending -= 1;
        if (pending === 0) res.redirect("/admin");
      });
    });
  });
});

router.post("/revoke-sid", ensureAdmin, express.urlencoded({ extended: true }), (req: Request, res: Response) => {
  const sid = String(req.body.sid || "");
  if (!sid) return res.status(400).send("Missing sid");

  const store: any = req.sessionStore;
  if (!store || typeof store.destroy !== "function") {
    return res.status(500).send("Session store does not support revocation.");
  }

  store.destroy(sid, () => res.redirect("/admin"));
});

export default router;
