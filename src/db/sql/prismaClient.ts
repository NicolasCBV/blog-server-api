import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClient = globalForPrisma.prisma || new PrismaClient();

globalForPrisma.prisma = prismaClient;

export { prismaClient };
