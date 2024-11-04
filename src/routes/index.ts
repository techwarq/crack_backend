import { Router } from "express";
import { signup } from "../controllers/auth";
import authroutes from "./auth.routes";

const rootRouter: Router = Router()

rootRouter.use('/auth', authroutes)

export default rootRouter;