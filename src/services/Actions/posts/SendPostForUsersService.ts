import { DefaultPermClass } from "../../defaultPermClass";

import { MailAdapter } from "@adapters/mailAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { UsersRepositories } from "@repositories/usersRepositories";
import { Email } from "@entities/userTable/email";
import { PostsRepositories } from "@repositories/postsRepositories";

interface SendPostsForUsersServiceInterface {
  admin?: boolean;
  postId?: string;
}

export class SendPostForUsersService extends DefaultPermClass {
  constructor(
    private usersAdapter: UsersRepositories,
    private postsAdapter: PostsRepositories,
    private mailAdapter: MailAdapter
  ) {
    super();
  }

  /**
   * This class should be able to send one new post
   * for all users where is not admin
   */

  async exec({
    postId,
    admin,
  }: SendPostsForUsersServiceInterface): Promise<void> {
    // Check the hierarchy of user
    if (!admin || !postId)
      throw new HttpProtocol(
        "This user could not realize this action",
        process.env.UNAUTHORIZED as string
      );

    // Get user and your creator data
    const post = await this.postsAdapter.searchForId(postId);

    if (!post) throw inconsistentError();

    const user = await this.usersAdapter.searchForId(post!.creatorId);

    // Get all email users where is not admin
    const allUsers: Email[] | null = await this.usersAdapter.GetAllEmailUsers();

    if (!allUsers || allUsers.length <= 0)
      throw new HttpProtocol(
        "The database don't have any users",
        process.env.CONFLICT as string
      );

    // Send email for all users
    allUsers.forEach(async (mail) => {
      await this.mailAdapter.sendMail({
        from: `${user!.name} <${process.env.EMAIL_SENDER as string}>`,
        to: mail.value,
        subject: post.description.value,
        body: post.content,
      });
    });
  }
}
