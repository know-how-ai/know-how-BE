const { createPointLog } = require("../controllers/point");
const { updateUserById } = require("../controllers/user");

const afterUsingGPT = async (req, res, next) => {
  const {
    user: { id, point },
    data,
    gptType,
  } = req;

  try {
    // 유저 포인트 삭감
    await updateUserById(id, "point", point - 1);
    // 포인트 로그 기록
    await createPointLog(id, -1, gptType + " 서비스 이용으로 인한 차감");

    return res.status(200).json({
      status: true,
      data,
    });
  } catch (err) {
    // console.warn(err);
    next(err);
  }
};

module.exports = afterUsingGPT;
