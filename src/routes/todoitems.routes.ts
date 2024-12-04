import {Router} from 'express'
import authMiddleware from '../middlewares/auth';


import { addTodoItem, getTodoItems, toggleTodoItemCompletion } from '../controllers/todoitem';


const todoitemsRoutes : Router = Router({ mergeParams: true });

todoitemsRoutes.post('/todoitem',authMiddleware,addTodoItem);
todoitemsRoutes.get('/todoitem', authMiddleware,getTodoItems );
todoitemsRoutes.patch('/todoitem/:itemId', authMiddleware, toggleTodoItemCompletion);


export default todoitemsRoutes;