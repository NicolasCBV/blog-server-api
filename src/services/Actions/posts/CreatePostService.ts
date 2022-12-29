import { MailAdapter } from "@adapters/mailAdapter";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { eventEmitterSendPosts } from "@events/sendNewPostsEvent";
import { UsersRepositories } from "@repositories/usersRepositories";
import { PostsRepositories } from "@repositories/postsRepositories";
import { Name } from "@entities/postTable/name";
import { Description } from "@entities/postTable/description";
import { Posts } from "@entities/postTable/_posts";

interface CreatePostServiceType {
  admin?: boolean;
  name?: string;
  content?: string;
  desc?: string;
  creatorId?: string;
}

export class CreatePostService {
  constructor(
    private postAdapter: PostsRepositories,
    private usersAdapter: UsersRepositories,
    private mailAdapter: MailAdapter
  ) {}

  /**
   * This class should be able to create another post, but the user should be admin
   */

  async exec({
    admin,
    name,
    content,
    desc,
    creatorId,
  }: CreatePostServiceType): Promise<string> {
    // Check the hierarchy of user
    if (!admin || !name)
      throw new HttpProtocol(
        "This user could not realize this action",
        process.env.UNAUTHORIZED as string
      );

    // Check if post already exist
    if (await this.postAdapter.search(name))
      throw new HttpProtocol(
        "This post name already exist",
        process.env.CONFLICT as string
      );

    // Check incongruities
    if (
      !name ||
      name.length > 32 ||
      !content ||
      !desc ||
      desc.length > 46 ||
      !creatorId
    )
      throw inconsistentError();

    // Create post
    const data = await this.postAdapter.create(
      new Posts({
        name: new Name(name),
        content,
        description: new Description(desc),
        creatorId,
      })
    );

    // Send post for all users
    eventEmitterSendPosts.emit(
      "send",
      data!.id,
      this.usersAdapter,
      this.postAdapter,
      this.mailAdapter
    );

    return data!.id;
  }
}
