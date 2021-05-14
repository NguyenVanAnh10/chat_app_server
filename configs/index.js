import dotenv from "dotenv";
dotenv.config();

export default {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  SECRET_KEY: process.env.SECRET_KEY,
  USER_GMAIL: process.env.USER_GMAIL,
  PASS_GMAIL: process.env.PASS_GMAIL,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
};
