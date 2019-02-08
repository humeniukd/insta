export default (err, req, res, next) => {
  return res.status(err.statusCode || 500).send(err.msg)
}
