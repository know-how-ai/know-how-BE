const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { selectUserByEmail } = require("../controllers/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
        // session: true, // 세션 저장 여부
      },
      // done: (error: any, user?: Express.User | false, options?: IVerifyOptions)
      async (email, password, done) => {
        try {
          const user = await selectUserByEmail(email);

          done(null, user?.dataValues || null);
        } catch (error) {
          done(error);
        }
      },
    ),
  );
};
