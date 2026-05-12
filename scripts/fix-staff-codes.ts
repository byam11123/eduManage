import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function generateId(type: string) {
    const now = new Date()
    const fullYear = now.getFullYear()
    const shortYear = Number(fullYear.toString().slice(-2))

    const counterKey = `${type}_${fullYear}`

    const counter = await prisma.counter.upsert({
        where: { key: counterKey },
        update: { value: { increment: 1 } },
        create: { key: counterKey, value: 1 }
    })

    const sequence = counter.value
    let displayId = `STF/${shortYear}/${sequence.toString().padStart(5, '0')}`
    
    return displayId
}

async function main() {
    console.log('Starting staff code repair...')
    const userBranches = await prisma.userBranch.findMany({
        where: {
            OR: [
                { employeeCode: null },
                { employeeCode: '' },
                { employeeCode: 'N/A' }
            ]
        },
        include: { user: true }
    })

    console.log(`Found ${userBranches.length} staff members with missing or invalid codes.`)

    for (const ub of userBranches) {
        const newCode = await generateId('STAFF')
        await prisma.userBranch.update({
            where: { id: ub.id },
            data: { employeeCode: newCode }
        })
        console.log(`✅ Assigned ${newCode} to ${ub.user.fullName} (${ub.user.email})`)
    }

    console.log('\n--- Repair Complete ---')
}

main()
    .catch((e) => {
        console.error('❌ Error during repair:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
