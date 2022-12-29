import { Posts } from "@entities/postTable/_posts";
import { Description } from "@entities/postTable/description";
import { Name } from "@entities/postTable/name";
import { posts } from "@prisma/client";

export type MinimalPostDataOnPrisma = {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class PrismaPost {
  static toPrisma(data: Posts) {
    return {
      imageUrl: data.imageUrl ?? null,
      name: data.name.value,
      description: data.description.value,
      content: data.content,
      creatorId: data.creatorId,
    };
  }

  static toDomain(data: posts): Posts {
    return new Posts(
      {
        creatorId: data.creatorId,
        name: new Name(data.name),
        description: new Description(data.description ?? null),
        imageUrl: data?.imageUrl,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      data.id
    );
  }

  static toDomainOnMinimal(data: MinimalPostDataOnPrisma): Posts {
    return new Posts(
      {
        creatorId: data.creatorId,
        name: new Name(data.name),
        description: new Description(data.description ?? null),
        imageUrl: data?.imageUrl,
        content: "oculted",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      data.id
    );
  }
}
