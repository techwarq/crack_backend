import { Router } from "express";
import { signup } from "../controllers/auth";
import authroutes from "./auth.routes";
import goalRoutes from "./goals.routes";
import authMiddleware from "../middlewares/auth";
import topicRoutes from "./topics.routes";

const rootRouter: Router = Router()

rootRouter.use('/auth', authroutes)
rootRouter.use('/me', authMiddleware, goalRoutes);
rootRouter.use('/me/goals/:goalId', authMiddleware, topicRoutes)

export default rootRouter;