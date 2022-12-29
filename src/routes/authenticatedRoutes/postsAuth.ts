import { Router } from "express";
import { post } from "../../configRoutes.json";

import { InsertPostPhotoController } from "../../controller/Actions/posts/InsertPostPhotoController";
import { CreatePostController } from "../../controller/Actions/posts/CreatePostController";
import { DeletePostController } from "../../controller/Actions/posts/DeletePostController";
import { UpdatePostController } from "../../controller/Actions/posts/UpdatePostController";
import { SendPostForUsersController } from "../../controller/Actions/posts/SendPostForUsersController";
import { CheckPostExistenceMiddleware } from "../../middleware/CheckPostExistenceMiddleware";

const postRoutes = Router();

postRoutes.patch(
  post.insertPostPhoto,
  CheckPostExistenceMiddleware,
  InsertPostPhotoController
);
postRoutes.patch(post.update, UpdatePostController);
postRoutes.post(post.seadPostForUsers, SendPostForUsersController);
postRoutes.post(post.create, CreatePostController);
postRoutes.delete(post.delete, DeletePostController);

export default postRoutes;
