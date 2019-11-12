// Import libs
import { Router } from 'express';

// Import of Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import SubscriptionController from './app/controllers/SubscriptionController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';

// Import of middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/students/:id/checkins', CheckinController.store);

routes.post('/user', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/user', UserController.update);
routes.get('/student', StudentController.index);
routes.post('/student', StudentController.store);
routes.put('/student', StudentController.update);
routes.get('/subscription', SubscriptionController.index);
routes.post('/subscription', SubscriptionController.store);
routes.put('/subscription/:id', SubscriptionController.update);
routes.delete('/subscription/:id', SubscriptionController.delete);
routes.post('/registration', RegistrationController.store);
routes.get('/registration', RegistrationController.index);
routes.put('/registration/:id', RegistrationController.update);
routes.delete('/registration/:id', RegistrationController.delete);

export default routes;
