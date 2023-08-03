const yearIsValid = (value) => {
  const MIN_YEAR = 1991;
  const CURRENT_YEAR = new Date().getFullYear();

  const year = Number(value);
  if (!year) {
    throw new Error('Year must be a number');
  }

  if (year < MIN_YEAR) {
    throw new Error(`Year can't be less than ${MIN_YEAR}`);
  }

  if (year > CURRENT_YEAR) {
    throw new Error("Please don't post blogs from the future");
  }
};

module.exports = {
  yearIsValid,
};
