const bcrypt = require("bcrypt");
const Users = require("../models/users");

// 패스워드 해싱 && 솔팅 - bcrypt
const createNewUser = async (values) => {
  const result = await Users.create(values);

  return result;
};

const getUserByEmail = async (email) => {
  const found = await Users.findOne({
    where: {
      email,
    },
  });

  return found;
};

const updateUser = async (id, column, value) => {
  const result = await Users.update({ [column]: value }, { where: { id } });

  return result;
};

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
  getUserByEmail,
  hashValue,
  createNewUser,
  compareHashed,
  updateUser,
};
