import { DefaultPermClass } from "../../defaultPermClass";
import path from "path";

import { eventEmitterCleanPhotoPost } from "@events/cleanPhotosPostEvent";

import { HttpProtocol } from "@errors/http/httpErrors";
import { inconsistentError } from "@errors/http/DefaultErrors";
import { PostsRepositories } from "@repositories/postsRepositories";
import { PostModel, PostOnHTTP } from "@viewModel/postModel";

interface InsertPostPhotoServiceInterface {
  admin?: boolean;
  post?: PostOnHTTP;
  filename?: string;
  id?: string;
}

export class InsertPostPhotoService extends DefaultPermClass {
  constructor(private postAdapter: PostsRepositories) {
    super();
  }

  async exec({
    admin,
    post,
    filename,
    id,
  }: InsertPostPhotoServiceInterface): Promise<void> {
    // Check the hierarchy of user
    if (!admin)
      throw new HttpProtocol(
        "This user could not realize this action",
        process.env.UNAUTHORIZED as string
      );

    // Check incongruities
    if (!filename || !id || !post) throw inconsistentError();

    const postSearched = await this.postAdapter.searchForId(post.id);

    if (!postSearched)
      throw new HttpProtocol(
        "This post doesn't exist",
        process.env.CONFLICT as string
      );

    const formatedName = post.name.replaceAll(" ", "_");

    // Check if post have one photo, if have, delete it
    if (post!.imageUrl !== null) {
      // Prepare url
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

      // Clean existent photos
      eventEmitterCleanPhotoPost.emit("clean", url, filename);
    }

    // Create url
    const serverUrl = process.env.URL_SERVER as string;
    const url = `${serverUrl}/uploads/posts/${formatedName}/${filename}`;

    // Update images
    post.imageUrl = url;
    await this.postAdapter.update(PostModel.toDomain(post));
  }
}
