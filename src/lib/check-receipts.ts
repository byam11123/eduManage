
import { PrismaClient } from './prisma'

async function checkReceipts() {
    const prisma = new PrismaClient()
    try {
        const maxReceipt = await prisma.receipt.findFirst({
            orderBy: { receiptSequence: 'desc' }
        })
        console.log('Max Receipt:', maxReceipt)

        const counter = await prisma.counter.findUnique({
            where: { key: `RECEIPT_${new Date().getFullYear()}` }
        })
        console.log('Current Counter:', counter)
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

checkReceipts()
