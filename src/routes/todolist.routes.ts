import {Router} from 'express'
import authMiddleware from '../middlewares/auth';

import { createTodoList, getTodoLists } from '../controllers/totolist';


const todolistRoutes : Router = Router({ mergeParams: true });

todolistRoutes.post('/todolist',authMiddleware,createTodoList);
todolistRoutes.get('/todolist', authMiddleware,getTodoLists )

export default todolistRoutes;