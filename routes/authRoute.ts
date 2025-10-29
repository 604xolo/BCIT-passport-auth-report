import express, { Request, Response } from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";


const router = express.Router();

router.get("/login", forwardAuthenticated, (req: Request, res: Response) => {
   const lastMessage = req.session?.messages?.slice(-1)[0];
  res.render("login", { message: lastMessage });
});


router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
    /* FIX ME: 😭 failureMsg needed when login fails */
  })
);

// GitHub OAuth start
router.get("/github", passport.authenticate("github"));

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
  })
);

router.get("/logout", (req:Request, res:Response) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
