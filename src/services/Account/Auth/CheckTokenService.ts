import { TokenAdapter, Session } from "@adapters/tokenAdapter";
import {
  UsersCacheRepositories,
  UsersRepositories,
} from "@repositories/usersRepositories";
import { HttpProtocol } from "@errors/http/httpErrors";
import { DefaultPermClass } from "../../defaultPermClass";

interface CheckTokenServiceInterface {
  token?: string;
}

export class CheckTokenService extends DefaultPermClass {
  constructor(
    private cacheDB: UsersCacheRepositories,
    private token: TokenAdapter,
    private user: UsersRepositories
  ) {
    super();
  }

  /**
   * This class should be able to checl the jwt token
   */

  async exec({ token }: CheckTokenServiceInterface): Promise<Session> {
    // Check integrity stage
    if (!token)
      throw new HttpProtocol(
        "Token doesn't exist",
        process.env.CONFLICT as string,
        "Insert one token in requisition"
      );

    const decodeSession = this.token.decode(token);

    if (
      decodeSession.type === "integrity error" ||
      decodeSession.type === "invalid token"
    ) {
      throw new HttpProtocol(
        "Failed to decode the token",
        process.env.UNAUTHORIZED as string,
        `Failed to decode or validate authorization token. Reason: ${decodeSession.type}`
      );
    }

    // Check the veracity stage
    const user = await this.catchUserData({
      usersRepositories: this.user,
      userCacheRepositories: this.cacheDB,
      email: decodeSession.session.email,
    });

    if (decodeSession.session.idToken !== user?.idToken)
      throw new HttpProtocol(
        "Failed to decode the token",
        process.env.CONFLICT as string
      );

    // Validation stage
    const expiration = this.token.validate(decodeSession.session);

    let session: Session;

    switch (expiration) {
      case "expired":
        throw new HttpProtocol(
          "Failed to decode the token",
          process.env.UNAUTHORIZED as string,
          `Authorization token has expired. Please create a new authorization token.`
        );
      case "grace": {
        const { expires, issued } = this.token.encode({
          PartialSession: decodeSession.session,
        });
        session = {
          ...decodeSession.session,
          expires,
          issued,
        };
        break;
      }
      case "active": {
        session = decodeSession.session;

        break;
      }
    }
    return session;
  }
}
