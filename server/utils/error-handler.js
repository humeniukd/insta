export default (err, req, res, next) => {
  console.error('asdf', err.stack)
  return res.status(err.statusCode || 500).send(err.msg)
}
