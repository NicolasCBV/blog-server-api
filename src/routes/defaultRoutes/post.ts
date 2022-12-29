import { Router } from "express";
import { post } from "../../configRoutes.json";

import { GetPostController } from "../../controller/Actions/posts/GetPostController";
import { GetPostsController } from "../../controller/Actions/posts/GetPostsController";
import { SearchForPostController } from "../../controller/Actions/posts/SearchForPostController";

const postRouter = Router();

postRouter.get(post.get, GetPostController);
postRouter.get(post.searchFor, SearchForPostController);
postRouter.get(post.getGroup, GetPostsController);

export default postRouter;
