export const IDREGEX = '[0-9a-f-]{36}'
const REGEX = '[0-9A-z]+'

export const cars = {
  list: `/:make(${REGEX})?/:model(${REGEX})?`,
  get: `/:id(${IDREGEX})`,
  reserve: `/reserve`
}
