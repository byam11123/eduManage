
import { db } from '@/lib/db'

async function main() {
    const students = await db.student.findMany({
        include: {
            studentCourses: {
                include: {
                    course: true
                },
                orderBy: {
                    joinedAt: 'asc'
                }
            }
        }
    })

    let deletedCount = 0
    const idsToDelete: string[] = []

    console.log('--- Cleanup Started ---')
    for (const student of students) {
        if (student.studentCourses.length > 1) {
            const toKeep = student.studentCourses[0]
            const toDelete = student.studentCourses.slice(1)

            console.log(`Student: ${student.firstName} ${student.lastName}`)
            console.log(`  Keeping: ${toKeep.course.name} (Joined: ${toKeep.joinedAt.toISOString()})`)

            for (const sc of toDelete) {
                console.log(`  Deleting: ${sc.course.name} (ID: ${sc.id})`)
                idsToDelete.push(sc.id)
            }
        }
    }

    if (idsToDelete.length > 0) {
        console.log(`\nDeleting ${idsToDelete.length} extra enrollments...`)
        const result = await db.studentCourse.deleteMany({
            where: {
                id: {
                    in: idsToDelete
                }
            }
        })
        console.log(`Successfully deleted ${result.count} records.`)
    } else {
        console.log('No duplicates found. Database is clean.')
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
