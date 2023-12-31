const PointLogs = require("../models/pointLogs");

// 최초 로그인으로 인한 포인트 지급 로그 생성 - PointLogs.create
const createPointLog = async (user_id, amount, comment) => {
  if (
    typeof user_id !== "number" ||
    typeof amount !== "number" ||
    typeof comment !== "string"
  ) {
    console.error(
      "This function is need to number and string type. Please check the arguments.",
    );
    return;
  }

  const result = await PointLogs.create({ user_id, amount, comment });

  return result;
};

const createPointLogByFirstLogin = async (user_id) => {
  if (typeof user_id !== "number") {
    console.error(
      "This function is need to a number type. Please check the arguments.",
    );
    return;
  }

  const point = 5;
  const comment = "최초 로그인으로 인한 포인트 지급";

  return await createPointLog(user_id, point, comment);
};

const selectPointLogsBySkip = async (
  user_id,
  orderColumn,
  orderStyle,
  skip,
) => {
  if (
    typeof user_id !== "number" ||
    typeof orderColumn !== "string" ||
    typeof orderStyle !== "string"
  ) {
    console.error(
      "This function is need to number and string type. Please check the arguments.",
    );
    return;
  }

  const unit = 5; // 로그 검색 단위
  const offset = parseInt(skip);

  const results = await PointLogs.findAll({
    where: {
      user_id,
    },
    order: [[orderColumn, orderStyle.toUpperCase()]],
    limit: unit, // getting amount of logs
    offset, // skipping parts
    attributes: ["amount", "comment", "created_at"],
  });

  return results;
};

module.exports = {
  createPointLog,
  createPointLogByFirstLogin,
  selectPointLogsBySkip,
};
