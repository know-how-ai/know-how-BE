const request = require("supertest");
const app = require("../app.js");

describe("견본 테스트", () => {
    test("1 is 1", () => {
        expect(1).toBe(1);
    });

    // Issue: Jest has detected the following 1 open handle potentially keeping Jest from exiting
    // Issue: local -> 200, github actions -> 500
    // test("App.js", async () => {
    //     const res = await request(app).get("/");

    //     expect(res.statusCode).toBe(200);
    // });
});
