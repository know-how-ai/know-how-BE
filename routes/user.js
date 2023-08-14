const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const pointLogs = require("../models/pointLogs");

// user/new 라우터
router.post("/new", (req, res) => {
  const {
    email,
    password,
    passwordConfirmation,
    username,
    resetQuestion,
    resetAnswer,
  } = req.body;

  let status = false;

  // 반 문자열인 필드가 있는지 검증
  const isEmpty = !(
    email &&
    password &&
    passwordConfirmation &&
    username &&
    resetQuestion &&
    resetAnswer
  );
  if (isEmpty) {
    const error = "폼 값이 부적절합니다.";
    return res.status().json({
      status,
      error,
    });
  }

  // 패스워드와 패스워드 확인 일치 여부 검증
  const isAccord = password === passwordConfirmation;
  if (!isAccord) {
    const error = "패스워드 확인란이 일치하지 않습니다.";
    return res.status().json({
      status,
      error,
    });
  }

  // 요청 이메일로 이미 가입된 사용자 있는지 검증
  const user = null; // Users.findOne
  if (user) {
    const error = "이미 가입한 이메일입니다.";
    return res.status().json({
      status,
      error,
    });
  }

  // 패스워드 해싱 && 솔팅 - bcrypt

  // 데이터베이스에 새 row 생성 - Users.create
  const newUser = null; // newUser.dataValues

  // 최초 로그인으로 인한 포인트 지급 로그 생성 - PointLogs.create

  status = true;

  return res.status(200).json({
    status,
    data: {
      id: 0, // newUser.dataValues.id
      username,
      point: 5, // newUser.dataValues.point
    },
  });
});

// user/in 라우터
router.post("/in", (req, res) => {
  const { email, password } = req.body;

  let status = false;

  const isEmpty = !(email && password);
  if (isEmpty) {
    const error = "폼 값이 부적절합니다.";
    return res.status().json({
      status,
      error,
    });
  }

  // 유저 검색 - Users.findOne
  const user = null; // user.dataValues

  // 해당 이메일로 가입한 사용자가 있는지 검증
  if (!user) {
    const error = "해당 이메일로 가입한 사용자가 존재하지 않습니다.";
    return res.status().json({
      status,
      error,
    });
  }

  // 해당 이메일로 가입한 사용자의 패스워드가 일치하는지 검증
  const isAccordPassword = null; // bcrypt.compare
  if (!isAccordPassword) {
    const error = "패스워드가 일치하지 않습니다.";
    return res.status().json({
      status,
      error,
    });
  }

  // 오늘의 최초 로그인 여부 검증 맟 이에 따른 포인트 지급 결정
  /**
   * 1. 유저를 찾는다.
   * 2. 유저의 last_logged_in 필드를 현재 Date와 비교
   * 3. 일자가 다른 경우, 포인트 지급 및 새 PointLogs row를 생성.
   * >>> 일자가 같고 다름을 검증하는 함수가 필요
   */

  // 세션 등록
  // req.session.save()
  status = true;

  return res.status(200).json({
    status,
    data: {
      id: 1, // user.dataValues.id
      username: "hi~", // user.dataValues.username
      point: 5, // user.dataValues.point
    },
  });
});

// user/out 라우터
router.post("/out", (req, res) => {
  const { id } = req.session;

  let status = false;

  // 현재 세션이 존재하는지?
  const currentSession = true;
  if (!currentSession) {
    const error = "잘못된 접근입니다.";
    return res.status(401).json({
      status,
      error,
    });
  }
  // 세션 파괴
  // req.session.destroy();
  status = true;

  return res.status(200).json({
    status,
  });
});

// user/reset 라우터
router
  .route("/reset")
  // POST, 이메일 검증
  .post((req, res) => {
    const { email } = req.body;

    let status = false;

    // 이메일 존재 여부
    const isEmpty = !email;
    if (isEmpty) {
      const error = "폼 값이 부적절합니다.";
      return res.status().json({
        status,
        error,
      });
    }

    // 유저 검색
    const user = null; // Users.findOne

    // 이메일 존재 여부 검증
    if (!user) {
      const error = "존재하지 않는 이메일입니다.";
      return res.status().json({
        status,
        error,
      });
    }

    status = true;

    return res.status(200).json({
      status,
      data: {
        email,
        resetQuestion: "Where are you from?", // user.dataValues.resetQuestion
      },
    });
  })
  // PUT, 답변 검증 & 패스워드 변경
  .put((req, res) => {
    const { email, newPassword, newPasswordConfirmation, resetAnswer } =
      req.body;

    let status = false;

    const isEmpty = !(
      email &&
      newPassword &&
      newPasswordConfirmation &&
      resetAnswer
    );
    if (isEmpty) {
      const error = "폼 값이 부적절합니다.";
      return res.status().json({
        status,
        error,
      });
    }

    // 새 패스워드 & 새 패스워드 확인란 여부 일치 검증
    const isAccord = newPassword === newPasswordConfirmation;
    if (!isAccord) {
      const error = "패스워드 확인란이 일치하지 않습니다.";
      return res.status().json({
        status,
        error,
      });
    }

    const user = true; // Users.findOne

    const isCorrect = user.dataValues.resetAnswer === resetAnswer;
    if (!isCorrect) {
      const error = "패스워드 찾기 질문의 답이 틀렸습니다.";
      return res.status().json({
        status,
        error,
      });
    }

    // 유저의 패스워드 업데이트 Users.update

    status = true;

    return res.status(200).json({
      status,
    });
  });

// GET /user/log 라우터
router.get("/log", (req, res) => {
  const { id } = req.session;
  const { skip } = req.query;

  let status = false;

  const isEmpty = id === undefined;
  if (isEmpty) {
    const error = "잘못된 요청입니다.";
    return res.status(401).json({
      status,
      error,
    });
  }

  // 로그 검색 단위
  const unit = 5;

  // 로그 조회(findAll) - 로그인한 유저 아이디로 내림차순 검색, offset과 limit 옵션 이용
  // order : [["id", "DESC"]]
  // offeset:unit * parseInt(skip) // offset만큼 점프한 곳에서
  // limit:unit // limit만큼 얻어옴

  status = true;

  return res.status(200).json({
    status,
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
