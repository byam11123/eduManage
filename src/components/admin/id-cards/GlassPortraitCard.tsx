// Glassmorphic Portrait ID Card Template — Futuristic & Premium Portrait
import type { Student } from '@/lib/types'
import type { CardFields } from '@/app/admin/id-cards/page'
import { getUserInitials } from '@/lib/utils'

interface Props { student: Student; orgName: string; fields: CardFields }

export function GlassPortraitCard({ student, orgName, fields }: Props) {
    const course = student.studentCourses?.[0]?.course?.name || student.course?.name || ''
    const batch = student.studentCourses?.[0]?.batches?.[0]?.batch?.name || student.batch?.name || ''
    const sid = student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'
    
    return (
        <div
            style={{
                width: 220, height: 340, borderRadius: 32, overflow: 'hidden',
                fontFamily: 'Inter, sans-serif',
                background: '#0f172a',
                position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                display: 'flex', flexDirection: 'column'
            }}
        >
            {/* Background Blobs */}
            <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', top: -60, right: -40, filter: 'blur(50px)', opacity: 0.7 }} />
            <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', bottom: -50, left: -30, filter: 'blur(45px)', opacity: 0.5 }} />

            {/* Glass Overlay */}
            <div style={{ 
                position: 'absolute', inset: 0, 
                background: 'rgba(255, 255, 255, 0.04)', 
                backdropFilter: 'blur(16px)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 32
            }} />

            {/* Content */}
            <div style={{ position: 'relative', flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{orgName}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 4 }}>Student Identity</div>
                </div>

                {/* Photo */}
                {fields.showPhoto && (
                    <div style={{ marginBottom: 20 }}>
                        <div style={{
                            width: 100, height: 120, borderRadius: 24, overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
                        }}>
                            {student.imageUrl
                                ? <img src={student.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontWeight: 900, fontSize: 32, color: '#fff' }}>{getUserInitials(`${student.firstName} ${student.lastName}`)}</span>
                            }
                        </div>
                    </div>
                )}

                {/* Name */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontWeight: 900, fontSize: 16, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
                        {student.firstName} <span style={{ color: '#c084fc' }}>{student.lastName}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>{sid}</div>
                </div>

                {/* Info */}
                <div style={{ width: '100%', textAlign: 'center', spaceY: 8 }}>
                    {fields.showCourse && course && (
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 7, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Program of Study</div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course}</div>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                        {fields.showBatch && batch && (
                            <div>
                                <div style={{ fontSize: 7, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Batch</div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{batch}</div>
                            </div>
                        )}
                        {fields.showQR && (
                            <div style={{
                                width: 32, height: 32, border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
                                gap: 0.5, padding: 3, background: 'rgba(255,255,255,0.03)'
                            }}>
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div key={i} style={{ background: [0,1,2,5,6,10,12,14,18,19,20,22,24].includes(i) ? '#fff' : 'transparent', borderRadius: 0.5 }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Glow */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)', flexShrink: 0 }} />
        </div>
    )
}
