import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { PostsRepositories } from "@repositories/postsRepositories";
import { PostModel, PostOnHTTP } from "@viewModel/postModel";

interface CheckPostExistenceInterface {
  id?: string;
}

export class CheckPostExistenceService {
  constructor(private post: PostsRepositories) {}

  async exec({ id }: CheckPostExistenceInterface): Promise<PostOnHTTP> {
    if (!id) throw inconsistentError();

    const post = await this.post.searchForId(id);

    if (!post)
      throw new HttpProtocol(
        "This post doesn't exist",
        process.env.CONFLICT as string
      );

    return PostModel.toHTTP(post);
  }
}
