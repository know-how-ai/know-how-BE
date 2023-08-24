const isAffordablePoint = async (req, res, next) => {
  const {
    user: { point },
  } = req;

  if (point < 1) {
    const error = "포인트가 부족합니다.";
    // 403 Forbidden: 사용자에게 권한 없음.
    return res.status(403).json({
      status: false,
      error,
    });
  }

  next();
};

module.exports = isAffordablePoint;
