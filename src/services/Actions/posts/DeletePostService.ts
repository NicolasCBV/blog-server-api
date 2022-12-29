import fs from "fs";
import path from "path";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { PostsRepositories } from "@repositories/postsRepositories";

interface DeletePostServiceType {
  id?: string;
  admin?: boolean;
}

export class DeletePostService {
  constructor(private postAdapter: PostsRepositories) {}

  /**
   * This class should be able to delete one post, but the user should be admin
   */

  async exec({ id, admin }: DeletePostServiceType): Promise<void> {
    // Check incongruities
    if (!id) throw inconsistentError();
    if (!admin)
      throw new HttpProtocol(
        "This user could not realize this action",
        process.env.UNAUTHORIZED as string
      );

    // Get post
    const post = await this.postAdapter.searchForId(id);

    if (!post)
      throw new HttpProtocol(
        "This post doesn't exist",
        process.env.CONFLICT as string
      );

    // Delete possible images of this post
    if (post!.imageUrl !== null) {
      const formatedName = post.name.value.replaceAll(" ", "_");
      const url = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "public",
        "uploads",
        "posts",
        formatedName
      );

      fs.access(url, (err) => {
        if (err && !err.message.includes("no such file or directory")) {
          throw err;
        }

        fs.rmSync(url, { recursive: true, force: true });
      });
    }

    // Delete post
    await this.postAdapter.delete(id);
  }
}
