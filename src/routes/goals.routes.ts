import {Router} from 'express'
import authMiddleware from '../middlewares/auth';
import { getGoals, postGoals } from '../controllers/goals';


const goalRoutes : Router = Router();

goalRoutes.post('/goals',authMiddleware,postGoals);
goalRoutes.get('/goals', authMiddleware,getGoals )

export default goalRoutes;