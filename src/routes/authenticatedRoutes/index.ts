import { Router } from "express";
import { user, post } from "../../configRoutes.json";

import AuthMiddleware from "../../middleware/AuthMiddleware";
import postRoutes from "./postsAuth";
import userConfigRoutes from "./userConfigAuth";

const routesAuth = Router();

routesAuth.use(AuthMiddleware);
routesAuth.use(post.authName, postRoutes);
routesAuth.use(user.authName, userConfigRoutes);

export default routesAuth;
