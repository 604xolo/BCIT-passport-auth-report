// routes/authRoute.ts
import express, { Request, Response } from "express";
import passport from "passport";
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req: Request, res: Response) => {
  const lastMessage = req.session?.messages?.slice(-1)[0];
  if (req.session) req.session.messages = [];    // clear after showing
  res.render("login", { message: lastMessage });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
  })
);

// GitHub OAuth
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
  })
);

router.get("/logout", (req: Request, res: Response) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect("/auth/login");
  });
});

export default router;
