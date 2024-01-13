export const getRatio = (date: number) => {
  if (date > 5 && date <= 12) return 0.75;
  else if (date > 12 && date <= 19) return 0.5;
  else if (date > 19 && date < 25) return 0.25;
  return 0;
};
