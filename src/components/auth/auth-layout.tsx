'use client'

import { ReactNode } from 'react'
import { GraduationCap, CheckCircle } from 'lucide-react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

const FEATURES = [
  'Manage students, fees & attendance in one place',
  'Auto-generated receipts with PDF download',
  'Multi-branch support with role-based access',
]

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] flex-col justify-between relative overflow-hidden bg-[#4338CA]">
        {/* Radial glow blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-indigo-400/20 blur-2xl" />
        </div>

        {/* Top wordmark */}
        <div className="relative z-10 p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">EduManage</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 px-8 lg:px-12 pb-4">
          <div className="mb-8">
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              The complete platform for coaching institutes
            </h2>
            <p className="text-indigo-200 text-base leading-relaxed">
              Streamline admissions, fees, attendance, and more — all from a single, powerful dashboard.
            </p>
          </div>

          {/* Feature bullets */}
          <ul className="space-y-3 mb-10">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-indigo-300 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-100 text-sm">{f}</span>
              </li>
            ))}
          </ul>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5">
            <p className="text-indigo-100 text-sm italic leading-relaxed mb-3">
              &ldquo;EduManage cut our fee collection time in half and we never miss a follow-up anymore.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center text-white text-xs font-bold">
                RK
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Ravi Kumar</p>
                <p className="text-indigo-300 text-xs">Director, Excellence Coaching, Jaipur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stat strip */}
        <div className="relative z-10 px-8 lg:px-10 py-6 flex items-center gap-8 border-t border-white/10">
          {[['500+', 'Institutes'], ['50K+', 'Students'], ['₹10Cr+', 'Fees Tracked']].map(([val, label]) => (
            <div key={label}>
              <p className="text-white font-bold text-lg">{val}</p>
              <p className="text-indigo-300 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-background px-6 py-10 lg:px-12">
        {/* Mobile brand header (only visible < lg) */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">EduManage</span>
        </div>

        <div className="w-full max-w-[440px]">
          {/* Title block */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
            )}
          </div>

          {/* Form content */}
          <div className="space-y-5">
            {children}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-10 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} EduManage. All rights reserved.
        </p>
      </div>
    </div>
  )
}
