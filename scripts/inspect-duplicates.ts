
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

    console.log('--- Analysis Report ---')
    for (const student of students) {
        if (student.studentCourses.length > 1) {
            console.log(`Student: ${student.firstName} ${student.lastName} (${student.email})`)
            console.log(`  Target for cleanup (has ${student.studentCourses.length} courses):`)
            student.studentCourses.forEach((sc, index) => {
                console.log(`    ${index + 1}. [${sc.id}] ${sc.course.name} (Joined: ${sc.joinedAt.toISOString()})`)
            })

            // Identify candidates for deletion (all except the first one)
            const toKeep = student.studentCourses[0]
            const toDelete = student.studentCourses.slice(1)
            console.log(`    -> Proposal: Keep "${toKeep.course.name}", Delete ${toDelete.length} others.`)
        }
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
