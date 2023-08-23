const express = require("express");
const { isPrivate } = require("../middlewares/private");
const { getCompletion } = require("../libs/openai");
const router = express.Router();

//  /user/coverletter 라우터
router.get("/coverletter", async (req, res) => {
  // const {
  // user,
  // body: { coverletter, job },
  // } = req;

  let job = "개발자";
  let coverletter =
    "개발자에게 에러는 항상 생각해야 할 문제입니다. " +
    "저는 에러를 해결할 줄 아는 능력이 개발자에게 중요하다고 생각합니다. " +
    "이런 에러 해결 능력의 기본이 되는 것이 컴퓨터에 대한 기초지식입니다. " +
    "저는 서버 개발 공부뿐만 아니라 컴퓨터 기초 지식인 자료구조, 알고리즘, OS, 컴퓨터 구조,네트워크 등 " +
    "다양한 공부를 학교 수업과 책, 과제 등을 통해 배운 내용을 예습 및 복습을 통해 제 것으로 만들기 위해 노력하였고, " +
    "그 결과 대부분의 컴퓨터 전공과목에서 좋은 성적을 받아 전공학점이 4.5점 만점에 3.96이라는 좋은 결과를 얻을 수 있었습니다. " +
    "그뿐만 아니라 주 언어로 사용하는 Java 역시 Java의 정석 책을 통해 기초적인 람다 함수 및 Stream 같은 고급 문법 역시 공부하여, " +
    "프로젝트에 적용하고 있으며 인터넷 강의와 책을 통해 Spring의 기초원리 특징 등에 대해 꾸준히 공부하며 " +
    "많은 상황에 대처할 수 있는 개발자가 되기 위해 노력하고 있습니다.";

  const prompt =
    `${job}에 지원하고자 자기소개서를 다음과 같이 작성했습니다. ` +
    coverletter +
    `이 자기소개서에서 잘한 점 3가지, 아쉬운 점 3가지를 작성하고, 전체적인 총평을 {"result": {"good": ["1. ...", "2. ...", ], "bad": ["1. ...", "2. ...", ], "overall": ["..."] }} 같은 JSON 형태로 작성해주세요.`;

  const result = await getCompletion(prompt);

  // kogpt API 호출
  // 유저 포인트 삭감
  // 포인트 로그 기록

  return res.status(200).json({
    status: true,
    data: {
      result: JSON.parse(result?.message?.content),
    },
  });
});

//  /user/job 라우터
router.get("/job", async (req, res) => {
  // const {
  //   user,
  //   body: { job, domain, project, description, skill, feature },
  // } = req;

  let domain = "프로그래밍";
  let job = "웹 개발자";
  let description = "인공지능을 이용한 자기소개서 첨삭 웹사이트 개발";
  let project = "프로젝트";
  let skill = "자바스크립트, open ai";
  let feature = "자바스크립트 숙련도 증가, 인공지능에 대한 깊은 이해";

  const prompt =
    `${domain} 업계의 ${job}으로 취업하려고 합니다.` +
    `${description} 내용의 ${project}를` +
    `${skill} 등을 이용하여 진행했으며, ${feature}를 이뤄냈습니다.` +
    `면접 전형에서 받을 가능성이 높은 질문 5개를 {"questions" : ["...", "...", ]}과 같은 JSON 형식으로 작성해주세요.`;

  const result = await getCompletion(prompt);
  // kogpt API 호출
  // 유저 포인트 삭감
  // 포인트 로그 기록

  return res.status(200).json({
    status: true,
    data: {
      result: JSON.parse(result?.message?.content),
    },
  });
});

//  /user/interview 라우터
router.get("/interview", async (req, res) => {
  // const {
  //   user,
  //   body: { personalities },
  // } = req;

  const personalities =
    "창의력이 풍부함, 게임을 좋아함, 사고력이 좋음, 몽상가, 골똘함";

  const prompt =
    `"${personalities}"의 성향을 가진 사람에게 ` +
    "어울리는 직업과 해당 직업에서 그 성향이 중요한 이유와 함께 총 5가지를 " +
    `{"jobs" : { "job": "...", "description": "..." }} 같은 JSON 형태로 추천해주세요.`;

  const result = await getCompletion(prompt);
  // kogpt API 호출
  // 유저 포인트 삭감
  // 포인트 로그 기록

  return res.status(200).json({
    status: true,
    data: {
      result: JSON.parse(result?.message?.content),
    },
  });
});

module.exports = router;
