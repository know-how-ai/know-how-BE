const express = require("express");
const router = express.Router();

// GET /user/coverletter 라우터
router.get("/coverletter", (req, res) => {
  return res.send("hello, coverletter!");
});

// GET /user/job 라우터
router.get("/job", (req, res) => {
  return res.send("hello, job!");
});

// GET /user/interview 라우터
router.get("/interview", (req, res) => {
  return res.send("hello, interview!");
});

module.exports = router;
