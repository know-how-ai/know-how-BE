const app = require("../app.js");
const request = require("supertest");
const { sequelize } = require("../models");

beforeAll(async () => {
  await sequelize.sync(); // 가짜 ORM 생성
});

describe("GET /", () => {
  test("프리테스트", () => {
    request(app).get("/").expect(200);
  });
});

describe("POST /user/new", () => {
  test("회원가입 테스트: 정상 회원가입", (done) => {
    request(app)
      .post("/user/new")
      .send({
        // formData
        email: "id@email.com",
        password: "1234",
        passwordConfirmation: "1234",
        username: "test",
        resetQuestion: "reset question",
        resetAnswer: "reset answer",
      })
      .expect(201, done); // 비동기 메소드를 처리할때 콜백함수로 처리할경우 반드시 done
  });

  test("회원가입 테스트: 중복 가입", (done) => {
    request(app)
      .post("/user/new")
      .send({
        // formData
        email: "id@email.com",
        password: "1234",
        passwordConfirmation: "1234",
        username: "test",
        resetQuestion: "reset question",
        resetAnswer: "reset answer",
      })
      .expect(409, done);
  });
});

describe("POST /user/in", () => {
  test("로그인 테스트: 미가입자", (done) => {
    request(app)
      .post("/user/in")
      .send({
        email: "test@email.com",
        password: "1234",
      })
      .expect(401, done);
  });

  test("로그인 테스트: 틀린 이메일", (done) => {
    request(app)
      .post("/user/in")
      .send({ email: "id@email.net", password: "1234" })
      .expect(401, done);
  });

  test("로그인 테스트: 틀린 패스워드", (done) => {
    request(app)
      .post("/user/in")
      .send({ email: "id@email.com", password: "1111" })
      .expect(401, done);
  });

  test("로그인 테스트: 정상 로그인", (done) => {
    request(app)
      .post("/user/in")
      .send({ email: "id@email.com", password: "1234" })
      .expect(200, done);
  });
});

describe("POST /user/in", () => {
  const agent = request.agent(app);

  // 테스트 전, agent로 로그인 처리
  beforeEach((done) => {
    agent
      .post("/user/in")
      .send({ email: "id@email.com", password: "1234" })
      .end(done);
  });

  test("로그인 테스트: 이미 로그인한 상태", (done) => {
    agent
      .post("/user/in")
      .send({
        email: "test@email.com",
        password: "1234",
      })
      .expect(403, done);
  });
});

describe("POST /user/out", () => {
  const agent = request.agent(app);

  beforeEach((done) => {
    agent
      .post("/user/in")
      .send({ email: "id@email.com", password: "1234" })
      .end(done);
  });

  test("로그아웃 테스트: 정상 처리", (done) => {
    agent.post("/user/out").expect(200, done);
  });
});

describe("GET /user/log", () => {
  test("로그 테스트: 미로그인 상태", (done) => {
    request(app).get("/user/log?skip=0").expect(403, done);
  });

  const agent = request.agent(app);

  beforeEach((done) => {
    agent
      .post("/user/in")
      .send({ email: "id@email.com", password: "1234" })
      .end(done);
  });

  test("로그 테스트: 정상 로그인 상태", (done) => {
    agent.get("/user/log?skip=0").expect(200, done);
  });
});

describe("POST /user/reset", () => {
  test("리셋 테스트: 없는 이메일 탐색", (done) => {
    request(app)
      .post("/user/reset")
      .send({ email: "id@email.net" })
      .expect(401, done);
  });

  test("리셋 테스트: 유효한 이메일 탐색", (done) => {
    request(app)
      .post("/user/reset")
      .send({ email: "id@email.com" })
      .expect(200, done);
  });
});

describe("PUT /user/reset", () => {
  test("리셋 테스트: 실패한 초기화 질답 검증", (done) => {
    request(app)
      .put("/user/reset")
      .send({
        email: "id@email.com",
        newPassword: "1111",
        newPasswordConfirmation: "1111",
        resetQuestion: "reset question",
        resetAnswer: "reset question",
      })
      .expect(401, done);
  });

  test("리셋 테스트: 유효한 초기화 질답 검증", (done) => {
    request(app)
      .put("/user/reset")
      .send({
        email: "id@email.com",
        newPassword: "1111",
        newPasswordConfirmation: "1111",
        resetQuestion: "reset question",
        resetAnswer: "reset answer",
      })
      .expect(200, done);
  });
});

describe("POST /gpt/coverletter", () => {
  test("OpenAI API 테스트: 미로그인 상태", (done) => {
    request(app)
      .post("/gpt/coverletter")
      .send({
        coverletter: "",
        job: "",
      })
      .expect(403, done);
  });
});

describe("POST /gpt/interview", () => {
  test("OpenAI API 테스트: 미로그인 상태", (done) => {
    request(app)
      .post("/gpt/interview")
      .send({
        job: "",
        domain: "",
        project: "",
        description: "",
        skill: "",
      })
      .expect(403, done);
  });
});

describe("POST /gpt/job", () => {
  test("OpenAI API 테스트: 미로그인 상태", (done) => {
    request(app)
      .post("/gpt/job")
      .send({
        personalities: [""],
      })
      .expect(403, done);
  });
});

afterAll(async () => {
  // 테이블을 다시 만듬 -> 기존 유저를 초기화
  // 왜냐하면 이미 가입된 테스트 계정이 있을경우, 가입테스트 할 경우 충돌나니까 항상 테이블 초기화
  await sequelize.sync({ force: true });
});
