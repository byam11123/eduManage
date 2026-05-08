import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting migration to Multi-Course Architecture...')

    const students = await prisma.student.findMany({
        where: {
            courseId: { not: null } // Only migrate students with a course
        },
        include: {
            course: true,
            batch: true
        }
    })

    console.log(`Found ${students.length} students to migrate.`)

    for (const student of students) {
        if (!student.courseId) continue

        console.log(`Migrating student: ${student.firstName} ${student.lastName} (${student.id})`)

        // 1. Create StudentCourse
        // Check if already exists to prevent duplicates if re-running
        const existingEnrollment = await prisma.studentCourse.findUnique({
            where: {
                studentId_courseId: {
                    studentId: student.id,
                    courseId: student.courseId
                }
            }
        })

        if (existingEnrollment) {
            console.log(`- Enrollment already exists. Skipping.`)
            continue
        }

        const enrollment = await prisma.studentCourse.create({
            data: {
                studentId: student.id,
                courseId: student.courseId,
                status: student.status === 'graduated' ? 'completed' :
                    student.status === 'dropped' ? 'dropped' : 'ongoing',
                totalFee: student.totalAmount || 0,
                discountAmount: student.discountAmount || 0,
                netPayable: student.netPayableFee || 0,
                joinedAt: student.enrollmentDate,
                updatedAt: student.updatedAt
            }
        })
        console.log(`- Created StudentCourse (ID: ${enrollment.id})`)

        // 2. Link Batch (if exists)
        if (student.batchId) {
            await prisma.studentCourseBatch.create({
                data: {
                    studentCourseId: enrollment.id,
                    batchId: student.batchId
                }
            })
            console.log(`- Linked Batch: ${student.batch?.name}`)
        }

        // 3. Migrate Installments (from JSON)
        if (student.installmentPlan) {
            try {
                const plan = JSON.parse(student.installmentPlan as string)
                if (Array.isArray(plan) && plan.length > 0) {
                    const installmentData = plan.map((item: any) => ({
                        studentCourseId: enrollment.id,
                        installmentNo: Number(item.installmentNo),
                        dueDate: new Date(item.dueDate), // Ensure parsing
                        amount: Number(item.amount),
                        paidAmount: Number(item.paidAmount) || 0,
                        paidDate: item.paymentDate ? new Date(item.paymentDate) : null,
                        status: item.status || 'pending',
                        mode: item.mode || null,
                        receiptNo: item.receiptNo || null,
                        remarks: item.remark || null,
                        // transactionId? -> not in JSON typings but good to have if we had it
                    }))

                    await prisma.installment.createMany({
                        data: installmentData
                    })
                    console.log(`- Migrated ${installmentData.length} installments.`)
                }
            } catch (e) {
                console.error(`- Failed to parse/migrate installments for student ${student.id}`, e)
            }
        }
    }

    console.log('Migration completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
