import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { PostsRepositories } from "@repositories/postsRepositories";
import { PostModel, PostOnHTTP } from "@viewModel/postModel";

interface SearchForPostInterface {
  input?: string;
}

export class SearchForPostService {
  constructor(private postAdapter: PostsRepositories) {}

  /**
   * This class should be able to get posts
   * using their id's.
   *
   * Warning: don't feel confused about the searchForPost
   * and GetPost. SearchForPost is used with one searchbar
   * on client side, it could return multiples values or
   * nothing, using their names. Furthermore, GetPost is
   * used with id's.
   * @param input this argument refer to some content
   * identical with this value input in database.
   */

  async exec({ input }: SearchForPostInterface): Promise<PostOnHTTP[] | null> {
    if (!input) throw inconsistentError();

    const data = await this.postAdapter.searchFor(input);

    if (!data)
      throw new HttpProtocol(
        "This post doesn't exist",
        process.env.CONFLICT as string
      );

    const posts = data.map((item) => {
      return PostModel.toHTTP(item);
    });

    return posts;
  }
}
