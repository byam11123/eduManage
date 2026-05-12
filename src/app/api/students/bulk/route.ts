import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateId } from '@/lib/utils/id-generator'
import { extractToken, verifyToken } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
    try {
        const token = extractToken(request)
        if (!token) {
            return NextResponse.json({ success: false, error: 'No session found' }, { status: 401 })
        }

        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
        }

        const { students, branchId, courseId, batchId } = await request.json()

        if (!students || !Array.isArray(students) || students.length === 0) {
            return NextResponse.json({ success: false, error: 'No student data provided' }, { status: 400 })
        }

        if (!branchId || !courseId) {
            return NextResponse.json({ success: false, error: 'Branch and Course are required for bulk upload' }, { status: 400 })
        }

        // Verify access
        if (payload.role !== 'super_admin' && !payload.branches.includes(branchId)) {
            return NextResponse.json({ success: false, error: 'Access denied to this branch' }, { status: 403 })
        }

        const createdStudents = []
        const errors = []

        // Process each student
        for (const studentData of students) {
            try {
                // Generate IDs
                const admissionIdData = await generateId('ADMISSION')
                const studentIdData = await generateId('STUDENT')

                const newStudent = await db.student.create({
                    data: {
                        firstName: studentData.firstName,
                        lastName: studentData.lastName || '',
                        email: studentData.email || null,
                        phone: studentData.phone?.toString() || null,
                        gender: studentData.gender || 'male',
                        dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth) : null,
                        aadhaarNumber: studentData.aadhaarNumber?.toString() || null,
                        category: studentData.category || null,
                        maritalStatus: studentData.maritalStatus || null,
                        alternatePhone: studentData.alternatePhone?.toString() || null,
                        
                        // Family
                        fathersName: studentData.fathersName || null,
                        fathersPhone: studentData.fathersPhone?.toString() || null,
                        mothersName: studentData.mothersName || null,
                        
                        // Address
                        addressLine1: studentData.addressLine1 || null,
                        addressLine2: studentData.addressLine2 || null,
                        city: studentData.city || null,
                        district: studentData.district || null,
                        state: studentData.state || null,
                        country: studentData.country || null,
                        zipCode: studentData.zipCode?.toString() || null,
                        address: [studentData.addressLine1, studentData.city, studentData.state].filter(Boolean).join(', '), // fallback combined field

                        // Academic Info
                        highestQualification: studentData.highestQualification || null,
                        hsSchoolName: studentData.hsSchoolName || null,
                        hsBoard: studentData.hsBoard || null,
                        hsPassingYear: studentData.hsPassingYear?.toString() || null,
                        hsPercentage: studentData.hsPercentage?.toString() || null,
                        hssSchoolName: studentData.hssSchoolName || null,
                        hssBoard: studentData.hssBoard || null,
                        hssStream: studentData.hssStream || null,
                        hssPassingYear: studentData.hssPassingYear?.toString() || null,
                        hssPercentage: studentData.hssPercentage?.toString() || null,
                        gradCollegeName: studentData.gradCollegeName || null,
                        gradUniversity: studentData.gradUniversity || null,
                        gradDegree: studentData.gradDegree || null,
                        gradPassingYear: studentData.gradPassingYear?.toString() || null,
                        gradPercentage: studentData.gradPercentage?.toString() || null,
                        pgCollegeName: studentData.pgCollegeName || null,
                        pgUniversity: studentData.pgUniversity || null,
                        pgDegree: studentData.pgDegree || null,
                        pgPassingYear: studentData.pgPassingYear?.toString() || null,
                        pgPercentage: studentData.pgPercentage?.toString() || null,

                        branchId,
                        courseId,
                        batchId: batchId || null,
                        status: 'active',
                        paymentStatus: 'pending',
                        
                        admissionDisplayId: admissionIdData.displayId,
                        admissionYear: admissionIdData.year,
                        admissionSequence: admissionIdData.sequence,
                        
                        studentDisplayId: studentIdData.displayId,
                        studentYear: studentIdData.year,
                        studentSequence: studentIdData.sequence,

                        // Create the default studentCourse entry
                        studentCourses: {
                            create: {
                                courseId,
                                status: 'ongoing',
                                totalFee: Number(studentData.totalFee) || 0,
                                netPayable: Number(studentData.totalFee) || 0,
                                batches: batchId ? {
                                    create: { batchId }
                                } : undefined,
                                installments: {
                                    create: [
                                        {
                                            installmentNo: 1,
                                            dueDate: new Date(),
                                            amount: Number(studentData.totalFee) || 0,
                                            paidAmount: 0,
                                            status: 'pending'
                                        }
                                    ]
                                }
                            }
                        }
                    }
                })
                createdStudents.push(newStudent)
            } catch (err: any) {
                console.error(`Bulk upload error for ${studentData.firstName}:`, err)
                errors.push({ name: studentData.firstName, error: err.message })
            }
        }

        return NextResponse.json({
            success: true,
            count: createdStudents.length,
            errors: errors.length > 0 ? errors : undefined,
            message: `Successfully uploaded ${createdStudents.length} students`
        })

    } catch (error: any) {
        console.error('[API /students/bulk POST] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
