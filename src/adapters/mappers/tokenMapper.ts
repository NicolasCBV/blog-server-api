import { PartialSession } from "@adapters/tokenAdapter";
import { Users } from "@entities/userTable/_users";
import { ToDomainPropsCache } from "@mappers/redisUser";

export class TokenMapper {
  static toToken(user: Users | ToDomainPropsCache): PartialSession {
    return {
      id: user.id,
      idToken: user.idToken ?? null,
      admin: user.admin,
      name: user.name.value,
      email: user.email.value,
      description: user.description?.value,
      photo: user.photo,
      TFAStatus: user.accept2FA,
    };
  }
}
