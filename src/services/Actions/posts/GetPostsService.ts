import { PostsRepositories } from "@repositories/postsRepositories";
import { Posts } from "@entities/postTable/_posts";
import { PostModel, PostOnHTTP } from "@viewModel/postModel";

export class GetPostsService {
  constructor(private postsAdapter: PostsRepositories) {}

  /**
   * This class should be able to get one group of
   * 5 most recent posts
   */

  async exec(): Promise<PostOnHTTP[]> {
    const data = await this.postsAdapter.getGroup();

    const posts =
      data.length > 0
        ? data.map((item: Posts) => {
            return PostModel.toHTTP(item);
          })
        : [];

    return posts;
  }
}
