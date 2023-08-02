/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node", // 테스트 환경 지정
  testMatch: ["**/tests/*.test.js"],
  setupFiles: ["dotenv/config"],
};

module.exports = config;
