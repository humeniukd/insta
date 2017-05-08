const IDLENGTH = 24;
const IDREGEX = `[0-9a-fA-F]{${IDLENGTH}}`;

export const cars = {
  list: '/',
  get: `/:id(${IDREGEX})`,
  reserve: `/:id(${IDREGEX})`
};
