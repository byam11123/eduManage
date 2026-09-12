import { PrismaClient } from './prisma'

let db: any;
try {
  db = new PrismaClient({ log: ['query'] });
} catch {
  console.warn('[AI Studio] Database not connected — using mock');
  const noOp = { findMany: async () => [], findFirst: async () => null,
    findUnique: async () => null, create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {}, delete: async () => ({}) };
  db = new Proxy({}, { get: () => noOp });
}

const globalForPrisma = globalThis as unknown as {
  prisma_v2: PrismaClient | undefined
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v2 = db

export { db };