// src/middleware/passportMiddleware.ts
import { Application } from "express";
import passport from "passport";
import PassportConfig from "./PassportConfig";

import localStrategy from "./passportStrategies/localStrategy";
import githubStrategy from "./passportStrategies/githubStrategy";

let configured = false;

export default function passportMiddleware(app: Application): void {
  if (!configured) {
    // Register all strategies once
    new PassportConfig([localStrategy, githubStrategy]);
    configured = true;
  }

  // Then attach the middlewares
  app.use(passport.initialize());
  app.use(passport.session());
}
