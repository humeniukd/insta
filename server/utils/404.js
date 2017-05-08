export default (req, res) => {
  return res.status(404).send({
    code: 404,
    message: 'Not Found',
    description: 'API endpoint not found',
    url: req.url
  })
}
