// Import libs
import { Router } from 'express';

// Import of Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

// Import of middlewares
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/user', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/user', UserController.update);
routes.post('/student', StudentController.store);
routes.put('/student', StudentController.update);

export default routes;
