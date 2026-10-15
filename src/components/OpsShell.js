'use client'
import Link from 'next/link'

/**
 * Shared page shell for all ops inner pages.
 * Props:
 *   title       — page heading
 *   subtitle    — optional muted sub-line
 *   breadcrumb  — [{ label, href }] (last item is current page, no href)
 *   actions     — optional JSX for right-side action buttons
 *   children    — page body
 *   bg          — optional override for body background (default #f5f7fb)
 *   noPad       — skip body padding (for full-bleed layouts)
 */
export default function OpsShell({ title, subtitle, breadcrumb = [], actions, children, bg = '#f5f7fb', noPad = false }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg }}>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">

          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <div className="flex items-center gap-1.5 pt-3 pb-0">
              <Link href="/ops" className="text-[11px] text-gray-400 hover:text-[#13347b] transition-colors font-medium">
                Ops
              </Link>
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-gray-300 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  {crumb.href ? (
                    <Link href={crumb.href} className="text-[11px] text-gray-400 hover:text-[#13347b] transition-colors font-medium">{crumb.label}</Link>
                  ) : (
                    <span className="text-[11px] text-gray-600 font-semibold">{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Title row */}
          <div className="flex items-center justify-between py-3 gap-4">
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 leading-tight">{title}</h1>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5 font-medium">{subtitle}</p>}
            </div>
            {actions && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className={`flex-1 ${noPad ? '' : 'max-w-7xl mx-auto w-full px-5 sm:px-6 py-6'}`}>
        {children}
      </div>
    </div>
  )
}

/** Reusable action button styles */
export function ActionBtn({ href, onClick, children, variant = 'secondary' }) {
  const base = 'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all'
  const styles = {
    primary:   `${base} text-white hover:opacity-90`,
    secondary: `${base} bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300`,
    danger:    `${base} bg-red-50 border border-red-200 text-red-600 hover:bg-red-100`,
  }
  const cls = styles[variant] || styles.secondary
  const style = variant === 'primary' ? { background: 'linear-gradient(135deg,#13347b,#00a1e1)' } : {}

  if (href) return <Link href={href} className={cls} style={style}>{children}</Link>
  return <button onClick={onClick} className={cls} style={style}>{children}</button>
}

/** Stat card for summary rows */
export function StatCard({ label, value, sub, color = 'text-gray-900', bg = 'bg-white', border = true }) {
  return (
    <div className={`${bg} rounded-2xl px-5 py-4 ${border ? 'border border-gray-100' : ''}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-extrabold leading-none ${color}`}>{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

/** Section divider with label */
export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 whitespace-nowrap">{children}</p>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}
