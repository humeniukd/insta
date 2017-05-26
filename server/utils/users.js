const users = {swagger: 'sample'}

export default {
  get: (id) => users[id],
  set: (id, val) => (users[id] = val),
  has: (id) => !!users[id]
}
