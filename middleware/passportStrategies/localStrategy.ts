import passport from "passport";
import { Strategy as LocalStrategy, IVerifyOptions } from "passport-local";
import { userModel } from "../../models/userModel";
import { PassportStrategy } from "../../interfaces";

type VerifyDone = (err: any, user?: Express.User | false, options?: IVerifyOptions) => void;

const localStrategyInstance = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  (email: string, password: string, done: VerifyDone) => {
    try {
      const user = userModel.findOneByEmail(email);

      if (!user) {
        // email not found
        return done(null, false, { message: `Couldn't find user with email ${email}` });
      }
      if (user.password !== password) {
        // email exists, wrong password
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

void passport.serializeUser<number>((user, done) => {
  done(null, user.id);
});

void passport.deserializeUser<number>((id, done) => {
  try {
    const user = userModel.findById(id);
    done(null, user || false);
  } catch {
    done(null, false);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: "local",
  strategy: localStrategyInstance,
};

export default passportLocalStrategy;
