// middleware/passportStrategies/githubStrategy.ts
import "dotenv/config";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import type { Request } from "express";
import { PassportStrategy } from "../../interfaces";
import { userModel } from "../../models/userModel";

// NOTE: This demo strategy attempts to match a user by email from GitHub.
// In real apps, you’d create a user if not found, or map by provider id.

const githubStrategyInstance = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    callbackURL: process.env.GITHUB_CALLBACK_URL ?? "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
    scope: ["user:email"]
  },
  async (
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user?: Express.User | false, info?: { message?: string }) => void
  ) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(null, false, { message: "No email returned by GitHub." });

      // Try to find an existing user by email
      let user: Express.User | null = null;
      try {
        user = userModel.findOne(email); // uses numeric id in your demo DB
      } catch {
        // No provisioning flow in this demo:
        return done(null, false, { message: "User not provisioned for GitHub login." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategyInstance
};

export default passportGitHubStrategy;
