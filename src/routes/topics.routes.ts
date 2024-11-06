import {Router} from 'express'
import authMiddleware from '../middlewares/auth';
import { getTopic, postTopics } from '../controllers/topics';


const topicRoutes : Router = Router({ mergeParams: true });

topicRoutes.post('/topics',authMiddleware,postTopics);
topicRoutes.get('/topics', authMiddleware,getTopic )

export default topicRoutes;