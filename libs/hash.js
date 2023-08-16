const bcrypt = require("bcrypt");

const hashValue = async (password, saltRounds = 9) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(password, salt);

  return hashed;
};

const compareHashed = async (unhashed, hashed) => {
  const result = await bcrypt.compare(unhashed, hashed);

  return result;
};

module.exports = {
  hashValue,
  compareHashed,
};
