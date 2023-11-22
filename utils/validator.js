const verifyCaptcha = require("./hcaptcha");

const validator = async (reservationData) => {
  const warnings = [];

  if (!reservationData["h-captcha-response"]) {
    warnings.push("Captcha is invalid");
  } else {
    const captachaValidity = await verifyCaptcha(
      reservationData["h-captcha-response"]
    );
    if (!captachaValidity) {
      warnings.push("Captcha is invalid");
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(reservationData["date"])) {
    warnings.push("Date is invalid");
  }

  /*  if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(reservationData["time"])) {
    warnings.push("Time is invalid");
  } */

  if (!reservationData["location"]) {
    warnings.push("Location is invalid");
  }

  if (!/^[A-Z0-9\s-]*$/.test(reservationData["vehicle_no"])) {
    warnings.push("Vehicle number is invalid");
  }

  if (!/^\d+$/.test(reservationData["mileage"])) {
    warnings.push("Mileage is invalid");
  }

  if (!reservationData["message"]) {
    warnings.push("Message is invalid");
  }

  return warnings;
};

module.exports = validator;
