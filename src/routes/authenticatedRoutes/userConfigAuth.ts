import { Router } from "express";
import { user } from "../../configRoutes.json";

import { RemakeTokenController } from "../../controller/Account/Auth/RemakeTokenController";
import { ConfirmChangePasswordController } from "../../controller/Account/MenageAccount/ConfirmChangePasswordController";
import { DeleteAccountController } from "../../controller/Account/MenageAccount/DeleteAccountController";
import { Modify2FAController } from "../../controller/Account/MenageAccount/Modify2FAController";
import { UpdateNameOrDescController } from "../../controller/Account/MenageAccount/UpdateNameOrDescController";
import { UpdateUserPhotoServiceController } from "../../controller/Account/MenageAccount/UpdateUserPhotoController";

const userConfigRoutes = Router();

userConfigRoutes.get(user.remakeToken, RemakeTokenController);
userConfigRoutes.patch(user.change2FA, Modify2FAController);
userConfigRoutes.patch(user.updateUserPhoto, UpdateUserPhotoServiceController);
userConfigRoutes.patch(user.updateNameOrDesc, UpdateNameOrDescController);
userConfigRoutes.patch(
  user.confirmUpdatePassword,
  ConfirmChangePasswordController
);
userConfigRoutes.delete(user.delete, DeleteAccountController);

export default userConfigRoutes;
