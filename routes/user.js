const express = require("express");
const router = express.Router();
const { 
  getUserByEmail, 
  createNewUser, 
  updateUserById,
  updateUserByFirstLogin,
} =
  require("../controllers/user");
const {
  createNewPointByfirstLogin,
  getPointLogsBySkip,
} = require("../controllers/point");
const { getToday } = require("../libs/date");
const { hashValue, compareHashed } = require("../libs/hash");

// user/new 라우터
router.post("/new", async (req, res) => {
  const {
    email,
    password,
    passwordConfirmation,
    username,
    resetQuestion,
    resetAnswer,
  } = req.body;

  let status = false;

  // 빈 문자열인 필드가 있는지 검증
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
  const user = await getUserByEmail(email); // Users.findOne
  if (user) {
    const error = "이미 가입한 이메일입니다.";
    return res.status().json({
      status,
      error,
    });
  }

  // 데이터베이스에 새 row 생성 - Users.create
  const newUser = await createNewUser({
    email,
    password: await hashValue(password),
    username,
    reset_question: resetQuestion,
    reset_answer: resetAnswer,
  });

  const data = {
    id: newUser.dataValues.id,
    username,
    point: newUser.dataValues.point,
  }

  // 최초 로그인으로 인한 포인트 지급 로그 생성
  const newUserPointLog = await createNewPointByfirstLogin(
    newUser.dataValues.id,
  );

  // 최초 로그인으로 인한 포인트 지급
  await updateUserByFirstLogin(
    newUser.dataValues.id,
    newUser.dataValues.point,
    newUserPointLog.dataValues.amount,
  );

  data.point += newUserPointLog.dataValues.amount;
  status = true;

  // 로그인 처리 - 세션 세이브

  return res.status(200).json({
    status,
    data,
  });
});

// user/in 라우터
router.post("/in", async (req, res) => {
  const { email, password } = req.body;

  let status = false;

  // 세션 쿠키의 존재 여부 검증

  const isEmpty = !(email && password);
  if (isEmpty) {
    const error = "폼 값이 부적절합니다.";
    return res.status().json({
      status,
      error,
    });
  }

  // 유저 검색 - Users.findOne
  const user = await getUserByEmail(email);

  // 해당 이메일로 가입한 사용자가 있는지 검증
  if (!user) {
    const error = "해당 이메일로 가입한 사용자가 존재하지 않습니다.";
    return res.status().json({
      status,
      error,
    });
  }

  // 해당 이메일로 가입한 사용자의 패스워드가 일치하는지 검증
  const isAccordPassword = await compareHashed(
    password,
    user.dataValues.password,
  ); // bcrypt.compare
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

  // TO-DO : 로그인하는 유저의 updated_at 필드의 갱신 여부 확인 필요
  // 세션 등록

  status = true;
  const data = {
    id: user.dataValues.id,
    username: user.dataValues.username,
    point: user.dataValues.point,
  };

  const today = getToday();
  const isAlreadyLoggedInToday = today === user.dataValues.last_logged_in;

  // 이미 오늘 로그인한 기록이 있는 경우 - 최초 로그인 포인트 지급 X
  if (isAlreadyLoggedInToday) {
    return res.status(200).json({
      status,
      data,
    });
  }

  const newLog = await createNewPointByfirstLogin(user.dataValues.id);
  const savedUser = await updateUserByFirstLogin(
    user.dataValues.id,
    user.dataValues.point,
    newLog.dataValues.amount,
  );

  data.point += newLog.dataValues.amount;

  return res.status(200).json({
    status,
    data,
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
  .post(async (req, res) => {
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
    const user = await getUserByEmail(email); // Users.findOne

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
        resetQuestion: user.dataValues.reset_question,
      },
    });
  })
  // PUT, 답변 검증 & 패스워드 변경
  .put(async (req, res) => {
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

    // 유저 조회 - 패스워드 찾기 질답 검증
    const user = await getUserByEmail(email);

    const isCorrect = resetAnswer === user.dataValues.reset_answer;
    if (!isCorrect) {
      const error = "패스워드 찾기 질문의 답이 틀렸습니다.";
      return res.status().json({
        status,
        error,
      });
    }

    // 유저의 패스워드 업데이트 Users.update
    await updateUserById(
      user.dataValues.id,
      "password",
      await hashValue(newPassword),
    );

    status = true;

    return res.status(200).json({
      status,
    });
  });

// GET /user/log 라우터
router.get("/log", async (req, res) => {
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

  const logsInstance = await getPointLogsBySkip(id, "id", "DESC", skip);
  const logs = logsInstance.map((inst) => inst.dataValues);

  status = true;

  return res.status(200).json({
    status,
    data: {
      logs,
    },
  });
});

module.exports = router;
