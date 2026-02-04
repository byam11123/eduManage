import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:/home/z/my-project/db/custom.db',
    },
  },
})

async function checkAllUsers() {
  console.log('🔍 Checking all users in database...\n')
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      isVerified: true,
      createdAt: true,
      password: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
  
  console.log(`👥 Total users: ${users.length}\n`)
  
  if (users.length === 0) {
    console.log('❌ No users found!')
  } else {
    users.forEach((user, index) => {
      console.log(`\n━━━━━━━━━━━━ User ${index + 1} ━━━━━━━━━━━━`)
      console.log(`📧 Email: ${user.email}`)
      console.log(`👤 Name: ${user.fullName}`)
      console.log(`✅ Verified: ${user.isVerified}`)
      console.log(`📅 Created: ${user.createdAt}`)
      
      // Test password hash length
      console.log(`🔑 Password Hash Length: ${user.password.length} chars`)
    })
  }
  
  // Check specifically for demo user
  console.log('\n🔍 Looking for demo user specifically...')
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@coaching.com' },
  })
  
  if (demoUser) {
    console.log('✅ Demo user found!')
    console.log(`📧 Email: ${demoUser.email}`)
    console.log(`🔑 Password Hash: ${demoUser.password.substring(0, 50)}...`)
    
    // Try to verify the password
    const testPassword = 'Demo123!@#'
    console.log(`\n🧪 Testing password: "${testPassword}"`)
    console.log('   Length:', testPassword.length)
    console.log('   Has special chars:', /[@$!%*?&]/.test(testPassword))
    console.log('   Has uppercase:', /[A-Z]/.test(testPassword))
    console.log('   Has lowercase:', /[a-z]/.test(testPassword))
    console.log('   Has number:', /[0-9]/.test(testPassword))
    
    const isValid = await bcrypt.compare(testPassword, demoUser.password)
    console.log(`   Password Valid: ${isValid}`)
    
    if (!isValid) {
      console.log('\n❌ PASSWORD VERIFICATION FAILED!')
      console.log('   This could mean:')
      console.log('   1. Password was changed after demo user was created')
      console.log('   2. Bcrypt version mismatch')
      console.log('   3. Character encoding issue')
    }
  } else {
    console.log('\n✅ Password verification PASSED!')
  }
  
  await prisma.$disconnect()
}

checkAllUsers().catch(console.error)
