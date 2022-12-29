import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { UsersRepositories } from "@repositories/usersRepositories";
import { PostsRepositories } from "@repositories/postsRepositories";
import { PostModel, PostOnHTTP } from "@viewModel/postModel";

interface ReturnGetPostServiceInterface {
  post: PostOnHTTP;
  creatorUser: {
    name: string;
    email: string;
  };
}

interface GetPostServiceType {
  id?: string;
}

export class GetPostService {
  constructor(
    private userAdapter: UsersRepositories,
    private postsAdapter: PostsRepositories
  ) {}

  /**
   * This class should be able to get one post
   */

  async exec({
    id,
  }: GetPostServiceType): Promise<ReturnGetPostServiceInterface> {
    if (!id) throw inconsistentError();

    // Get post
    const post = await this.postsAdapter.searchForId(id);

    if (!post)
      throw new HttpProtocol(
        "This post doesn't exist",
        process.env.CONFLICT as string
      );

    // Get user
    const user = await this.userAdapter.searchForId(post.creatorId);

    if (!user)
      throw new HttpProtocol(
        "This author of this post doesn't exist",
        process.env.CONFLICT as string
      );

    return {
      creatorUser: {
        name: user.name.value,
        email: user.email.value,
      },
      post: PostModel.toHTTP(post),
    };
  }
}
