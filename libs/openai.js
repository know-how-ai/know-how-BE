const OpenAI = require("openai");

// singleton instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getCompletion = async (content) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0];
};

module.exports = { openai, getCompletion };
