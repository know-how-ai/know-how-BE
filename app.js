const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// for use env variables
dotenv.config();

const app = express();
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
        },

        name: "session-cookie",
    })
);

app.get("/", (req, res) => {
    return res.status(200).json({
        statusCode: 200,
        message: "Hi!",
    });
});

app.listen(app.get(PORT), () => {
    console.log(app.get(PORT), "번 포트에서 대기중입니다. ✅");
    console.log(`>>> http://localhost:${PORT_NUMBER}/ <<<`);
});

module.exports = app;
