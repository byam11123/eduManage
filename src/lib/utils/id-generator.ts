
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Generates a new ID based on the entity type, year, and sequence.
 * Uses atomic counters to guarantee uniqueness.
 */
export async function generateId(
    type: 'ENQUIRY' | 'ADMISSION' | 'STUDENT' | 'RECEIPT',
    instituteCode: string = 'OCI'
): Promise<{ displayId: string; year: number; sequence: number }> {
    const now = new Date()
    const fullYear = now.getFullYear() // 2026
    const shortYear = Number(fullYear.toString().slice(-2)) // 26

    // Construct Counter Key: e.g., STUDENT_OCI_2026, ADMISSION_2026
    let counterKey = ''
    if (type === 'STUDENT') {
        counterKey = `STUDENT_${instituteCode}_${fullYear}`
    } else {
        counterKey = `${type}_${fullYear}`
    }

    // Atomic Increment
    const counter = await prisma.counter.upsert({
        where: { key: counterKey },
        update: { value: { increment: 1 } },
        create: { key: counterKey, value: 1 }
    })

    const sequence = counter.value

    let displayId = ''
    // Format Display ID
    if (type === 'ENQUIRY') {
        // ENQ/26/00045
        displayId = `ENQ/${shortYear}/${sequence.toString().padStart(5, '0')}`
    } else if (type === 'ADMISSION') {
        // ADM/26/00112
        displayId = `ADM/${shortYear}/${sequence.toString().padStart(5, '0')}`
    } else if (type === 'STUDENT') {
        // OCI/26/0003
        displayId = `${instituteCode}/${shortYear}/${sequence.toString().padStart(4, '0')}`
    } else if (type === 'RECEIPT') {
        // RCP/26/000123
        displayId = `RCP/${shortYear}/${sequence.toString().padStart(6, '0')}`
    }

    return {
        displayId,
        year: fullYear,
        sequence
    }
}
