const express = require("express");
const router = express.Router();

//  /user/new 라우터
router.post("/new", (req, res) => {
  const {
    body: { email, password, username, resetQuestion, resetAnswer },
  } = req;

  // 빈 문자열인 필드가 있는지 검증

  // 이미 해당 이메일로 가입된 사용자가 있는지 검증

  // 패스워드 해싱 && 솔팅

  // 데이터베이스에 새 row 생성

  return res.status(200).json({
    status: true,
    data: {
      id: 0,
      username: "server",
      point: 5,
    },
  });
});

//  /user/in 라우터
router.post("/in", (req, res) => {
  const {
    body: { email, password },
  } = req;

  // 해당 이메일로 가입한 사용자가 있는지 검증

  // 해당 이메일로 가입한 사용자의 패스워드가 일치하는지 검증

  // 세션 등록

  return res.status(200).json({
    status: true,
    data: {
      id: 0,
      username: "server",
      point: 5,
    },
  });
});

//  /user/out 라우터
router.post("/out", (req, res) => {
  const {
    session: { id },
  } = req;

  // 현재 세션이 존재하는지?

  // 세션 파괴

  return res.status(200).json({
    status: true,
  });
});

//  /user/reset 라우터
router
  .route("/reset")
  // POST: 이메일 검증
  .post((req, res) => {
    const {
      body: { email },
    } = req;

    return res.status(200).json({
      status: true,
      data: {
        email: "id@email.com",
        resetQuestion: "What do you want?",
      },
    });
  })
  // PUT: 패스워드 초기화 답변 검증 && 패스워드 변경
  .put((req, res) => {
    const {
      body: { email, newPassword, resetAnswer },
    } = req;

    return res.status(200).json({
      status: true,
    });
  });

// https://localhost:8000/api/user/10/log

//  /user/log 라우터
router.get("/log", (req, res) => {
  const {
    session: { id },
    query: { skip },
  } = req;

  // const Users = require("../models/users");
  // const PointLogs = require("../models/pointLogs");

  // (async () => {
  // const newUser = await Users.create({
  //   username: "유저명",
  //   password: "123",
  //   email: "id@example.com",
  //   reset_question: "what?",
  //   reset_answer: "this",
  //   point: 5,
  // });

  // console.log(newUser);
  // })();

  // (async () => {
  //   const newLog = await PointLogs.create({
  //     amount: 5,
  //     comment: "this is comm",
  //     user_id: 1,
  //   });

  //   console.log(newLog);
  // })();

  // (async () => {
  //   const newLog = await PointLogs.findAll({});

  //   console.log(newLog);
  // })();

  // (async () => {
  // const {
  //   dataValues: { id },
  // } = await Users.findByPk(1);
  // const user = await Users.findAll({});

  // console.log(user, "\n");

  // const result = await Users.destroy({
  //   where: {
  //     id,
  //   },
  // });
  // })();

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
