import bcrypt from "bcrypt";

import configs from "../configs/index.js";

export const generateCryptPassword = async (plainTextPassword) => {
  const salt = await bcrypt.genSalt(Number(configs.SALT_ROUNDS) || 10);
  return await bcrypt.hash(plainTextPassword, salt);
};

export const compareCryptPassword = async (plainTextPassword, hash) => {
  return await bcrypt.compare(plainTextPassword, hash);
};
