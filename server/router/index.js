import { fourHundredFour } from '../utils';
import Router from 'express/lib/router';
import CarsRouter from './cars';

let router = new Router();

// *** just for debug *** //
router.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

router.use('/cars', CarsRouter);

router.get('/*', fourHundredFour);

export default router;
