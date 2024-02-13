const isANumber = (str) => {
  if (str === null || str === undefined || typeof str !== "string") {
    return false;
  }
  return !isNaN(Number(str));
};

module.exports = isANumber;
