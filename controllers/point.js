const PointLogs = require("../models/pointLogs");

// 최초 로그인으로 인한 포인트 지급 로그 생성 - PointLogs.create
const createNewPointLog = async (user_id, amount, comment) => {
  const result = await PointLogs.create({ user_id, amount, comment });

  return result;
};

const earnPointByfirstLogin = (user_id) => {
  const point = 5;
  const comment = "최초 로그인으로 인한 포인트 지급";

  return createNewPointLog(user_id, point, comment);
};

const getPointLogsBySkip = async (user_id, orderColumn, orderStyle, skip) => {
  const unit = 5; // 로그 검색 단위
  const offset = unit * parseInt(skip);

  const results = await PointLogs.findAll({
    where: {
      user_id,
    },
    order: [[orderColumn, orderStyle.toUpperCase()]],
    limit: unit, // getting amount of logs
    offset, // skipping parts
  });

  return results;
};

module.exports = {
  createNewPointLog,
  earnPointByfirstLogin,
  getPointLogsBySkip,
};
