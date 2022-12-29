import { prismaClient as prisma } from "../prismaClient";
import { PrismaClient } from "@prisma/client";
import { PostsRepositories } from "@repositories/postsRepositories";
import { Posts } from "@entities/postTable/_posts";
import { PrismaPost } from "@mappers/prismaPost";

export class PrismaPostsAdapter
  extends PrismaClient
  implements PostsRepositories
{
  async create(post: Posts) {
    await prisma.$connect();

    const data = await prisma.posts.create({
      data: PrismaPost.toPrisma(post),
      include: {
        creatorInfo: true,
      },
    });

    await prisma.$disconnect();

    return PrismaPost.toDomain(data);
  }

  async search(name: string) {
    await prisma.$connect();

    const data = await prisma.posts.findFirst({
      where: {
        name: name,
      },
    });

    await prisma.$disconnect();

    return data ? PrismaPost.toDomain(data) : null;
  }

  async searchFor(input: string) {
    await prisma.$connect();

    const data = await prisma.posts.findMany({
      where: {
        OR: [
          {
            name: {
              contains: input,
            },
          },
          {
            content: {
              contains: input,
            },
          },
          {
            description: {
              contains: input,
            },
          },
        ],
      },
    });

    await prisma.$disconnect();

    if (data.length > 0) {
      const posts = data.map((item) => PrismaPost.toDomain(item));
      return posts;
    }

    return [];
  }

  async searchForId(id: string) {
    await prisma.$connect();

    const data = await prisma.posts.findFirst({
      where: {
        id,
      },
    });

    await prisma.$disconnect();

    return data ? PrismaPost.toDomain(data) : null;
  }

  async update(post: Posts) {
    await prisma.$connect();

    await prisma.posts.update({
      where: {
        id: post.id,
      },
      data: PrismaPost.toPrisma(post),
    });

    await prisma.$disconnect();
  }

  async getGroup() {
    await prisma.$connect();

    const data = await prisma.posts.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        creatorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await prisma.$disconnect();

    const posts: Posts[] = data.map((item) =>
      PrismaPost.toDomainOnMinimal(item)
    );

    return posts;
  }

  async delete(id: string) {
    await prisma.$connect();

    await prisma.posts.delete({
      where: {
        id,
      },
    });

    await prisma.$disconnect();
  }
}
