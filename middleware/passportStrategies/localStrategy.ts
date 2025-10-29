import passport from "passport";
import { Strategy as LocalStrategy, IVerifyOptions } from "passport-local";
import { getUserByEmailIdAndPassword, getUserById } from "../../controllers/userController";
import { PassportStrategy } from "../../interfaces";

type VerifyDone = (err: any, user?: Express.User | false, options?: IVerifyOptions) => void;

const localStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  (email: string, password: string, done: VerifyDone) => {
    const user = getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, { message: "Your login details are not valid. Please try again" });
  }
);

void passport.serializeUser<number>((user, done) => {
  done(null, user.id); 
});

void passport.deserializeUser<number>((id, done) => {
  const user = getUserById(id);
  done(null, user || false); 
});

const passportLocalStrategy: PassportStrategy = {
  name: "local",
  strategy: localStrategy,
};

export default passportLocalStrategy;
