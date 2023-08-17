const Users = require("../models/users");

// 패스워드 해싱 && 솔팅 - bcrypt
const createUser = async (values) => {
  const result = await Users.create(values);

  return result;
};

const selectUserByEmail = async (email) => {
  const found = await Users.findOne({
    where: {
      email,
    },
  });

  return found;
};

const updateUserById = async (id, column, value) => {
  const result = await Users.update({ [column]: value }, { where: { id } });

  return result;
};

const updateUserByFirstLogin = async (id, previousPoint, earning) => {
  const today = new Date();

  const values = {
    point: previousPoint + earning,
    last_logged_in: today,
  };

  const result = await Users.update(values, { where: { id } });

  return result;
};

module.exports = {
  selectUserByEmail,
  createUser,
  updateUserById,
  updateUserByFirstLogin,
};
