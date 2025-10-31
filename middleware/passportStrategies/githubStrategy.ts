// middleware/passportStrategies/githubStrategy.ts
import "dotenv/config";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import type { Request } from "express";
import { PassportStrategy } from "../../interfaces";
import { userModel } from "../../models/userModel";

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
      const email = profile.emails?.[0]?.value;  // may be undefined
      const name = profile.displayName || profile.username || "GitHub User";
      const avatar = profile.photos?.[0]?.value;

      let user = email ? userModel.findOneByEmail(email) : undefined;
      if (!user) {
        user = userModel.createFromGithub({ name, email, avatarUrl: avatar });
      }
      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategyInstance
};

export default passportGitHubStrategy;
