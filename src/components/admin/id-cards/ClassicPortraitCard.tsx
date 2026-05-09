// Classic Portrait ID Card Template
import type { Student } from '@/lib/types'
import type { CardFields } from '@/app/admin/id-cards/page'
import { getUserInitials } from '@/lib/utils'

interface Props { student: Student; orgName: string; fields: CardFields }

export function ClassicPortraitCard({ student, orgName, fields }: Props) {
    const course = student.studentCourses?.[0]?.course?.name || student.course?.name || ''
    const batch = student.studentCourses?.[0]?.batches?.[0]?.batch?.name || student.batch?.name || ''
    const sid = student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'
    const dob = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : ''

    return (
        <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ width: 220, height: 340, fontFamily: 'Inter, sans-serif', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}
        >
            {/* Top bar */}
            <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', padding: '16px 12px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <span style={{ color: '#fff', fontWeight: 900, fontSize: 12 }}>🎓</span>
                </div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 10, letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.2 }}>{orgName}</div>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Photo */}
                {fields.showPhoto && (
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ width: 80, height: 96, borderRadius: 12, overflow: 'hidden', border: '3px solid #4f46e5', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {student.imageUrl
                                ? <img src={student.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontWeight: 900, fontSize: 24, color: '#4f46e5' }}>{getUserInitials(`${student.firstName} ${student.lastName}`)}</span>
                            }
                        </div>
                    </div>
                )}

                {/* Name */}
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                    <div style={{ fontWeight: 900, fontSize: 13, color: '#111827', letterSpacing: '-0.01em', marginBottom: 2 }}>
                        {student.firstName} {student.lastName}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 8, color: '#4f46e5', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{sid}</div>
                </div>

                {/* Info Grid */}
                <div style={{ width: '100%', spaceY: 6 }}>
                    {fields.showCourse && course && (
                        <div style={{ marginBottom: 6 }}>
                            <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course</div>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course}</div>
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {fields.showBatch && batch && (
                            <div>
                                <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>Batch</div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#374151' }}>{batch}</div>
                            </div>
                        )}
                        {fields.showDOB && dob && (
                            <div>
                                <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>DOB</div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#374151' }}>{dob}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* QR */}
                {fields.showQR && (
                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 44, height: 44, border: '1.5px solid #e5e7eb', borderRadius: 6, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 1, padding: 3, background: '#f9fafb' }}>
                            {Array.from({ length: 25 }).map((_, i) => (
                                <div key={i} style={{ background: [0,1,2,5,6,10,12,14,18,19,20,22,24].includes(i) ? '#111827' : 'transparent', borderRadius: 1 }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{ background: '#f3f4f6', padding: '8px 12px', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {student.branch?.name || ''}
                </div>
            </div>
        </div>
    )
}
