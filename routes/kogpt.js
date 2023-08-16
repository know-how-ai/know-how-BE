const express = require("express");
const router = express.Router();

//  /user/coverletter 라우터
router.post("/coverletter", (req, res) => {
  const { coverletter, job } = req.body;
  const { id } = req.session;

  let status = false;

  const isEmpty = !(coverletter && job);
  if (isEmpty) {
    const error = "적절하지 않은 폼 값입니다.";
    return res.status().json({
      status,
      error,
    });
  }

  const prompt =
    `${job}에 지원하고자 자기소개서를 다음과 같이 작성했습니다.` +
    coverletter +
    "이 자기소개서에서 잘한 점 3가지와 못한 점 3가지를 찾고, 총평을 작성해주세요.";

  // kogpt API 호출
  // 유저 포인트 삭감
  // 포인트 로그 기록

  status = true;

  return res.status(200).json({
    status,
    data: {
      good: ["1. ...", "2. ...", "3. ..."],
      bad: ["1. ...", "2. ...", "3. ..."],
      overall: "So, ...",
    },
  });
});

//  /user/job 라우터
router.post("/job", (req, res) => {
  const { job, domain, project, description, skill, feature } = req.body;
  const { id } = req.session;

  let status = false;

  const isEmpty = !(
    job &&
    domain &&
    project &&
    description &&
    skill &&
    feature
  );
  if (isEmpty) {
    const error = "적절하지 않은 폼 값입니다.";
    return res.status().json({
      status,
      error,
    });
  }

  const prompt =
    `${domain} 업계의 ${job}으로 취업하려고 합니다.` +
    `${description} 내용의 ${project}를` +
    `${skill} 등을 이용하여 진행했으며, ${feature}를 이뤄냈습니다.` +
    `면접 전형에서 받을 가능성이 높은 질문에 5개를 작성해주세요.`;

  // kogpt API 호출
  // 유저 포인트 삭감
  // 포인트 로그 기록

  status = true;

  return res.status(200).json({
    status,
    data: {
      questions: ["1. ...", "2. ...", "3. ...", "4. ...", "5. ..."],
    },
  });
});

//  /user/interview 라우터
router.post("/interview", (req, res) => {
  const { personalities } = req.body;
  const { id } = req.session;

  let status = false;

  const isEmpty = !personalities.length;
  if (isEmpty) {
    const error = "적절하지 않은 폼 값입니다.";
    return res.status().json({
      status,
      error,
    });
  }

  const prompt =
    `${personalities}의 성향을 가진 사람에게 ` +
    "어울리는 직업 5가지를 각각 해당 직업에서 중요한 성향과 함께 추천해주세요.";

  // kogpt API 호출
  // 유저 포인트 삭감
  // 포인트 로그 기록

  status = true;

  return res.status(200).json({
    status,
    data: {
      recommendations: ["1. ...", "2. ...", "3. ...", "4. ...", "5. ..."],
    },
  });
});

module.exports = router;
