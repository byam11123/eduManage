// Modern ID Card Template — Dark gradient premium feel
import type { Student } from '@/lib/types'
import type { CardFields } from '@/app/admin/id-cards/page'
import { getUserInitials } from '@/lib/utils'

interface Props { student: Student; orgName: string; fields: CardFields }

export function ModernCard({ student, orgName, fields }: Props) {
    const course = student.studentCourses?.[0]?.course?.name || student.course?.name || ''
    const batch = student.studentCourses?.[0]?.batches?.[0]?.batch?.name || student.batch?.name || ''
    const sid = student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'
    const dob = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : ''

    return (
        <div
            style={{
                width: 340, height: 210, borderRadius: 20, overflow: 'hidden',
                fontFamily: 'Inter, sans-serif',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
        >
            {/* Accent circles */}
            <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', top: -60, right: -40, backdropFilter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', bottom: -30, left: -20 }} />

            {/* Top bar */}
            <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div>
                    <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{orgName}</div>
                    <div style={{ color: 'rgba(165,180,252,0.7)', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 1 }}>Student ID Card</div>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === 1 ? '#818cf8' : i === 2 ? '#a78bfa' : 'rgba(255,255,255,0.2)' }} />
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)', margin: '0 18px' }} />

            {/* Body */}
            <div style={{ display: 'flex', gap: 14, padding: '12px 18px', position: 'relative' }}>
                {/* Photo */}
                {fields.showPhoto && (
                    <div style={{ flexShrink: 0 }}>
                        <div style={{
                            width: 66, height: 80, borderRadius: 14, overflow: 'hidden',
                            border: '2px solid rgba(99,102,241,0.6)',
                            background: 'rgba(99,102,241,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(99,102,241,0.3)'
                        }}>
                            {student.imageUrl
                                ? <img src={student.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontWeight: 900, fontSize: 22, color: '#818cf8' }}>{getUserInitials(`${student.firstName} ${student.lastName}`)}</span>
                            }
                        </div>
                        <div style={{ marginTop: 5, textAlign: 'center' }}>
                            <span style={{
                                fontSize: 7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                                color: student.status === 'active' ? '#34d399' : '#f87171',
                                background: student.status === 'active' ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
                                padding: '2px 6px', borderRadius: 6
                            }}>
                                {student.status}
                            </span>
                        </div>
                    </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 15, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {student.firstName} {student.lastName}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 8, color: '#818cf8', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>{sid}</div>

                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {fields.showCourse && course && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />
                                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course}</div>
                            </div>
                        )}
                        {fields.showBatch && batch && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#a78bfa', flexShrink: 0 }} />
                                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Batch: {batch}</div>
                            </div>
                        )}
                        {fields.showDOB && dob && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#c4b5fd', flexShrink: 0 }} />
                                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>DOB: {dob}</div>
                            </div>
                        )}
                        {fields.showPhone && student.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#e0e7ff', flexShrink: 0 }} />
                                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{student.phone}</div>
                            </div>
                        )}
                        {fields.showBloodGroup && student.bloodGroup && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#f472b6', flexShrink: 0 }} />
                                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Blood: {student.bloodGroup}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* QR */}
                {fields.showQR && (
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{
                            width: 52, height: 52, border: '1.5px solid rgba(99,102,241,0.4)',
                            borderRadius: 10, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
                            gap: 1.5, padding: 5, background: 'rgba(99,102,241,0.1)'
                        }}>
                            {Array.from({ length: 25 }).map((_, i) => (
                                <div key={i} style={{ background: [0,1,2,5,6,10,12,14,18,19,20,22,24].includes(i) ? '#818cf8' : 'transparent', borderRadius: 1 }} />
                            ))}
                        </div>
                        <div style={{ fontSize: 7, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scan</div>
                    </div>
                )}
            </div>

            {/* Bottom strip */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 24, background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', padding: '0 18px', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 7, fontWeight: 800, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{student.branch?.name || ''}</span>
                {fields.showAddress && (student.city || student.state) && (
                    <span style={{ fontSize: 7, fontWeight: 800, color: 'rgba(255,255,255,0.6)' }}>{[student.city, student.state].filter(Boolean).join(', ')}</span>
                )}
                <span style={{ fontSize: 7, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Not Transferable</span>
            </div>
        </div>
    )
}
