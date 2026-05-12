import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Fixing orphaned StudentCourses...')
  
  // Find all studentCourses that have NO installments
  const orphanedCourses = await prisma.studentCourse.findMany({
    where: {
      installments: {
        none: {}
      }
    },
    include: {
      student: true
    }
  })

  console.log(`Found ${orphanedCourses.length} student courses with missing installments.`)

  for (const course of orphanedCourses) {
    if (course.totalFee > 0) {
      console.log(`Creating default installment for Student: ${course.student.firstName} (Fee: ${course.totalFee})`)
      await prisma.installment.create({
        data: {
          studentCourseId: course.id,
          installmentNo: 1,
          dueDate: new Date(),
          amount: course.totalFee,
          paidAmount: 0,
          status: 'pending'
        }
      })
    }
  }

  console.log('Migration complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
