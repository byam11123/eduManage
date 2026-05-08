// Classic ID Card Template — Traditional institutional look
import type { Student } from '@/lib/types'
import type { CardFields } from '@/app/admin/id-cards/page'
import { getUserInitials } from '@/lib/utils'

interface Props { student: Student; orgName: string; fields: CardFields }

export function ClassicCard({ student, orgName, fields }: Props) {
    const course = student.studentCourses?.[0]?.course?.name || student.course?.name || ''
    const batch = student.studentCourses?.[0]?.batches?.[0]?.batch?.name || student.batch?.name || ''
    const sid = student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'
    const dob = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : ''

    return (
        <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ width: 340, height: 210, fontFamily: 'Inter, sans-serif', background: '#fff', border: '1px solid #e5e7eb' }}
        >
            {/* Top bar */}
            <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', height: 64, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>🎓</span>
                </div>
                <div>
                    <div style={{ color: '#fff', fontWeight: 900, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{orgName}</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Student Identity Card</div>
                </div>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', gap: 14, padding: '14px 16px', flex: 1 }}>
                {/* Photo */}
                {fields.showPhoto && (
                    <div style={{ flexShrink: 0 }}>
                        <div style={{ width: 64, height: 76, borderRadius: 10, overflow: 'hidden', border: '3px solid #4f46e5', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {student.imageUrl
                                ? <img src={student.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontWeight: 900, fontSize: 20, color: '#4f46e5' }}>{getUserInitials(`${student.firstName} ${student.lastName}`)}</span>
                            }
                        </div>
                    </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 14, color: '#111827', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {student.firstName} {student.lastName}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 9, color: '#4f46e5', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>{sid}</div>

                    <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 10px' }}>
                        {fields.showCourse && course && (
                            <div>
                                <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Course</div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course}</div>
                            </div>
                        )}
                        {fields.showBatch && batch && (
                            <div>
                                <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Batch</div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#374151' }}>{batch}</div>
                            </div>
                        )}
                        {fields.showDOB && dob && (
                            <div>
                                <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DOB</div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#374151' }}>{dob}</div>
                            </div>
                        )}
                        {fields.showPhone && student.phone && (
                            <div>
                                <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phone</div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#374151' }}>{student.phone}</div>
                            </div>
                        )}
                        {fields.showBloodGroup && student.bloodGroup && (
                            <div>
                                <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Blood</div>
                                <div style={{ fontSize: 9, fontWeight: 800, color: '#374151' }}>{student.bloodGroup}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* QR placeholder */}
                {fields.showQR && (
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 52, height: 52, border: '2px solid #e5e7eb', borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 1, padding: 4, background: '#f9fafb' }}>
                            {Array.from({ length: 25 }).map((_, i) => (
                                <div key={i} style={{ background: [0,1,2,5,6,10,12,14,18,19,20,22,24].includes(i) ? '#111827' : 'transparent', borderRadius: 1 }} />
                            ))}
                        </div>
                        <div style={{ fontSize: 7, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scan</div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{ background: '#f3f4f6', borderTop: '1px solid #e5e7eb', padding: '6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {student.status === 'active' ? '● Active' : `● ${student.status}`}
                </div>
                {fields.showAddress && (student.city || student.state) && (
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#6b7280' }}>
                        {[student.city, student.state].filter(Boolean).join(', ')}
                    </div>
                )}
                <div style={{ fontSize: 8, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {student.branch?.name || ''}
                </div>
            </div>
        </div>
    )
}
