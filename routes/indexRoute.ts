import express, { Request, Response } from "express";
import passport from "passport";
import { ensureAuthenticated, forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

import "express-session";
declare module "express-session" {
  interface SessionData {
    messages?: string[];
  }
}

router.get("/", (_req: Request, res: Response) => {
  res.redirect("/auth/login");
});

router.get("/auth/login", forwardAuthenticated, (req: Request, res: Response) => {
  const lastMessage = req.session?.messages?.slice(-1)[0] ?? null; // show only the most recent
  if (req.session) req.session.messages = []; // clear after rendering
  res.render("login", { message: lastMessage });
});

router.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true, 
  })
);


router.get("/dashboard", ensureAuthenticated, (req: Request, res: Response) => {
  res.render("dashboard", {
    user: req.user,
  });
});

export default router;
