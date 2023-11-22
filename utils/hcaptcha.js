const hcaptcha = require("hcaptcha");
const dotenv = require("dotenv").config();

const secretKey = process.env.HCAPTCHA_SEC_KEY;

async function verify(token) {
  try {
    const verified = await hcaptcha.verify(secretKey, token);

    if (verified) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

module.exports = verify;
