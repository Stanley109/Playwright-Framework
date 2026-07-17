// we can use a class here. but it's overkill.s
// export default class Env {

//     public static BASE_URL = process.env.BASE_URL;
//     public static ENV_NAME = process.env.TEST_ENV;
// }

//  this just acts as a wrapper so that other files can import and use this instead of doing process.env.BASE_URL, you can use env.BASE_URL

const env = {
  BASE_URL: process.env.BASE_URL,
  ENV_NAME: process.env.ENV_NAME,
  ENV_TEST_MSG: process.env.ENV_TEST_MSG,
};

export default env;


