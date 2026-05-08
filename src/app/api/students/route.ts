import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateId } from '@/lib/utils/id-generator'
import { extractToken, verifyToken } from '@/lib/auth-utils'

/**
 * Students API with branch-level access control
 * - Super Admin: Can see ALL students across ALL branches
 * - Branch Users: Can ONLY see students in their assigned branches
 */

export async function GET(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No session found' },
                { status: 401 }
            )
        }

        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const branchId = searchParams.get('branchId')
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        // Build the where clause based on user organization
        if (!payload.organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        let whereClause: Record<string, any> = {
            branch: { organizationId: payload.organizationId }
        }

        // Branch-level access control for non-super_admins
        if (payload.role !== 'super_admin') {
            if (branchId) {
                // Verify user has access to the requested branch
                if (!payload.branches.includes(branchId)) {
                    return NextResponse.json(
                        { success: false, error: 'Access denied to this branch' },
                        { status: 403 }
                    )
                }
                whereClause.branchId = branchId
            } else {
                // No specific branch requested, show students from all user's branches
                whereClause.branchId = { in: payload.branches }
            }
        } else if (branchId) {
            // Super admin can filter by branch if they want
            whereClause.branchId = branchId
        }

        // Optional filters
        if (status) {
            whereClause.status = status
        }

        if (search) {
            whereClause.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
                { phone: { contains: search } }
            ]
        }

        const students = await db.student.findMany({
            where: whereClause,
            include: {
                branch: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        console.log(`[API /students] User ${payload.email} (${payload.role}) fetched ${students.length} students`)

        return NextResponse.json({
            success: true,
            students,
            meta: {
                total: students.length,
                userRole: payload.role,
                userBranches: payload.branches
            }
        })
    } catch (error) {
        console.error('[API /students GET] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No session found' },
                { status: 401 }
            )
        }

        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            firstName, lastName, email, phone, dateOfBirth, gender,
            address, city, state, country, zipCode, branchId, notes,
            fathersName, fathersPhone, enrollmentNo,
            mothersName, category, maritalStatus,
            aadhaarNumber, alternatePhone, addressLine1, addressLine2, district,
            imageUrl, schoolCollege, referredBy, enrollmentDate,
            // Qualifications
            highestQualification,
            hsSchoolName, hsBoard, hsPassingYear, hsPercentage,
            hssSchoolName, hssBoard, hssStream, hssPassingYear, hssPercentage,
            gradCollegeName, gradUniversity, gradDegree, gradPassingYear, gradPercentage,
            pgCollegeName, pgUniversity, pgDegree, pgPassingYear, pgPercentage,
            // Financials
            totalAmount, discountAmount, netPayableFee, isPartPayment,
            installmentPlan, installmentMode, fullPayment, receivedBy, courseId, batchId
        } = body

        // Validation
        if (!firstName || !lastName) {
            return NextResponse.json(
                { success: false, error: 'First name and last name are required' },
                { status: 400 }
            )
        }

        if (!branchId) {
            return NextResponse.json(
                { success: false, error: 'Branch ID is required' },
                { status: 400 }
            )
        }

        // CRITICAL: Verify user has access to the target branch
        if (payload.role !== 'super_admin' && !payload.branches.includes(branchId)) {
            return NextResponse.json(
                { success: false, error: 'You cannot add students to this branch' },
                { status: 403 }
            )
        }

        // Verify the branch exists
        const branch = await db.branch.findUnique({ where: { id: branchId } })
        if (!branch) {
            return NextResponse.json(
                { success: false, error: 'Branch not found' },
                { status: 404 }
            )
        }

        // 1. Determine Action (Draft vs Submit)
        const action = body.action || 'submit' // 'draft' | 'submit'

        // 2. Conditional Validation
        if (action === 'submit') {
            if (!body.firstName || !body.branchId || !body.courseId) {
                return NextResponse.json(
                    { success: false, error: 'Missing required fields for final submission (Name, Branch, Course)' },
                    { status: 400 }
                )
            }
        } else {
            // Draft: Minimal validation
            if (!body.firstName) {
                return NextResponse.json(
                    { success: false, error: 'First Name is required' },
                    { status: 400 }
                )
            }
        }

        // 3. Generate IDs
        // Always generate Admission ID for tracking
        const admissionIdData = await generateId('ADMISSION')
        let studentIdData: any | null = null
        let studentStatus = 'draft'

        if (action === 'submit') {
            // Generate Student ID only on finalize
            studentIdData = await generateId('STUDENT')
            studentStatus = 'active'
        }

        // Pre-process Installments for Relational Create
        let installmentsData: any[] = []
        if (body.installmentPlan) {
            let plan = body.installmentPlan
            if (typeof plan === 'string') {
                try { plan = JSON.parse(plan) } catch (e) { plan = [] }
            }
            if (Array.isArray(plan)) {
                installmentsData = plan
            }
        }

        // 4. Create Record
        const student = await db.student.create({
            data: {
                // IDs
                admissionDisplayId: admissionIdData.displayId,
                admissionYear: admissionIdData.year,
                admissionSequence: admissionIdData.sequence,

                studentDisplayId: studentIdData?.displayId || null,
                studentYear: studentIdData?.year || null,
                studentSequence: studentIdData?.sequence || null,

                status: studentStatus,
                enrollmentDate: new Date(),

                // Relations
                branchId: body.branchId,
                courseId: body.courseId,
                batchId: body.batchId || null,

                // New Multi-Course Architecture: Create StudentCourse + Installments
                studentCourses: body.courseId ? {
                    create: {
                        courseId: body.courseId,
                        status: 'ongoing',
                        totalFee: Number(body.totalAmount) || 0,
                        discountAmount: Number(body.discountAmount) || 0,
                        netPayable: Number(body.netPayableFee) || 0,
                        batches: body.batchId ? {
                            create: { batchId: body.batchId }
                        } : undefined,
                        installments: {
                            create: installmentsData.map((item: any) => ({
                                installmentNo: Number(item.installmentNo),
                                dueDate: item.dueDate ? new Date(item.dueDate) : new Date(),
                                amount: Number(item.amount) || 0,
                                paidAmount: Number(item.paidAmount) || 0,
                                status: item.status || (Number(item.paidAmount) >= Number(item.amount) ? 'paid' : 'pending'),
                                mode: item.mode || null,
                                receiptNo: item.receiptNo || null,
                                remarks: item.remark || null,
                                paidDate: item.paymentDate ? new Date(item.paymentDate) : (Number(item.paidAmount) > 0 ? new Date() : null)
                            }))
                        }
                    }
                } : undefined,

                // Basic Info
                firstName: body.firstName,
                lastName: body.lastName || '',
                email: body.email,
                phone: body.phone,
                dateOfBirth: (body.dateOfBirth && body.dateOfBirth !== '') ? new Date(body.dateOfBirth) : null,
                gender: body.gender,

                // Address
                address: body.address,
                city: body.city,
                state: body.state,
                country: body.country,
                zipCode: body.zipCode,
                addressLine1: body.addressLine1,
                addressLine2: body.addressLine2,
                district: body.district,

                // Detailed Info
                fathersName: body.fathersName,
                fathersPhone: body.fathersPhone,
                mothersName: body.mothersName,
                category: body.category,
                maritalStatus: body.maritalStatus,
                aadhaarNumber: body.aadhaarNumber,
                alternatePhone: body.alternatePhone,
                imageUrl: body.imageUrl,
                schoolCollege: body.schoolCollege,
                referredBy: body.referredBy,
                notes: body.notes,

                // Qualifications
                highestQualification: body.highestQualification,
                hsSchoolName: body.hsSchoolName,
                hsBoard: body.hsBoard,
                hsPassingYear: body.hsPassingYear,
                hsPercentage: body.hsPercentage,
                hssSchoolName: body.hssSchoolName,
                hssBoard: body.hssBoard,
                hssStream: body.hssStream,
                hssPassingYear: body.hssPassingYear,
                hssPercentage: body.hssPercentage,
                gradCollegeName: body.gradCollegeName,
                gradUniversity: body.gradUniversity,
                gradDegree: body.gradDegree,
                gradPassingYear: body.gradPassingYear,
                gradPercentage: body.gradPercentage,
                pgCollegeName: body.pgCollegeName,
                pgUniversity: body.pgUniversity,
                pgDegree: body.pgDegree,
                pgPassingYear: body.pgPassingYear,
                pgPercentage: body.pgPercentage,

                // Financials (Legacy)
                totalAmount: Number(body.totalAmount) || 0,
                discountAmount: Number(body.discountAmount) || 0,
                netPayableFee: Number(body.netPayableFee) || 0,
                isPartPayment: body.isPartPayment === 'true' || body.isPartPayment === true,
                installmentPlan: body.installmentPlan ? (typeof body.installmentPlan === 'string' ? body.installmentPlan : JSON.stringify(body.installmentPlan)) : null,
                receivedBy: body.receivedBy
            }
        })

        console.log(`[API /students POST] User ${payload.email} created student ${student.id} in branch ${branchId}`)

        return NextResponse.json({
            success: true,
            message: 'Student created successfully',
            student
        })
    } catch (error) {
        console.error('[API /students POST] Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
