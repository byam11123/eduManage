// Glassmorphic ID Card Template — Futuristic & Premium Landscape
import type { Student } from '@/lib/types'
import type { CardFields } from '@/app/admin/id-cards/page'
import { getUserInitials } from '@/lib/utils'

interface Props { student: Student; orgName: string; fields: CardFields }

export function GlassCard({ student, orgName, fields }: Props) {
    const course = student.studentCourses?.[0]?.course?.name || student.course?.name || ''
    const batch = student.studentCourses?.[0]?.batches?.[0]?.batch?.name || student.batch?.name || ''
    const sid = student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'
    
    return (
        <div
            style={{
                width: 340, height: 210, borderRadius: 24, overflow: 'hidden',
                fontFamily: 'Inter, sans-serif',
                background: '#0f172a',
                position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                display: 'flex'
            }}
        >
            {/* Background Blobs */}
            <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', top: -50, left: -30, filter: 'blur(40px)', opacity: 0.6 }} />
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', bottom: -40, right: -20, filter: 'blur(35px)', opacity: 0.4 }} />

            {/* Glass Overlay */}
            <div style={{ 
                position: 'absolute', inset: 0, 
                background: 'rgba(255, 255, 255, 0.03)', 
                backdropFilter: 'blur(12px)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 24
            }} />

            {/* Left Content */}
            <div style={{ position: 'relative', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                <div style={{ marginBottom: 'auto' }}>
                    <div style={{ color: '#fff', fontWeight: 900, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{orgName}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>Official Student Pass</div>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
                        {student.firstName} <span style={{ color: '#a78bfa' }}>{student.lastName}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 4 }}>{sid}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {fields.showCourse && course && (
                        <div>
                            <div style={{ fontSize: 7, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Program</div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course}</div>
                        </div>
                    )}
                    {fields.showBatch && batch && (
                        <div>
                            <div style={{ fontSize: 7, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Batch</div>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{batch}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side Photo */}
            <div style={{ position: 'relative', width: 110, padding: '20px 20px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                {fields.showPhoto && (
                    <div style={{
                        width: 80, height: 100, borderRadius: 20, overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                        marginBottom: 12
                    }}>
                        {student.imageUrl
                            ? <img src={student.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontWeight: 900, fontSize: 24, color: '#fff' }}>{getUserInitials(`${student.firstName} ${student.lastName}`)}</span>
                        }
                    </div>
                )}
                {fields.showQR && (
                    <div style={{
                        width: 44, height: 44, border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 10, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
                        gap: 1, padding: 4, background: 'rgba(255,255,255,0.03)'
                    }}>
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} style={{ background: [0,1,2,5,6,10,12,14,18,19,20,22,24].includes(i) ? '#fff' : 'transparent', borderRadius: 0.5 }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Glow */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #6366f1, #ec4899, transparent)' }} />
        </div>
    )
}
