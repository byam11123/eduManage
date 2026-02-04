import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('Seeding database...')

    // Create a sample user first
    const user = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        fullName: 'Admin User',
        password: '$2b$10$uNcXb4J13Jb4J13Jb4Jb4OZ.P5uQj.Xb4J13Jb4J13Jb4J13Jb4J13', // 'password' hashed
      }
    })

    // Create a sample organization
    const org = await prisma.organization.create({
      data: {
        name: 'Sample Organization',
        slug: 'sample-org',
        description: 'A sample organization for testing',
        ownerId: user.id,
      }
    })

    // Create sample branches
    const branch1 = await prisma.branch.create({
      data: {
        name: 'Main Campus',
        description: 'Main campus location',
        organizationId: org.id,
      }
    })

    const branch2 = await prisma.branch.create({
      data: {
        name: 'Downtown Branch',
        description: 'Downtown branch location',
        organizationId: org.id,
      }
    })

    // Assign user to branches with super_admin role
    await prisma.userBranch.create({
      data: {
        userId: user.id,
        branchId: branch1.id,
        role: 'super_admin',
        isDefault: true,
      }
    })

    await prisma.userBranch.create({
      data: {
        userId: user.id,
        branchId: branch2.id,
        role: 'super_admin',
        isDefault: false,
      }
    })

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()