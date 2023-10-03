const validator = (reservationData) => {
  const warnings = [];

  if (!reservationData["date"].isDate) {
    warnings.push("Date is invalid");
  }

  if (
    !reservationData["time"].matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  ) {
    warnings.push("Time is invalid");
  }

  if (!reservationData["location"].notEmpty()) {
    warnings.push("Location is invalid");
  }

  if (!reservationData["vehicle_no"].matches(/^[A-Z0-9]+$/)) {
    warnings.push("Vahicle number is invalid");
  }
  if (!reservationData["mileage"].isInt({ min: 0 })) {
    warnings.push("Milage is invalid");
  }

  if (!reservationData["message"].notEmpty()) {
    warnings.push("Message is invalid");
  }

  return warnings;
};

module.exports = validator;
