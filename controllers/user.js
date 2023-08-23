const Users = require("../models/users");

// 패스워드 해싱 && 솔팅 - bcrypt
const createUser = async (values) => {
  if (typeof values !== "object") {
    console.error(
      "This function is need to a object type. Please check the arguments.",
    );
    return;
  }

  const result = await Users.create(values);

  return result;
};

const selectUserByEmail = async (email) => {
  if (typeof email !== "string") {
    console.error(
      "This function is need to a string type. Please check the arguments.",
    );
    return;
  }

  const found = await Users.findOne({
    where: {
      email,
    },
  });

  return found;
};

const selectUserById = async (id) => {
  if (typeof id !== "number") {
    console.error(
      "This function is need to a number type. Please check the arguments.",
    );
    return;
  }

  const found = await Users.findByPk(id);

  return found;
};

const updateUserById = async (id, column, value) => {
  if (typeof id !== "number" || typeof column !== "string") {
    console.error(
      "This function is need to number and string type. Please check the arguments.",
    );
    return;
  }

  const result = await Users.update({ [column]: value }, { where: { id } });

  return result;
};

const updateUserByFirstLogin = async (id, previousPoint, earning) => {
  if (
    typeof id !== "number" ||
    typeof previousPoint !== "number" ||
    typeof earning !== "number"
  ) {
    console.error(
      "This function is need to number types. Please check the arguments.",
    );
    return;
  }

  const today = new Date();

  const values = {
    point: previousPoint + earning,
    last_logged_in: today,
  };

  const result = await Users.update(values, { where: { id } });

  return result;
};

const deleteUserById = async (id) => {
  if (typeof id !== "number") {
    console.error(
      "This function is need to a number type. Please check the arguments.",
    );
    return;
  }

  const result = await Users.destroy({ where: { id } });

  return result;
};

module.exports = {
  selectUserByEmail,
  createUser,
  updateUserById,
  updateUserByFirstLogin,
  selectUserById,
  deleteUserById,
};
