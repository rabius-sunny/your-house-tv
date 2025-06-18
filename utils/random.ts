export const generateRandomNumber = (n: number = 6) => {
  return Math.floor(Math.random() * 10 ** n);
};

export const generateRandomString = (n: number = 6) => {
  return Math.random()
    .toString(36)
    .substring(2, n + 2)
    .toUpperCase();
};
