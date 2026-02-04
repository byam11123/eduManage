import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:/home/z/my-project/db/custom.db',
    },
  },
})

async function checkDemo() {
  console.log('🔍 Checking demo user...')
  
  const user = await prisma.user.findUnique({
    where: { email: 'demo@coaching.com' },
  })
  
  if (!user) {
    console.log('❌ User not found!')
    await prisma.$disconnect()
    return
  }
  
  console.log('✅ User found:')
  console.log('  Email:', user.email)
  console.log('  Password hash:', user.password.substring(0, 50) + '...')
  console.log('  isVerified:', user.isVerified)
  
  // Test password verification
  const testPassword = 'Demo123!@#'
  console.log('\n🧪 Testing password verification...')
  console.log('  Test password:', testPassword)
  const isValid = await bcrypt.compare(testPassword, user.password)
  console.log('  Password valid:', isValid)
  
  if (!isValid) {
    console.log('\n❌ Password verification FAILED!')
    console.log('  You may need to recreate the demo user')
    console.log('  Run: bun run demo')
  }
  
  await prisma.$disconnect()
}

checkDemo().catch(console.error)
