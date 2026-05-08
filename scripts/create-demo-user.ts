import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth-utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌟 Initializing EduManage Demo Environment with Upgraded User Management...')

  const demoEmail = 'demo@coaching.com'
  const demoPassword = 'Demo123!@#'

  // 1. Clean up existing demo data
  console.log('🧹 Cleaning up old demo data...')
  const existingUser = await prisma.user.findUnique({ where: { email: demoEmail } })
  const managerUser = await prisma.user.findUnique({ where: { email: 'manager@edumanage.com' } })
  
  // Cleanup helper
  const cleanUser = async (uId: string) => {
    await prisma.installment.deleteMany({ where: { studentCourse: { student: { branch: { organization: { ownerId: uId } } } } } })
    await prisma.studentCourseBatch.deleteMany({ where: { studentCourse: { student: { branch: { organization: { ownerId: uId } } } } } })
    await prisma.studentCourse.deleteMany({ where: { student: { branch: { organization: { ownerId: uId } } } } })
    await prisma.receipt.deleteMany({ where: { student: { branch: { organization: { ownerId: uId } } } } })
    await prisma.student.deleteMany({ where: { branch: { organization: { ownerId: uId } } } })
    await prisma.batch.deleteMany({ where: { course: { organization: { ownerId: uId } } } })
    await prisma.course.deleteMany({ where: { organization: { ownerId: uId } } })
    await prisma.enquiry.deleteMany({ where: { branch: { organization: { ownerId: uId } } } })
    await prisma.modulePermission.deleteMany({ where: { userId: uId } })
    await prisma.userBranch.deleteMany({ where: { userId: uId } })
    await prisma.organizationMember.deleteMany({ where: { userId: uId } })
    await prisma.organization.deleteMany({ where: { ownerId: uId } })
    await prisma.user.delete({ where: { id: uId } })
  }

  if (existingUser) await cleanUser(existingUser.id)
  if (managerUser) await cleanUser(managerUser.id)

  // 2. Create the Super Admin User
  console.log('👤 Creating Super Admin user...')
  const hashedPassword = await hashPassword(demoPassword)
  const user = await prisma.user.create({
    data: {
      email: demoEmail,
      fullName: 'Demo Administrator',
      password: hashedPassword,
      phone: '9876543210',
      status: 'active',
      address: 'Admin Suites, Knowledge Park',
      isVerified: true,
      emailVerified: new Date(),
    },
  })

  // 3. Create a Default Organization
  console.log('🏢 Creating organization and branches...')
  const organization = await prisma.organization.create({
    data: {
      name: 'EduManage Academy',
      slug: 'edumanage-academy-' + Math.random().toString(36).substring(7),
      ownerId: user.id,
      industry: 'Skill Development',
      size: '10-50',
      email: demoEmail,
      branches: {
        create: [
          { name: 'Head Office (Main)', city: 'Knowledge Park', isActive: true, email: 'ho@edumanage.com' },
          { name: 'Branch East', city: 'Sunrise Valley', isActive: true, email: 'east@edumanage.com' }
        ]
      }
    },
    include: {
      branches: true
    }
  })

  const mainBranch = organization.branches.find(b => b.name.includes('Head'))!
  const eastBranch = organization.branches.find(b => b.name.includes('East'))!

  // 4. Assign Roles & Permissions
  console.log('🔐 Assigning roles and RBAC permissions...')
  
  // Super Admin Permissions (Full Access)
  const allModules = [
    'dashboard', 'enquiry', 'leads', 'students', 'fees', 'batches', 
    'attendance', 'courses', 'branches', 'staff', 'timetable', 
    'chat', 'notice', 'tickets', 'forms', 'expenses', 'certificate', 'settings'
  ]

  await prisma.modulePermission.createMany({
    data: allModules.map(m => ({
      userId: user.id,
      organizationId: organization.id,
      module: m,
      canAccess: true
    }))
  })

  await prisma.userBranch.create({
    data: {
      userId: user.id,
      branchId: mainBranch.id,
      role: 'super_admin',
      isDefault: true,
      employeeCode: 'ADMIN-001',
      designation: 'Managing Director',
      department: 'Management',
      joiningDate: new Date(),
      salaryType: 'fixed',
      salaryAmount: 150000,
      isActive: true,
    }
  })

  // Create Branch Manager with LIMITED Permissions
  const managerPassword = await hashPassword('Manager123!@#')
  const manager = await prisma.user.create({
    data: {
      email: 'manager@edumanage.com',
      fullName: 'Branch Manager',
      password: managerPassword,
      phone: '8887776665',
      status: 'active',
      address: 'Sunrise Valley Apts',
    }
  })

  const managerModules = ['dashboard', 'enquiry', 'students', 'fees', 'attendance', 'batches']
  await prisma.modulePermission.createMany({
    data: managerModules.map(m => ({
      userId: manager.id,
      organizationId: organization.id,
      module: m,
      canAccess: true
    }))
  })

  await prisma.userBranch.create({
    data: {
      userId: manager.id,
      branchId: eastBranch.id,
      role: 'branch_admin',
      isDefault: true,
      employeeCode: 'STAFF-102',
      designation: 'Operations Manager',
      department: 'Operations',
      joiningDate: new Date(),
      salaryType: 'monthly',
      salaryAmount: 65000,
      isActive: true,
    }
  })

  // 5. Seed Courses & Batches
  console.log('📚 Seeding courses and batches...')
  const webCourse = await prisma.course.create({
    data: {
      name: 'Full Stack Web Development',
      description: 'Master MERN stack development',
      durationMonths: 6,
      fee: 45000,
      organizationId: organization.id,
      status: 'active'
    }
  })

  await prisma.batch.create({
    data: {
      name: 'Morning Warriors',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      courseId: webCourse.id,
      status: 'active'
    }
  })

  // 6. Seed Students & Installments
  console.log('🎓 Seeding students and financials...')
  const studentsData = [
    { firstName: 'Rahul', lastName: 'Sharma', email: 'rahul@example.com', branchId: mainBranch.id },
    { firstName: 'Priya', lastName: 'Verma', email: 'priya@example.com', branchId: mainBranch.id },
  ]

  for (const s of studentsData) {
    await prisma.student.create({
      data: {
        ...s,
        phone: '9876543210',
        status: 'active',
        enrollmentDate: new Date(),
        branchId: s.branchId,
        studentCourses: {
          create: {
            courseId: webCourse.id,
            status: 'ongoing',
            totalFee: 45000,
            netPayable: 40000,
            installments: {
              create: [
                { installmentNo: 1, amount: 20000, dueDate: new Date(), paidAmount: 20000, status: 'paid', paidDate: new Date() },
                { installmentNo: 2, amount: 20000, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), paidAmount: 0, status: 'pending' }
              ]
            }
          }
        }
      }
    })
  }

  console.log('\n✅ Demo environment fully seeded with UPGRADED User Management & RBAC!')
  console.log('🚀 Admin (Full Access): demo@coaching.com / Demo123!@#')
  console.log('🚀 Manager (Limited Access): manager@edumanage.com / Manager123!@#')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
