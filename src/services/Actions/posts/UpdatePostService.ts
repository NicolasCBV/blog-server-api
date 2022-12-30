import fs from "fs";
import path from "path";

import { inconsistentError } from "@errors/http/DefaultErrors";
import { HttpProtocol } from "@errors/http/httpErrors";
import { PostsRepositories } from "@repositories/postsRepositories";
import { Description } from "@entities/postTable/description";
import { Name } from "@entities/postTable/name";

interface UpdatePostServiceType {
  id?: string;
  admin?: boolean;
  name?: string;
  description?: string;
  content?: string;
}

export class UpdatePostService {
  constructor(private postAdapter: PostsRepositories) {}

  /**
   * This service should be able o update one post, but the user should be admin
   */

  async exec({
    id,
    admin,
    name,
    description,
    content,
  }: UpdatePostServiceType): Promise<void> {
    // Check the hierarchy of user
    if (!admin)
      throw new HttpProtocol(
        "This user could not realize this action",
        process.env.UNAUTHORIZED as string
      );

    // Check incongruities
    if (!id || !name || !description || !content) throw inconsistentError();

    // Get post with id
    const post = await this.postAdapter.searchForId(id);

    if (!post)
      throw new HttpProtocol(
        "This post doesn't exist",
        process.env.CONFLICT as string
      );

    // Update name on directory
    if (post.name.value !== name) {
      const formatedOldName = post.name.value.replaceAll(" ", "_");
      const oldUrl = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "public",
        "uploads",
        "posts",
        formatedOldName
      );

      const formatedNewName = name.replaceAll(" ", "_");
      const newUrl = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "public",
        "uploads",
        "posts",
        formatedNewName
      );

      fs.access(oldUrl, (err) => {
        if (err && err.message.includes("no such file or directory")) return;

        if (err && !err.message.includes("no such file or directory")) {
          throw err;
        }

        fs.rename(oldUrl, newUrl, (err) => {
          if (err) throw err;
        });
      });
    }

    // Update name and content on post
    post.name = new Name(name);
    post.description = new Description(description);
    post.content = content;

    await this.postAdapter.update(post);
  }
}
