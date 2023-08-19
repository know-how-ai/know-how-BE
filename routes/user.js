const express = require("express");
const router = express.Router();
const {
  selectUserByEmail,
  createUser,
  updateUserById,
  updateUserByFirstLogin,
} = require("../controllers/user");
const {
  createPointLogByFirstLogin,
  selectPointLogsBySkip,
} = require("../controllers/point");
const { getTodayDate } = require("../libs/date");
const { hashValue, compareHashed } = require("../libs/hash");
const { isPrivate, isNotPrivate } = require("../middlewares/private");
const passport = require("passport");

//  /user/new 라우터
router.post("/new", isNotPrivate, async (req, res, next) => {
  const {
    body: { email, password, username, resetQuestion, resetAnswer },
  } = req;

  passport.authenticate("local", async (isError, user, error) => {
    if (isError) {
      return next(error);
    }

    // 해당 이메일로 가입한 사용자가 있는지 검증
    if (user) {
      const error = "이미 가입된 이메일입니다.";
      // 409: Conflict, 요청-서버의 상태 간 충돌
      return res.status(409).json({
        status: false,
        error,
      });
    }

    // 패스워드 해싱 && 솔팅 - bcrypt
    // 데이터베이스에 새 row 생성 - Users.create
    const newUser = await createUser({
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
    };

    // 최초 로그인으로 인한 포인트 지급 로그 생성 - PointLogs.create
    const newUserPointLog = await createPointLogByFirstLogin(
      newUser.dataValues.id,
    );
    // 최초 로그인으로 인한 포인트 지급
    await updateUserByFirstLogin(
      newUser.dataValues.id,
      newUser.dataValues.point,
      newUserPointLog.dataValues.amount,
    );

    data.point += newUserPointLog.dataValues.amount;

    // 검증 로직 완료, 로그인 로직 수행 - sessioning
    return req.login(newUser, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      // 201: Created, 요청에 따른 새로운 자원 생성됨.
      return res.status(201).json({
        status: true,
        data,
      });
    });
  })(req, res, next);
});

//  /user/in 라우터
router.post("/in", isNotPrivate, async (req, res, next) => {
  const {
    body: { password },
  } = req;

  passport.authenticate("local", async (isError, user, error) => {
    if (isError) {
      return next(error);
    }

    // 해당 이메일로 가입한 사용자가 있는지 검증
    if (!user) {
      const error = "해당 이메일로 가입된 사용자가 존재하지 않습니다.";
      // 401: Unauthorized, 요청된 리소스에 대해 유효하지 않은 인증 상태
      return res.status(401).json({
        status: false,
        error,
      });
    }

    const isAccordPassword = compareHashed(password, user.password);

    // 패스워드 검증
    if (!isAccordPassword) {
      const error = "패스워드가 일치하지 않습니다.";
      // 401: Unauthorized, 요청된 리소스에 대해 유효하지 않은 인증 상태
      return res.status(401).json({
        status: false,
        error,
      });
    }

    const data = {
      id: user.id,
      point: user.point,
      username: user.username,
    };

    const today = getTodayDate();
    const isFirstLoggedInToday = today !== user.last_logged_in;

    // 오늘의 최초 로그인 - 최초 로그인 포인트 지급
    if (isFirstLoggedInToday) {
      // 트랜잭션으로 DB 작업 단위를 묶을 수 있지 않을까?
      const newLog = await createPointLogByFirstLogin(user.id);
      await updateUserByFirstLogin(
        user.id,
        user.point,
        newLog?.dataValues?.amount,
      );

      // 응답으로 넘겨줄 point 갱신
      data.point += newLog?.dataValues?.amount;
    }

    // 검증 로직 완료, 로그인 로직 수행 - sessioning
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      // 로그인 완료
      return res.status(200).json({
        status: true,
        data,
      });
    });
  })(req, res, next);
});

//  /user/out 라우터
router.post("/out", isPrivate, (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy();

    // 로그아웃 완료
    return res.status(200).json({
      status: true,
    });
  });
});

//  /user/reset 라우터
router
  .route("/reset")
  // POST: 이메일 검증
  .post(isNotPrivate, async (req, res, next) => {
    const {
      body: { email },
    } = req;

    try {
      // 유저 검색
      const user = await selectUserByEmail(email);

      // 이메일 존재 여부 검증
      if (!user) {
        const error = "존재하지 않는 이메일입니다.";
        // 401: Unauthorized, 요청된 리소스에 대해 유효하지 않은 인증 상태
        return res.status(401).json({
          status: false,
          error,
        });
      }

      return res.status(200).json({
        status: true,
        data: {
          email,
          resetQuestion: user.dataValues.reset_question,
        },
      });
    } catch (err) {
      next(err);
    }
  })
  // PUT: 패스워드 초기화 답변 검증 && 패스워드 변경
  .put(isNotPrivate, async (req, res, next) => {
    const {
      body: { email, newPassword, resetAnswer },
    } = req;

    try {
      // 유저 조회 - 패스워드 초기화 답 매칭 검증
      const user = await selectUserByEmail(email);
      const isCorrect = resetAnswer === user.dataValues.reset_answer;

      if (!isCorrect) {
        const error = "패스워드 찾기 질문의 답이 틀렸습니다.";
        // 401: Unauthorized, 요청된 리소스에 대해 유효하지 않은 인증 상태
        return res.status(401).json({
          status: false,
          error,
        });
      }

      // 유저의 패스워드 업데이트 - Users.update
      await updateUserById(
        user.dataValues.id,
        "password",
        await hashValue(newPassword),
      );

      return res.status(200).json({
        status: true,
      });
    } catch (err) {
      next(err);
    }
  });

//  /user/log 라우터
router.get("/log", isPrivate, async (req, res, next) => {
  const {
    user,
    query: { skip },
  } = req;

  try {
    const logsIntstance = await selectPointLogsBySkip(
      user.id,
      "id",
      "DESC",
      skip,
    );

    const logs = logsIntstance.map((inst) => ({
      ...inst.dataValues,
      created_at: new Date(inst.created_at).getTime(),
    }));

    return res.status(200).json({
      status: true,
      data: {
        logs,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
