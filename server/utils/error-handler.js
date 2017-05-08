export default (err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).send(err.msg)
}
