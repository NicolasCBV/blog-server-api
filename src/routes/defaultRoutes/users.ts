import { Router } from "express";
import { user } from "../../configRoutes.json";

import { GetTokenController } from "../../controller/Account/Auth/GetTokenController";
import { LoginUserController } from "../../controller/Account/Auth/LoginUserController";
import { CreateUserController } from "../../controller/Account/MenageAccount/CreateUserController";
import { ParseTokenController } from "../../controller/Account/Auth/ParseTokenController";
import { ValidateUserController } from "../../controller/Account/MenageAccount/ValidateUserController";
import { SearchForUserController } from "../../controller/Account/MenageAccount/SearchForUserController";
import { CancelCreationController } from "../../controller/Account/MenageAccount/CancelCreationController";
import { TryChangePasswordController } from "../../controller/Account/MenageAccount/TryChangePasswordController";

const userRoutes = Router();

userRoutes.post(user.create, CreateUserController);
userRoutes.patch(user.validateAccount, ValidateUserController);
userRoutes.post(user.login, LoginUserController);

userRoutes.post(user.getToken, GetTokenController);
userRoutes.get(user.parseToken, ParseTokenController);
userRoutes.get(user.searchForUser, SearchForUserController);
userRoutes.delete(user.cancel, CancelCreationController);
userRoutes.get(user.updatePassword, TryChangePasswordController);

export default userRoutes;
