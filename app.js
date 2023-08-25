const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./passport/index");
const { errorHandler } = require("./middlewares/errorHandler");
const helmet = require("helmet");
const hpp = require("hpp");
const redis = require("redis");
const RedisStore = require("connect-redis").default;

// for use env variables
require("dotenv").config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

try {
  redisClient.connect();
} catch (err) {
  console.warn(err);
}
const app = express();
passportConfig(); // configure passport for auth

app.set("port", process.env.PORT || 8080);

// connect to database && create tables with models
require("./models")
  .sequelize.sync({ force: false })
  .then(() => {
    console.log("DB 연결 성공. ✅");
  })
  .catch((err) => console.error(err));

// for logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}

// for using static directory
app.use("/", express.static(path.join(__dirname, "public")));

// for parsing data in request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// for parsing cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

const sessionOptions = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    signed: true,
    maxAge: 24 * 60 * 60 * 1000, // a day
  },
  store: new RedisStore({ client: redisClient }), // set redis cache
  name: "know-how",
};

if (process.env.NODE_ENV === "production") {
  sessionOptions.proxy = true;
  // sessionOptions.cookie.secure = true;
}

// for using session
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// for resolve 'cors' issue
if (process.env.NODE_ENV !== "production") {
  const cors = require("cors");
  const corsMiddleware = cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  });

  // GET / routing
  app.get("/", corsMiddleware, (req, res) => {
    return res.status(200).json({
      message: "Hi!",
      status: 200,
    });
  });
}

const { gptRouter, userRouter } = require("./routes");

// app.use(corsMiddleware);
app.use("/user", userRouter);
app.use("/gpt", gptRouter);

// Error handling
app.use(errorHandler);

module.exports = app;
