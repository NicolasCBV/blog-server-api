import { Router } from "express";
import { post, user } from "../../configRoutes.json";

import userRoutes from "./users";
import postRouter from "./post";

const defaultRoutes = Router();

defaultRoutes.use(post.defaultName, postRouter);
defaultRoutes.use(user.defaultName, userRoutes);

export default defaultRoutes;
