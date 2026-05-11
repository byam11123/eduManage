// Custom Portrait ID Card Template — Clean Overlay on User Background
import type { Student } from '@/lib/types'
import type { CardFields } from '@/app/admin/id-cards/page'
import { getUserInitials } from '@/lib/utils'

interface Props { student: Student; orgName: string; fields: CardFields; customBg?: string }

export function CustomPortraitCard({ student, orgName, fields, customBg }: Props) {
    const course = student.studentCourses?.[0]?.course?.name || student.course?.name || ''
    const batch = student.studentCourses?.[0]?.batches?.[0]?.batch?.name || student.batch?.name || ''
    const sid = student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'
    const dob = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : ''

    return (
        <div
            style={{
                width: 220, height: 340, borderRadius: 24, overflow: 'hidden',
                fontFamily: 'Inter, sans-serif',
                background: customBg ? `url(${customBg}) center/cover no-repeat` : '#f3f4f6',
                position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                display: 'flex', flexDirection: 'column', border: '1px solid #e5e7eb'
            }}
        >
            {!customBg && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', padding: 20 }}>
                    Upload Portrait Background
                </div>
            )}

            {/* Subtle Gradient for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)', zIndex: 5 }} />

            {/* Org Label Top */}
            <div style={{ position: 'relative', zIndex: 10, padding: '24px 16px', textAlign: 'center' }}>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{orgName}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 7, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>Identity Card</div>
            </div>

            {/* Content Overlay — No white container */}
            <div style={{ 
                marginTop: 'auto', padding: '0 20px 24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                zIndex: 10
            }}>
                {fields.showPhoto && (
                    <div style={{
                        width: 90, height: 108, borderRadius: 16, overflow: 'hidden',
                        border: '3px solid #fff',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 20,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                    }}>
                        {student.imageUrl
                            ? <img src={student.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontWeight: 900, fontSize: 28, color: '#fff' }}>{getUserInitials(`${student.firstName} ${student.lastName}`)}</span>
                        }
                    </div>
                )}

                <div style={{ textAlign: 'center', width: '100%' }}>
                    <div style={{ fontWeight: 900, fontSize: 16, color: '#fff', letterSpacing: '-0.01em', marginBottom: 4, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {student.firstName} {student.lastName}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 9, color: '#818cf8', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>{sid}</div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                         {fields.showCourse && course && (
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course}</div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 10px' }}>
                            {fields.showBatch && batch && (
                                <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{batch}</div>
                            )}
                            {fields.showDOB && dob && (
                                <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{dob}</div>
                            )}
                        </div>
                        
                        {(fields.showPhone || fields.showQR) && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 4 }}>
                                {fields.showPhone && student.phone && (
                                    <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{student.phone}</div>
                                )}
                                {fields.showQR && (
                                    <div style={{
                                        width: 32, height: 32, border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: 6, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
                                        gap: 0.5, padding: 3, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)'
                                    }}>
                                        {Array.from({ length: 25 }).map((_, i) => (
                                            <div key={i} style={{ background: [0,1,2,5,6,10,12,14,18,19,20,22,24].includes(i) ? '#fff' : 'transparent', borderRadius: 0.2 }} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
