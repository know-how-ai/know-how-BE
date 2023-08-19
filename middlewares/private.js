const isPrivate = (req, res, next) => {
  console.log("로그인여부 ", req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(403).json({
      status: true,
      error: "로그인이 필요합니다.",
    });
  }
};

const isNotPrivate = (req, res, next) => {
  console.log("로그인여부 ", req.isAuthenticated());
  if (!req.isAuthenticated()) {
    next();
  } else {
    return res.status(403).json({
      status: true,
      error: "접근 권한이 없습니다.",
    });
  }
};

module.exports = {
  isPrivate,
  isNotPrivate,
};
