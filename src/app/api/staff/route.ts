import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'
import { hashPassword } from '@/lib/auth-utils'
import { generateId } from '@/lib/utils/id-generator'

export async function GET(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        const payload = await verifyToken(token)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''

        // Get all users who have a relation to the branches the current user has access to
        const staff = await db.user.findMany({
            where: {
                userBranches: {
                    some: {
                        branch: { organizationId: payload.organizationId },
                        branchId: payload.role === 'super_admin' ? undefined : { in: payload.branches }
                    }
                },
                OR: search ? [
                    { fullName: { contains: search } },
                    { email: { contains: search } },
                    { phone: { contains: search } },
                    { userBranches: { some: { employeeCode: { contains: search } } } }
                ] : undefined
            },
            include: {
                userBranches: {
                    include: {
                        branch: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Format to a flatter "Staff" object
        const formattedStaff = staff.map(u => {
            const primaryBranch = u.userBranches[0] // Simplify for list view
            return {
                id: u.id,
                firstName: u.fullName.split(' ')[0],
                lastName: u.fullName.split(' ').slice(1).join(' '),
                fullName: u.fullName,
                email: u.email,
                phone: u.phone,
                profileImage: u.image,
                status: u.status,
                employeeCode: primaryBranch?.employeeCode || 'N/A',
                designation: primaryBranch?.designation || 'Staff',
                department: primaryBranch?.department || 'General',
                dateOfJoining: primaryBranch?.joiningDate,
                salaryAmount: primaryBranch?.salaryAmount,
                salaryType: primaryBranch?.salaryType,
                branchName: primaryBranch?.branch?.name
            }
        })

        return NextResponse.json({
            success: true,
            data: formattedStaff,
            total: formattedStaff.length
        })

    } catch (error) {
        console.error('[API /staff] GET Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        const payload = await verifyToken(token)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { 
            email, firstName, lastName, fullName: bodyFullName, password, phone, address, 
            branchId, role, employeeCode, designation, department, joiningDate, salaryType, salaryAmount,
            fathersName, fathersPhone, gender, dateOfBirth,
            hsSchoolName, hsBoard, hsPassingYear, hsPercentage,
            hssSchoolName, hssBoard, hssStream, hssPassingYear, hssPercentage,
            gradCollegeName, gradUniversity, gradDegree, gradPassingYear, gradPercentage,
            pgCollegeName, pgUniversity, pgDegree, pgPassingYear, pgPercentage,
            experienceYears, skills, referredBy,
            bankName, accountNumber, ifscCode
        } = body

        const fullName = bodyFullName || `${firstName} ${lastName}`.trim()

        // 1. Generate Employee Code if not provided
        let finalEmployeeCode = employeeCode
        if (!finalEmployeeCode && body.status !== 'draft') {
            const idData = await generateId('STAFF')
            finalEmployeeCode = idData.displayId
        }

        // 0. Verify branch belongs to organization
        const targetBranchId = branchId || payload.branches[0]
        const branch = await db.branch.findFirst({
            where: { id: targetBranchId, organizationId: payload.organizationId }
        })

        if (!branch) {
            return NextResponse.json({ success: false, error: 'Invalid branch for your organization' }, { status: 403 })
        }

        // 1. Check if user exists
        const existingUser = await db.user.findUnique({ where: { email } })
        if (existingUser) return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 })

        // 2. Create User
        const hashedPassword = await hashPassword(password || 'EduManage123!')
        const newUser = await db.user.create({
            data: {
                email,
                fullName,
                password: hashedPassword,
                phone,
                address,
                status: body.status || 'active',
                fathersName,
                fathersPhone,
                gender,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                highestQualification: body.highestQualification,
                hsSchoolName,
                hsBoard,
                hsPassingYear,
                hsPercentage,
                hssSchoolName,
                hssBoard,
                hssStream,
                hssPassingYear,
                hssPercentage,
                gradCollegeName,
                gradUniversity,
                gradDegree,
                gradPassingYear,
                gradPercentage,
                pgCollegeName,
                pgUniversity,
                pgDegree,
                pgPassingYear,
                pgPercentage,
                experienceYears: Number(experienceYears) || 0,
                skills,
                referredBy,
                bankName,
                accountNumber,
                ifscCode
            }
        })

        // 3. Create UserBranch link (Staff profile)
        await db.userBranch.create({
            data: {
                userId: newUser.id,
                branchId: targetBranchId,
                role: role || 'user',
                employeeCode: finalEmployeeCode,
                designation: designation || 'Staff',
                department,
                joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
                salaryType,
                salaryAmount: Number(salaryAmount) || 0,
                isActive: body.status === 'draft' ? false : true
            }
        })

        return NextResponse.json({
            success: true,
            message: body.status === 'draft' ? 'Staff saved as draft' : 'Staff created successfully',
            data: newUser
        })

    } catch (error) {
        console.error('[API /staff] POST Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
