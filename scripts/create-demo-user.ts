import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth-utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌟 Creating demo user for development...')

  const demoEmail = 'demo@coaching.com'
  const demoPassword = 'Demo123!@#'

  // Check if demo user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  })

  if (existingUser) {
    console.log('✅ Demo user already exists')
    console.log('\n📋 Demo Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', demoEmail)
    console.log('🔑 Password:', demoPassword)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🚀 Use these credentials to login at: /')
    return
  }

  // Create demo user
  const hashedPassword = await hashPassword(demoPassword)

  const demoUser = await prisma.user.create({
    data: {
      email: demoEmail,
      fullName: 'Demo Coaching Center',
      password: hashedPassword,
      isVerified: true, // Pre-verified for easy login
      emailVerified: new Date(),
    },
  })

  console.log('✅ Demo user created successfully!')
  console.log('\n📋 Demo Credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Email:', demoEmail)
  console.log('🔑 Password:', demoPassword)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n🚀 Use these credentials to login at: /')
  console.log('\n✨ User Details:')
  console.log('   • Full Name:', demoUser.fullName)
  console.log('   • Email Verified:', demoUser.isVerified)
  console.log('   • Account Created:', demoUser.createdAt.toLocaleString())
}

main()
  .catch((e) => {
    console.error('❌ Error creating demo user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
