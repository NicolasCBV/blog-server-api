import { PrismaUser } from "@mappers/prismaUser";
import { Email } from "@entities/userTable/email";
import { Users } from "@entities/userTable/_users";
import { PrismaClient } from "@prisma/client";
import { UsersRepositories } from "@repositories/usersRepositories";
import { prismaClient as prisma } from "../prismaClient";

export class PrismaUsersAdapter
  extends PrismaClient
  implements UsersRepositories
{
  async create(data: Users): Promise<Users> {
    await prisma.$connect();

    const prismaUser = PrismaUser.toPrisma(data);

    const user = await prisma.users.create({
      data: prismaUser,
    });

    await prisma.$disconnect();

    return PrismaUser.toDomain(user);
  }

  async search(email: Email): Promise<Users | null> {
    await prisma.$connect();

    const user = await prisma.users.findFirst({
      where: {
        email: email.value,
      },
    });

    await prisma.$disconnect();

    return user ? PrismaUser.toDomain(user) : null;
  }

  async searchForId(id: string): Promise<Users | null> {
    await prisma.$connect();

    const user = await prisma.users.findFirst({
      where: {
        id,
      },
    });

    await prisma.$disconnect();

    return user ? PrismaUser.toDomain(user) : null;
  }

  async GetAllEmailUsers(): Promise<Email[]> {
    await prisma.$connect();

    const rawEmails = await prisma.users.findMany({
      where: {
        admin: false,
      },
      select: {
        email: true,
      },
    });

    await prisma.$disconnect();

    const emails = rawEmails.map((key) => {
      return new Email(key.email);
    });

    return emails;
  }

  async update(userData: Users): Promise<void> {
    await prisma.$connect();

    await prisma.users.update({
      where: { id: userData.id },
      data: PrismaUser.toPrisma(userData),
    });
  }

  async delete(userId: string): Promise<void> {
    await prisma.$connect();

    await prisma.users.delete({
      where: {
        id: userId,
      },
      include: {
        posts: true,
      },
    });

    await prisma.$disconnect();
  }
}
