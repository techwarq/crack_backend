import {Router} from 'express'
import authMiddleware from '../middlewares/auth';
import { getTodo, postTodo } from '../controllers/Todo';


const todosRoutes : Router = Router({ mergeParams: true });

todosRoutes.post('/todos',authMiddleware,postTodo);
todosRoutes.get('/todos', authMiddleware,getTodo )

export default todosRoutes;