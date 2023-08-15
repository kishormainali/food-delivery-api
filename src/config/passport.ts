import { PassportStatic } from "passport";

import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import UserModel from "../app/models/user.model";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
};


export default (passport: PassportStatic) =>
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      const user = await UserModel.findById(jwt_payload.id);
      if (user) {
        return done(null, user._id);
      } else {
        return done(null, false);
      }
    })
  );
