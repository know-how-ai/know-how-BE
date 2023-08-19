const passport = require("passport");
const local = require("./localStrategy");
const { selectUserById } = require("../controllers/user");

module.exports = () => {
  // strategy의 done(error, user, opts)의 user 매개변수를 넘겨받음.
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const { dataValues: user } = await selectUserById(+id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  local();
};
