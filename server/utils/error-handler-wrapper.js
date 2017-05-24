/**
 * Wrapper function to be used on any route handlers.
 * Ensures proper error handling.
 * All wrapped functions must be promises for this to work.
 *
 * @example
 *   router.get('/path', wrap(routeHandler));
 */
export default (fn) => async (req, res, next) => res.send(await fn(req, res, next).catch(next))
