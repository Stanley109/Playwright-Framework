// we can use a class here. but it's overkill.s
// export default class Env {

//     public static BASE_URL = process.env.BASE_URL;
//     public static ENV_NAME = process.env.TEST_ENV;
// }

const env = {
  BASE_URL: process.env.BASE_URL,
  ENV_NAME: process.env.TEST_ENV,
};

export default env;


