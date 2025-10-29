import express, { Request, Response } from "express";
import { ensureAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/", (req:Request, res:Response) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req:Request, res:Response) => {
  res.render("dashboard", {
    user: req.user,
  });
});

export default router;
