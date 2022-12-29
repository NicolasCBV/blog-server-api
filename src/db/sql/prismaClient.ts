import { PrismaClient } from "@prisma/client";

// const prismaClient = new PrismaClient({
//   log: ["query", "info", "warn", "error"],
// });
const prismaClient = new PrismaClient();

export { prismaClient };
