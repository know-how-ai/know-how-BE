const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const passportConfig = require("./passport/index");
const { errorHandler } = require("./middlewares/errorHandler");

// for use env variables
dotenv.config();

const app = express();
passportConfig(); // configure passport for auth
const PORT = "port";
const PORT_NUMBER = process.env.PORT_NUMBER || 3000;

app.set(PORT, PORT_NUMBER);

// for logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// for using static directory
app.use("/", express.static(path.join(__dirname, "public")));

// for parsing data in request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// for parsing cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// for using session
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      signed: true,
      maxAge: 24 * 60 * 60, // a day
    },
    name: "express-session-cookie",
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// for check current sessions
// app.use((req, res, next) => {
//   console.log("✅ cookies: ", req.cookies);
//   console.log("✅ signedCookies: ", req.signedCookies);
//   console.log("✅ session: ", req.session);
//   console.log("✅ sessionID: ", req.sessionID);

//   req.sessionStore.all((error, sessions) => {
//     console.log("✅ sessionStore: ", sessions);
//     next();
//   });
// });

// for resolve 'cors' issue
const corsMiddleware = cors({
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
});

const { gptRouter, userRouter } = require("./routes");

app.use(corsMiddleware);
app.use("/user", userRouter);
app.use("/gpt", gptRouter);

// GET / routing
app.get("/", corsMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Hi!",
    status: 200,
  });
});

// Error handling
app.use(errorHandler);

// connect to database && create tables with models
require("./models")
  .sequelize.sync({ alter: true })
  .then((fulfilled) => {
    console.log("DB 연결 성공. ✅");
  })
  .catch((err) => console.error(err));

module.exports = app;
