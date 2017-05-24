export default (err, req, res, next) => {
  console.error(err.stack)
  return res.status(err.statusCode || 500).send(err.msg)
}
