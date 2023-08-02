const express = require("express");
const router = express.Router();

// GET /user/new 라우터
router.get("/new", (req, res) => {
  return res.send("hello, new!");
});

// GET /user/in 라우터
router.get("/in", (req, res) => {
  return res.send("hello, in!");
});

// GET /user/out 라우터
router.get("/out", (req, res) => {
  return res.send("hello, out!");
});

// GET /user/reset 라우터
router.get("/reset", (req, res) => {
  return res.send("hello, reset!");
});

module.exports = router;
