export default {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
};
