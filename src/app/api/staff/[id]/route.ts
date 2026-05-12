import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { extractToken, verifyToken } from '@/lib/auth-utils'
import { generateId } from '@/lib/utils/id-generator'

// Helper for auth verification
async function verifyAuth(request: NextRequest) {
    const token = extractToken(request)
    if (!token) return null
    return await verifyToken(token)
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAuth(request)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const { id } = await params

        const user = await db.user.findUnique({
            where: { id },
            include: {
                userBranches: {
                    include: {
                        branch: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 })
        }

        const primaryBranch = user.userBranches[0]
        
        // Format to a flatter "Staff" object for the UI
        const staff = {
            id: user.id,
            firstName: user.fullName.split(' ')[0],
            lastName: user.fullName.split(' ').slice(1).join(' '),
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            profileImage: user.image,
            status: user.status,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            fathersName: user.fathersName,
            fathersPhone: user.fathersPhone,
            employeeCode: primaryBranch?.employeeCode || 'N/A',
            designation: primaryBranch?.designation || 'Staff',
            department: primaryBranch?.department || 'General',
            dateOfJoining: primaryBranch?.joiningDate,
            salaryAmount: primaryBranch?.salaryAmount || 0,
            salaryType: primaryBranch?.salaryType || 'fixed',
            branchName: primaryBranch?.branch?.name || 'Head Office',
            branchId: primaryBranch?.branchId,
            
            // Qualification & Experience
            highestQualification: user.highestQualification,
            experienceYears: user.experienceYears,
            skills: user.skills,
            referredBy: user.referredBy,
            
            // Academic Details
            hsSchoolName: user.hsSchoolName,
            hsBoard: user.hsBoard,
            hsPassingYear: user.hsPassingYear,
            hsPercentage: user.hsPercentage,
            hssSchoolName: user.hssSchoolName,
            hssBoard: user.hssBoard,
            hssStream: user.hssStream,
            hssPassingYear: user.hssPassingYear,
            hssPercentage: user.hssPercentage,
            gradCollegeName: user.gradCollegeName,
            gradUniversity: user.gradUniversity,
            gradDegree: user.gradDegree,
            gradPassingYear: user.gradPassingYear,
            gradPercentage: user.gradPercentage,
            pgCollegeName: user.pgCollegeName,
            pgUniversity: user.pgUniversity,
            pgDegree: user.pgDegree,
            pgPassingYear: user.pgPassingYear,
            pgPercentage: user.pgPercentage,
            
            // Banking
            bankName: user.bankName,
            accountNumber: user.accountNumber,
            ifscCode: user.ifscCode,
            
            // Document URLs
            hsMarksheetUrl: user.hsMarksheetUrl,
            hssMarksheetUrl: user.hssMarksheetUrl,
            gradDegreeUrl: user.gradDegreeUrl,
            pgDegreeUrl: user.pgDegreeUrl,
            appointmentLetterUrl: primaryBranch?.appointmentLetterUrl,
            joiningReportUrl: primaryBranch?.joiningReportUrl
        }

        return NextResponse.json({
            success: true,
            data: staff
        })

    } catch (error) {
        console.error('[API /staff/[id] GET] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAuth(request)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const { id } = await params

        // Access Control
        if (payload.role !== 'super_admin') {
             // For non-super admins, check if user belongs to their branches
             const existingUser = await db.user.findUnique({
                 where: { id },
                 include: { userBranches: { select: { branchId: true } } }
             })
             if (!existingUser) return NextResponse.json({ success: false, error: 'Staff not found' }, { status: 404 })
             
             const hasAccess = existingUser.userBranches.some(ub => payload.branches.includes(ub.branchId))
             if (!hasAccess) return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }

        // Delete User (Cascade will handle userBranches)
        await db.user.delete({ where: { id } })

        return NextResponse.json({
            success: true,
            message: 'Staff member deleted successfully'
        })

    } catch (error) {
        console.error('[API /staff/[id] DELETE] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = await verifyAuth(request)
        if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const { id } = await params
        const body = await request.json()

        // 1. Check if user exists
        const existingUser = await db.user.findUnique({
            where: { id },
            include: { userBranches: true }
        })

        if (!existingUser) {
            return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 })
        }

        // 2. Access Control
        if (payload.role !== 'super_admin') {
            const hasAccess = existingUser.userBranches.some(ub => payload.branches.includes(ub.branchId))
            if (!hasAccess) return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 })
        }

        // 3. Update Logic
        const {
            firstName,
            lastName,
            fullName,
            email,
            phone,
            address,
            gender: genderInput,
            dateOfBirth: dobInput,
            status,
            employeeCode,
            designation,
            department,
            dateOfJoining,
            salaryAmount,
            salaryType,
            branchId,
            imageUrl,
            highestQualification,
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
            experienceYears,
            skills,
            referredBy,
            bankName,
            accountNumber,
            ifscCode,
            fathersName,
            fathersPhone,
            hsMarksheetUrl,
            hssMarksheetUrl,
            gradDegreeUrl,
            pgDegreeUrl,
            appointmentLetterUrl,
            joiningReportUrl
        } = body

        // Handle auto-generation of employee code if transitioning to active
        let finalEmployeeCode = employeeCode || existingUser.userBranches[0]?.employeeCode
        if (!finalEmployeeCode && status === 'active') {
            const idData = await generateId('STAFF')
            finalEmployeeCode = idData.displayId
        }

        // Update User
        const updatedUser = await db.user.update({
            where: { id },
            data: {
                fullName: fullName || (firstName && lastName ? `${firstName} ${lastName}` : existingUser.fullName),
                email: email || existingUser.email,
                phone: phone || existingUser.phone,
                address: address || existingUser.address,
                gender: genderInput || existingUser.gender,
                dateOfBirth: dobInput ? new Date(dobInput) : existingUser.dateOfBirth,
                status: status || existingUser.status,
                image: imageUrl || existingUser.image,
                fathersName: fathersName || existingUser.fathersName,
                fathersPhone: fathersPhone || existingUser.fathersPhone,
                highestQualification: highestQualification || existingUser.highestQualification,
                hsSchoolName: hsSchoolName || existingUser.hsSchoolName,
                hsBoard: hsBoard || existingUser.hsBoard,
                hsPassingYear: hsPassingYear || existingUser.hsPassingYear,
                hsPercentage: hsPercentage || existingUser.hsPercentage,
                hssSchoolName: hssSchoolName || existingUser.hssSchoolName,
                hssBoard: hssBoard || existingUser.hssBoard,
                hssStream: hssStream || existingUser.hssStream,
                hssPassingYear: hssPassingYear || existingUser.hssPassingYear,
                hssPercentage: hssPercentage || existingUser.hssPercentage,
                gradCollegeName: gradCollegeName || existingUser.gradCollegeName,
                gradUniversity: gradUniversity || existingUser.gradUniversity,
                gradDegree: gradDegree || existingUser.gradDegree,
                gradPassingYear: gradPassingYear || existingUser.gradPassingYear,
                gradPercentage: gradPercentage || existingUser.gradPercentage,
                pgCollegeName: pgCollegeName || existingUser.pgCollegeName,
                pgUniversity: pgUniversity || existingUser.pgUniversity,
                pgDegree: pgDegree || existingUser.pgDegree,
                pgPassingYear: pgPassingYear || existingUser.pgPassingYear,
                pgPercentage: pgPercentage || existingUser.pgPercentage,
                experienceYears: experienceYears !== undefined ? Number(experienceYears) : existingUser.experienceYears,
                skills: skills || existingUser.skills,
                referredBy: referredBy || existingUser.referredBy,
                bankName: bankName || existingUser.bankName,
                accountNumber: accountNumber || existingUser.accountNumber,
                ifscCode: ifscCode || existingUser.ifscCode,
                hsMarksheetUrl: hsMarksheetUrl || existingUser.hsMarksheetUrl,
                hssMarksheetUrl: hssMarksheetUrl || existingUser.hssMarksheetUrl,
                gradDegreeUrl: gradDegreeUrl || existingUser.gradDegreeUrl,
                pgDegreeUrl: pgDegreeUrl || existingUser.pgDegreeUrl
            }
        })

        // Update UserBranch (assuming primary branch for now as per Add logic)
        if (existingUser.userBranches.length > 0) {
            const primaryBranchId = existingUser.userBranches[0].id
            await db.userBranch.update({
                where: { id: primaryBranchId },
                data: {
                    employeeCode: finalEmployeeCode,
                    designation: designation || existingUser.userBranches[0].designation,
                    department: department || existingUser.userBranches[0].department,
                    joiningDate: dateOfJoining ? new Date(dateOfJoining) : existingUser.userBranches[0].joiningDate,
                    salaryAmount: salaryAmount ? Number(salaryAmount) : existingUser.userBranches[0].salaryAmount,
                    salaryType: salaryType || existingUser.userBranches[0].salaryType,
                    branchId: branchId || existingUser.userBranches[0].branchId,
                    appointmentLetterUrl: appointmentLetterUrl || existingUser.userBranches[0].appointmentLetterUrl,
                    joiningReportUrl: joiningReportUrl || existingUser.userBranches[0].joiningReportUrl
                }
            })
        }

        return NextResponse.json({
            success: true,
            data: updatedUser
        })

    } catch (error) {
        console.error('[API /staff/[id] PATCH] Error:', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
