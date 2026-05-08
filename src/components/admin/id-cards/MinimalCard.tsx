// Minimal ID Card Template — Clean white with colored accent border
import type { Student } from '@/lib/types'
import type { CardFields } from '@/app/admin/id-cards/page'
import { getUserInitials } from '@/lib/utils'

interface Props { student: Student; orgName: string; fields: CardFields }

export function MinimalCard({ student, orgName, fields }: Props) {
    const course = student.studentCourses?.[0]?.course?.name || student.course?.name || ''
    const batch = student.studentCourses?.[0]?.batches?.[0]?.batch?.name || student.batch?.name || ''
    const sid = student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'
    const dob = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : ''

    const statusColor = student.status === 'active' ? '#10b981' : student.status === 'dropped' ? '#ef4444' : '#6b7280'

    return (
        <div
            style={{
                width: 340, height: 210, borderRadius: 20, overflow: 'hidden',
                fontFamily: 'Inter, sans-serif', background: '#ffffff',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                border: '1.5px solid #e5e7eb',
                position: 'relative'
            }}
        >
            {/* Left accent bar */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)' }} />

            {/* Content */}
            <div style={{ paddingLeft: 20, paddingRight: 18, paddingTop: 16, paddingBottom: 14, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                        <div style={{ fontWeight: 900, fontSize: 11, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{orgName}</div>
                        <div style={{ fontSize: 8, fontWeight: 700, color: '#6366f1', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 1 }}>Student ID Card</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} />
                        <span style={{ fontSize: 8, fontWeight: 700, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{student.status}</span>
                    </div>
                </div>

                {/* Thin divider */}
                <div style={{ height: 1, background: '#f3f4f6', marginBottom: 12 }} />

                {/* Main content */}
                <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                    {/* Photo */}
                    {fields.showPhoto && (
                        <div style={{ flexShrink: 0 }}>
                            <div style={{
                                width: 68, height: 82, borderRadius: 14, overflow: 'hidden',
                                border: '2px solid #6366f1',
                                background: '#eef2ff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {student.imageUrl
                                    ? <img src={student.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ fontWeight: 900, fontSize: 24, color: '#6366f1' }}>{getUserInitials(`${student.firstName} ${student.lastName}`)}</span>
                                }
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontWeight: 900, fontSize: 15, color: '#111827', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {student.firstName} {student.lastName}
                        </div>
                        <div style={{
                            display: 'inline-block', marginTop: 3, marginBottom: 10,
                            fontSize: 8, fontWeight: 800, color: '#6366f1',
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            borderBottom: '1px solid #e0e7ff', paddingBottom: 6
                        }}>
                            {sid}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                            {fields.showCourse && course && (
                                <div>
                                    <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Course</div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course}</div>
                                </div>
                            )}
                            {fields.showBatch && batch && (
                                <div>
                                    <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Batch</div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#374151' }}>{batch}</div>
                                </div>
                            )}
                            {fields.showDOB && dob && (
                                <div>
                                    <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DOB</div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#374151' }}>{dob}</div>
                                </div>
                            )}
                            {fields.showPhone && student.phone && (
                                <div>
                                    <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phone</div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#374151' }}>{student.phone}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* QR */}
                    {fields.showQR && (
                        <div style={{ flexShrink: 0, alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{
                                width: 52, height: 52, border: '1.5px solid #e5e7eb',
                                borderRadius: 10, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
                                gap: 1.5, padding: 5, background: '#f9fafb'
                            }}>
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div key={i} style={{ background: [0,1,2,5,6,10,12,14,18,19,20,22,24].includes(i) ? '#6366f1' : 'transparent', borderRadius: 1 }} />
                                ))}
                            </div>
                            <span style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scan</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 7.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{student.branch?.name || ''}</span>
                    {fields.showAddress && (student.city || student.state) && (
                        <span style={{ fontSize: 7.5, fontWeight: 700, color: '#9ca3af' }}>{[student.city, student.state].filter(Boolean).join(', ')}</span>
                    )}
                    <span style={{ fontSize: 7.5, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Not Transferable</span>
                </div>
            </div>
        </div>
    )
}
