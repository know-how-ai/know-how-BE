const express = require("express");
const router = express.Router();

// user/new 라우터
router.post("/new", (req, res) => {
  const { email, password, username, resetQuestion, resetAnswer } = req.body;

  return res.status(200).json({
    status: true,
    data: {
      id: 0,
      username: "hi",
      point: 5,
    },
  });
});

// user/in 라우터
router.post("/in", (req, res) => {
  const { email, password } = req.body;

  return res.status(200).json({
    status: true,
    data: {
      id: 1,
      username: "hi~",
      point: 5,
    },
  });
});

// user/out 라우터
router.post("/out", (req, res) => {
  const { id } = req.session;

  return res.status(200).json({
    status: true,
  });
});

// user/reset 라우터
router
  .route("/reset")
  // POST, 이메일 검증
  .post((req, res) => {
    const { email } = req.body;

    res.status(200).json({
      status: true,
      data: {
        email: "id@example.com",
        resetQuestion: "Where are you from?",
      },
    });
  })
  // PUT, 답변 검증 & 패스워드 변경
  .put((req, res) => {
    const { email, newPassword, resetAnswer } = req.body;

    return res.status(200).json({
      status: true,
    });
  });

// GET /user/log 라우터
router.get("/log", (req, res) => {
  const { id } = req.session;
  const { skip } = req.query;

  return res.status(200).json({
    status: true,
    data: {
      logs: [
        {
          createdAt: Date.now() - 2000,
          comment: "최초 로그인",
          amount: 5,
        },
        {
          createdAt: Date.now() - 20000,
          comment: "서비스 이용",
          amount: -1,
        },
        {
          createdAt: Date.now() - 200000,
          comment: "최초 로그인",
          amount: 5,
        },
      ],
    },
  });
});

module.exports = router;
