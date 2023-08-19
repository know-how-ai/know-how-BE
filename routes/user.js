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
const { isNotPrivate, isPrivate } = require("../middlewares/private");

//  /user/new 라우터
router.post("/new", isNotPrivate, async (req, res, next) => {
  const { email, password, username, resetQuestion, resetAnswer } = req.body;

  passport.authenticate("local", async (isError, user, error) => {
    if (isError) {
      return next(error);
    }

    // 요청 이메일로 이미 가입된 사용자 있는지 검증
    if (user) {
      const error = "이미 가입된 이메일입니다.";
      // 409 : Conflict, 요청-서버의 상태 간 충돌
      return res.status(409).json({
        status: false,
        error,
      });
    }

    // 신규 유저 생성
    const newUser = await createUser({
      email,
      password: await hashValue(password),
      username,
      reset_question,
      reset_answer,
    });

    const data = {
      id: newUser.dataValues.id,
      username,
      point: newUser.dataValues.point,
    };

    // 최초 로그인 처리
    const newUserPointLog = await createPointLogByFirstLogin(
      newUser.dataValues.id,
    );

    await updateUserByFirstLogin(
      newUser.dataValues.id,
      newUser.dataValues.point,
      newUser.dataValues.amount,
    );

    data.point += newUserPointLog.amount;

    // 검증 로직 완료, 로그인 로직 수행
    return req.login(newUser, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      // 201: Created, 요청에 따른 새로운 자원 생성
      return res.status(201).json({
        status: true,
        data,
      });
    });
  })(req, res, next);
});

//  /user/in 라우터
router.post("/in", isNotPrivate, async (req, res, next) => {
  const { password } = req.body;

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

    // 오늘의 최초 로그인 검증
    if (isFirstLoggedInToday) {
      const newLog = await createPointLogByFirstLogin(user.id);
      await updateUserByFirstLogin(
        user.id,
        user.point,
        newLog?.dataValues?.amount,
      );

      // 응답으로 넘겨줄 point 갱신
      data.point += newLog?.dataValues?.amount;
    }

    // 검증 로직 완료, 로그인 로직 수행
    return req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

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
    const { email } = req.body;

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
    } catch (error) {
      next(error);
    }
  })
  // PUT: 패스워드 초기화 답변 검증 && 패스워드 변경
  .put(isNotPrivate, async (req, res, next) => {
    const { email, newPassword, resetAnswer } = req.body;
    try {
      // 유저 조회 - 패스워드 찾기 질답 검증
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
    } catch (error) {
      next(error);
    }
  });

//  /user/log 라우터
router.get("/log", isPrivate, async (req, res, next) => {
  const { user } = req;
  const { skip } = req.query;
  try {
    const logsIntstance = await selectPointLogsBySkip(
      user.id,
      "id",
      "DESC",
      skip,
    );
    const logs = logsIntstance.map((inst) => inst.dataValues);

    return res.status(200).json({
      status: true,
      data: {
        logs,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
