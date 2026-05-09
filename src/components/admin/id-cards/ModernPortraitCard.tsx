// Modern Portrait ID Card Template
import type { Student } from '@/lib/types'
import type { CardFields } from '@/app/admin/id-cards/page'
import { getUserInitials } from '@/lib/utils'

interface Props { student: Student; orgName: string; fields: CardFields }

export function ModernPortraitCard({ student, orgName, fields }: Props) {
    const course = student.studentCourses?.[0]?.course?.name || student.course?.name || ''
    const batch = student.studentCourses?.[0]?.batches?.[0]?.batch?.name || student.batch?.name || ''
    const sid = student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'
    const dob = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : ''

    return (
        <div
            style={{
                width: 220, height: 340, borderRadius: 24, overflow: 'hidden',
                fontFamily: 'Inter, sans-serif',
                background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
                position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column'
            }}
        >
            {/* Design elements */}
            <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', top: -40, right: -30, backdropFilter: 'blur(30px)' }} />
            <div style={{ position: 'absolute', width: 200, height: 2, background: 'linear-gradient(90deg, transparent, #6366f1, transparent)', top: '45%', left: '50%', transform: 'translateX(-50%) rotate(-5deg)', opacity: 0.3 }} />

            {/* Header */}
            <div style={{ padding: '20px 16px 16px', textAlign: 'center', position: 'relative' }}>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{orgName}</div>
                <div style={{ color: '#818cf8', fontSize: 7, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 4 }}>Identity Card</div>
            </div>

            {/* Photo */}
            <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
                {fields.showPhoto && (
                    <div style={{
                        width: 90, height: 108, borderRadius: 20, overflow: 'hidden',
                        border: '2px solid rgba(99,102,241,0.5)',
                        background: 'rgba(99,102,241,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(99,102,241,0.3)'
                    }}>
                        {student.imageUrl
                            ? <img src={student.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontWeight: 900, fontSize: 28, color: '#818cf8' }}>{getUserInitials(`${student.firstName} ${student.lastName}`)}</span>
                        }
                    </div>
                )}
            </div>

            {/* Info */}
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                    <div style={{ fontWeight: 900, fontSize: 14, color: '#fff', letterSpacing: '-0.01em', marginBottom: 3 }}>
                        {student.firstName} {student.lastName}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 8, color: '#818cf8', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{sid}</div>
                </div>

                <div style={{ width: '100%', spaceY: 4 }}>
                    {fields.showCourse && course && (
                        <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course}</div>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                        {fields.showBatch && batch && (
                            <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Batch: {batch}</div>
                        )}
                        {fields.showDOB && dob && (
                            <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>DOB: {dob}</div>
                        )}
                    </div>
                </div>

                {/* QR */}
                {fields.showQR && (
                    <div style={{ marginTop: 'auto', paddingBottom: 10 }}>
                        <div style={{
                            width: 40, height: 40, border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
                            gap: 1, padding: 4, background: 'rgba(99,102,241,0.05)'
                        }}>
                            {Array.from({ length: 25 }).map((_, i) => (
                                <div key={i} style={{ background: [0,1,2,5,6,10,12,14,18,19,20,22,24].includes(i) ? '#818cf8' : 'transparent', borderRadius: 0.5 }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Accent */}
            <div style={{ height: 6, background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', flexShrink: 0 }} />
        </div>
    )
}
