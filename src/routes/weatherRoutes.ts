import { Router } from 'express';
import { getCurrentWeather, getWeatherForecast } from '../controllers/weatherController';

const router: Router = Router();

router.get('/current', getCurrentWeather);
router.get('/forecast', getWeatherForecast);

export default router;