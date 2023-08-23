const express = require("express");
const { isPrivate } = require("../middlewares/private");
const router = express.Router();
const { updateUserById } = require("../controllers/user");
const { createPointLog } = require("../controllers/point");
const { getCompletion } = require("../libs/openai");

//  /user/coverletter 라우터
router.post("/coverletter", isPrivate, async (req, res, next) => {
  const {
    user: { id, point },
    body: { coverletter, job },
  } = req;

  const prompt =
    `${job}에 지원하고자 자기소개서를 다음과 같이 작성했습니다. ` +
    coverletter +
    ` 이 자기소개서에서 잘한 점 3가지, 아쉬운 점 3가지를 작성하고, 전체적인 총평을` +
    ` {"result": {"good": ["1. ...", "2. ...", ], "bad": ["1. ...", "2. ...", ], "overall": ["..."] }}` +
    ` 같은 JSON 형태로 작성해주세요.`;

  try {
    // GPT 호출
    // JSON 변환
    // const prompt = "대한민국이라는 국가에 대해 간략하게 설명해주세요.";
    const result = await getCompletion(prompt);
    const json = JSON.parse(result?.message?.content);

    /**
     * {
     *  index: number,
     *  message: {
     *    role: string,
     *    content: string
     *  },
     *  finish_reason: string
     * }
     */

    // 유저 포인트 삭감
    await updateUserById(id, "point", point - 1);
    // 포인트 로그 기록
    await createPointLog(id, -1, "자소서 코칭 서비스 이용으로 인한 차감");

    return res.status(200).json({
      status: true,
      data: {
        result: json,
      },
    });
  } catch (err) {
    next(err);
  }
});

//  /user/job 라우터
router.post("/job", isPrivate, async (req, res, next) => {
  const {
    user: { id, point },
    body: { job, domain, project, description, skill, feature },
  } = req;

  const prompt =
    `${domain} 업계의 ${job}으로 취업하려고 합니다.` +
    `${description} 내용의 ${project}를` +
    `${skill} 등을 이용하여 진행했으며, ${feature}를 이뤄냈습니다.` +
    `면접 전형에서 받을 가능성이 높은 질문 5개를 ` +
    `{"questions" : ["...", "...", ]}과 같은 JSON 형식으로 작성해주세요.`;

  try {
    // GPT 호출
    // JSON 변환
    // const prompt = "대한민국이라는 국가에 대해 간략하게 설명해주세요.";
    const result = await getCompletion(prompt);
    const json = JSON.parse(result?.message?.content);

    // 유저 포인트 삭감
    await updateUserById(id, "point", point - 1);
    // 포인트 로그 기록
    await createPointLog(id, -1, "면접 코칭 서비스 이용으로 인한 차감");

    return res.status(200).json({
      status: true,
      data: {
        result: json,
      },
    });
  } catch (err) {
    next(err);
  }
});

//  /user/interview 라우터
router.post("/interview", isPrivate, async (req, res, next) => {
  const {
    user: { id, point },
    body: { personalities },
  } = req;

  const prompt =
    `"${personalities}"의 성향을 가진 사람에게 ` +
    "어울리는 직업과 해당 직업에서 그 성향이 중요한 이유와 함께 총 5가지를 " +
    `{"jobs" : { "job": "...", "description": "..." }} ` +
    `같은 JSON 형태로 추천해주세요.`;

  try {
    // GPT 호출
    // JSON 변환
    // const prompt = "대한민국이라는 국가에 대해 간략하게 설명해주세요.";
    const result = await getCompletion(prompt);
    const json = JSON.parse(result?.message?.content);

    // 유저 포인트 삭감
    await updateUserById(id, "point", point - 1);
    // 포인트 로그 기록
    await createPointLog(id, -1, "직업 추천 서비스 이용으로 인한 차감");

    return res.status(200).json({
      status: true,
      data: {
        result: json,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
