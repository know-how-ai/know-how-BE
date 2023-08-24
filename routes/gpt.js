const express = require("express");
const { isPrivate } = require("../middlewares/private");
const router = express.Router();
const { getCompletion } = require("../libs/openai");
const isAffordablePoint = require("../middlewares/isAffordablePoint");
const afterUsingGPT = require("../middlewares/afterUsingGPT");

//  /user/coverletter 라우터
router.post(
  "/coverletter",
  isPrivate,
  isAffordablePoint,
  async (req, res, next) => {
    const {
      body: { coverletter, job },
    } = req;

    const prompt =
      `${job}에 지원하고자 자기소개서를 다음과 같이 작성했습니다. ` +
      coverletter +
      ` 이 자기소개서에서 잘한 점 3가지, 아쉬운 점 3가지를 작성하고, 전체적인 총평을` +
      ` {"result": {"good": ["1. ...", "2. ...", "3. ..."], "bad": ["1. ...", "2. ...", "3. ..."], "overall": ["..."] }}` +
      ` 같은 JSON 형태로 작성해주세요.`;

    try {
      const result = await getCompletion(prompt);
      const json = await JSON.parse(result?.message.content);

      req.data = {
        result: json?.result,
      };

      next();
    } catch (err) {
      next(err);
    }
  },
  afterUsingGPT,
);

//  /user/interview 라우터
router.post(
  "/interview",
  isPrivate,
  isAffordablePoint,
  async (req, res, next) => {
    const {
      body: { job, domain, project, description, skill },
    } = req;

    const prompt =
      `'${domain}' 업계의 '${job}'으로 취업하려고 합니다.` +
      `'${description}'와 같은 내용의 '${project}'를` +
      `'${skill}' 등을 이용하여 진행했습니다.` +
      `면접 전형에서 받을 가능성이 높은 질문 5개를 ` +
      `{"result" : ["1. ...", "2. ...", "3. ...", "4. ...", "5. ..."]}과 같은 JSON 형식으로 작성해주세요.`;

    try {
      const result = await getCompletion(prompt);
      const json = await JSON.parse(result?.message.content);

      req.data = {
        result: json?.result,
      };

      next();
    } catch (err) {
      next(err);
    }
  },
  afterUsingGPT,
);

//  /user/job 라우터
router.post(
  "/job",
  isPrivate,
  isAffordablePoint,
  async (req, res, next) => {
    const {
      body: { personalities },
    } = req;

    const str =
      personalities.length === 1 ? personalities[0] : personalities.join(", ");

    // const prompt =
    //   `'${str}'의 성향을 가진 사람에게 ` +
    //   "가장 추천할만한 직업과 사유 3가지를 " +
    //   `{"result" : [{ "job": "...", "description": "..." }, ... ]} ` +
    //   `와 같은 형태의 JSON 형식으로 작성해주세요.`;
    const prompt =
      `'${str}'의 성향을 가진 사람에게 ` +
      "가장 추천할만한 직업과 적합한 근거를 덧붙인 답변 총 3가지를 " +
      `{"result" : [{ "job": "...", "description": "..." }, ... ]} ` +
      `와 같은 형태의 JSON 형식으로 작성해주세요.`;

    try {
      const result = await getCompletion(prompt);
      const json = await JSON.parse(result?.message.content);

      req.data = {
        result: json?.result,
      };

      next();
    } catch (err) {
      return next(err);
    }
  },
  afterUsingGPT,
);

module.exports = router;
