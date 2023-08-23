const request = require("supertest");
const app = require("../app.js");

describe("견본 테스트", () => {
  beforeAll(() => {
    // connect to database && create tables with models
    require("../models")
      .sequelize.sync({ alter: true })
      .then((fulfilled) => {
        console.log("DB 연결 성공. ✅");
      })
      .catch((err) => console.error(err));
  });

  test("1 is 1", () => {
    expect(1).toBe(1);
  });

  test("App.js", () => {
    return request(app)
      .get("/")
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });
});
