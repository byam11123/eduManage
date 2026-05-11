// Custom ID Card Template — Clean Overlay on User Background (Landscape)
import type { Student } from '@/lib/types'
import type { CardFields } from '@/app/admin/id-cards/page'
import { getUserInitials } from '@/lib/utils'

interface Props { student: Student; orgName: string; fields: CardFields; customBg?: string }

export function CustomCard({ student, orgName, fields, customBg }: Props) {
    const course = student.studentCourses?.[0]?.course?.name || student.course?.name || ''
    const batch = student.studentCourses?.[0]?.batches?.[0]?.batch?.name || student.batch?.name || ''
    const sid = student.studentDisplayId || student.admissionDisplayId || student.enrollmentNo || '—'
    const dob = student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : ''
    
    return (
        <div
            style={{
                width: 340, height: 210, borderRadius: 20, overflow: 'hidden',
                fontFamily: 'Inter, sans-serif',
                background: customBg ? `url(${customBg}) center/cover no-repeat` : '#f3f4f6',
                position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                display: 'flex', border: '1px solid #e5e7eb'
            }}
        >
            {!customBg && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Upload Background
                </div>
            )}

            {/* Subtle Gradient for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)', zIndex: 5 }} />

            {/* Content Overlay — No white container */}
            <div style={{ 
                position: 'absolute', bottom: 16, left: 20, right: 20,
                display: 'flex', gap: 16, alignItems: 'flex-end',
                zIndex: 10
            }}>
                {fields.showPhoto && (
                    <div style={{
                        width: 60, height: 72, borderRadius: 12, overflow: 'hidden',
                        border: '2px solid #fff',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                    }}>
                        {student.imageUrl
                            ? <img src={student.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>{getUserInitials(`${student.firstName} ${student.lastName}`)}</span>
                        }
                    </div>
                )}

                <div style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
                    <div style={{ fontWeight: 900, fontSize: 16, color: '#fff', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {student.firstName} {student.lastName}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 9, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{sid}</div>
                    
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                         {fields.showCourse && course && (
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course}</div>
                        )}
                        {fields.showBatch && batch && (
                            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{batch}</div>
                        )}
                        {fields.showPhone && student.phone && (
                            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{student.phone}</div>
                        )}
                        {fields.showDOB && dob && (
                            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{dob}</div>
                        )}
                    </div>
                </div>

                {fields.showQR && (
                    <div style={{
                        width: 44, height: 44, border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
                        gap: 1, padding: 4, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)'
                    }}>
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} style={{ background: [0,1,2,5,6,10,12,14,18,19,20,22,24].includes(i) ? '#fff' : 'transparent', borderRadius: 0.5 }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Org Label Top Left */}
            <div style={{ position: 'absolute', top: 16, left: 20, zIndex: 10 }}>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{orgName}</div>
                {fields.showAddress && (student.city || student.state) && (
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: 700, marginTop: 2 }}>
                        {[student.city, student.state].filter(Boolean).join(', ')}
                    </div>
                )}
            </div>
        </div>
    )
}
