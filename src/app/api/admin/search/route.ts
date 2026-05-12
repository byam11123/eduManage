import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAuth(request)
        if (!auth.success || !auth.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q') || ''

        console.log(`[Global Search] Query: "${query}" | Org: ${auth.organizationId}`)

        if (!query || query.length < 2) {
            return NextResponse.json({ 
                success: true, 
                results: { students: [], courses: [], enquiries: [], staff: [] } 
            })
        }

        const organizationId = auth.organizationId
        if (!organizationId) {
            return NextResponse.json({ success: false, error: 'Organization context missing' }, { status: 400 })
        }

        // Search Students
        const students = await db.student.findMany({
            where: {
                branch: { organizationId },
                OR: [
                    { firstName: { contains: query } },
                    { lastName: { contains: query } },
                    { email: { contains: query } },
                    { phone: { contains: query } },
                    { admissionDisplayId: { contains: query } },
                    { studentDisplayId: { contains: query } }
                ]
            },
            take: 5,
            select: { 
                id: true, 
                firstName: true, 
                lastName: true, 
                email: true, 
                studentDisplayId: true, 
                admissionDisplayId: true 
            }
        })

        // Search Courses
        const courses = await db.course.findMany({
            where: {
                organizationId,
                OR: [
                    { name: { contains: query } }
                ]
            },
            take: 5,
            select: { id: true, name: true }
        })

        // Search Enquiries
        const enquiries = await db.enquiry.findMany({
            where: {
                organizationId,
                OR: [
                    { firstName: { contains: query } },
                    { lastName: { contains: query } },
                    { mobile: { contains: query } },
                    { email: { contains: query } },
                    { enquiryId: { contains: query } }
                ]
            },
            take: 5,
            select: { 
                id: true, 
                firstName: true, 
                lastName: true, 
                mobile: true, 
                enquiryId: true 
            }
        })

        // Search Staff
        const staff = await db.user.findMany({
            where: {
                userBranches: {
                    some: {
                        branch: { organizationId }
                    }
                },
                OR: [
                    { fullName: { contains: query } },
                    { email: { contains: query } },
                    { phone: { contains: query } }
                ]
            },
            take: 5,
            select: { id: true, fullName: true, email: true, image: true }
        })

        console.log(`[Global Search] Results - Students: ${students.length}, Courses: ${courses.length}, Enquiries: ${enquiries.length}, Staff: ${staff.length}`)

        return NextResponse.json({
            success: true,
            results: {
                students: students.map(s => ({ 
                    id: s.id, 
                    title: `${s.firstName} ${s.lastName}`, 
                    subtitle: s.studentDisplayId || s.admissionDisplayId || s.email || 'Student',
                    type: 'student',
                    href: `/admin/students/${s.id}`
                })),
                courses: courses.map(c => ({ 
                    id: c.id, 
                    title: c.name, 
                    subtitle: 'Course',
                    type: 'course',
                    href: `/admin/courses`
                })),
                enquiries: enquiries.map(e => ({ 
                    id: e.id, 
                    title: `${e.firstName} ${e.lastName}`, 
                    subtitle: e.enquiryId || e.mobile || 'Enquiry',
                    type: 'enquiry',
                    href: `/admin/enquiries`
                })),
                staff: staff.map(s => ({ 
                    id: s.id, 
                    title: s.fullName, 
                    subtitle: s.email || 'Staff',
                    type: 'staff',
                    href: `/admin/staff`
                }))
            }
        })

    } catch (error) {
        console.error('Global Search Error:', error)
        return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 })
    }
}
