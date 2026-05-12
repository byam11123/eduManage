import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const attendances = await prisma.attendance.findMany()
  console.log('Total attendances:', attendances.length)
  if (attendances.length > 0) {
      console.log(attendances.slice(0, 5))
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
