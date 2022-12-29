import { Description } from "@entities/postTable/description";
import { Name } from "@entities/postTable/name";
import { Posts } from "@entities/postTable/_posts";

export type PostOnHTTP = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
};

export class PostModel {
  static toHTTP(post: Posts): PostOnHTTP {
    return {
      id: post.id,
      name: post.name.value,
      description: post.description.value,
      imageUrl: post.imageUrl,
      creatorId: post.creatorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      content: post.content,
    };
  }

  static toDomain(post: PostOnHTTP): Posts {
    return new Posts(
      {
        name: new Name(post.name),
        description: new Description(post.description),
        imageUrl: post.imageUrl,
        creatorId: post.creatorId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        content: post.content,
      },
      post.id
    );
  }
}
