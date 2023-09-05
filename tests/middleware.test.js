const { sequelize } = require("../models");
const { mockRequest, mockResponse } = require("jest-mock-req-res");
const { isPrivate } = require("../middlewares/private.js");

beforeAll(async () => {
  await sequelize.sync(); // 가짜 ORM 생성
});

describe("private.js 미들웨어", () => {
  const res = mockResponse({});
  const next = jest.fn();

  test("isPrivate: 미로그인 상태", () => {
    const req = mockRequest({
      isAuthenticated: jest.fn(() => false),
    });

    isPrivate(req, res, next);
    expect(res.status).toBeCalledWith(403);
  });

  test("isPrivate: 로그인 상태", () => {
    const req = mockRequest({
      isAuthenticated: jest.fn(() => true),
    });

    isPrivate(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test("isNotPrivate: 미로그인 상태", () => {
    const req = mockRequest({
      isAuthenticated: jest.fn(() => false),
    });

    isPrivate(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test("isNotPrivate: 로그인 상태", () => {
    const req = mockRequest({
      isAuthenticated: jest.fn(() => true),
    });

    isPrivate(req, res, next);
    expect(res.status).toBeCalledWith(403);
  });
});

describe("private.js 미들웨어", () => {
  const res = mockResponse({});
  const next = jest.fn();

  test("isAffordablePoint: 미로그인 상태", () => {
    const req = mockRequest({
      isAuthenticated: jest.fn(() => false),
    });

    isPrivate(req, res, next);
    expect(res.status).toBeCalledWith(403);
  });

  test("isAffordablePoint: 정상 케이스", () => {
    const req = mockRequest({
      isAuthenticated: jest.fn(() => true),
    });

    req.user = {
      point: 10,
    };

    isPrivate(req, res, next);
    expect(next).toBeCalledTimes(1);
  });

  test("isAffordablePoint: 포인트 부족", () => {
    const req = mockRequest({
      isAuthenticated: jest.fn(() => true),
    });

    req.user = {
      point: 0,
    };

    isPrivate(req, res, next);
    expect(res.status).toBeCalledWith(403);
  });
});

afterAll(async () => {
  // 테이블을 다시 만듬 -> 기존 유저를 초기화
  // 왜냐하면 이미 가입된 테스트 계정이 있을경우, 가입테스트 할 경우 충돌나니까 항상 테이블 초기화
  await sequelize.sync({ force: true });
});
