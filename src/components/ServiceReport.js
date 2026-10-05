'use client'
import { useState } from 'react'

function buildReportHTML(report, total, partsTotal) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>resQ Service Report – ${report.bookingId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; color: #111; }
    .page { max-width: 720px; margin: 0 auto; background: white; }

    /* Header */
    .header { background: linear-gradient(135deg, #13347b 0%, #00a1e1 100%); padding: 32px 40px 28px; }
    .header-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-mark { width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; color: white; letter-spacing: -1px; }
    .logo-text { color: white; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
    .logo-sub { color: rgba(255,255,255,0.65); font-size: 11px; font-weight: 500; margin-top: 2px; }
    .header-right { text-align: right; }
    .report-label { color: rgba(255,255,255,0.65); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
    .booking-id { color: white; font-size: 20px; font-weight: 900; }
    .header-badges { display: flex; align-items: center; gap: 10px; }
    .badge-green { background: #34d399; color: white; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 999px; }
    .badge-date { color: rgba(255,255,255,0.75); font-size: 12px; }

    /* Body */
    .body { padding: 32px 40px; space-y: 24px; }

    /* Section */
    .section { margin-bottom: 28px; }
    .section-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }

    /* Info card */
    .info-card { background: #f9fafb; border-radius: 14px; padding: 16px 20px; }
    .service-name { font-size: 16px; font-weight: 800; color: #111827; margin-bottom: 8px; }
    .info-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; margin-top: 5px; }
    .info-icon { font-size: 14px; }

    /* Tech card */
    .tech-card { background: #f9fafb; border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; }
    .tech-avatar { width: 48px; height: 48px; background: #13347b; border-radius: 999px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 18px; flex-shrink: 0; }
    .tech-name { font-size: 15px; font-weight: 700; color: #111827; }
    .tech-meta { font-size: 12px; color: #9ca3af; margin-top: 3px; }
    .tech-phone { margin-left: auto; font-size: 12px; font-weight: 700; color: #00a1e1; }

    /* Table */
    .cost-table { width: 100%; border-collapse: collapse; border-radius: 14px; overflow: hidden; border: 1px solid #e5e7eb; }
    .cost-table th { background: #f9fafb; padding: 10px 16px; font-size: 11px; font-weight: 700; color: #6b7280; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .cost-table th.right { text-align: right; }
    .cost-table th.center { text-align: center; }
    .cost-table td { padding: 12px 16px; font-size: 13px; color: #374151; border-bottom: 1px solid #f3f4f6; }
    .cost-table td.right { text-align: right; font-weight: 600; }
    .cost-table td.center { text-align: center; color: #9ca3af; }
    .cost-table td.muted { color: #9ca3af; font-size: 12px; }
    .total-row td { background: #eef2ff; font-weight: 900; color: #13347b; font-size: 15px; border-bottom: none; }

    /* Warranty */
    .warranty-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 16px 20px; display: flex; align-items: flex-start; gap: 14px; }
    .warranty-icon { font-size: 28px; }
    .warranty-title { font-size: 14px; font-weight: 800; color: #166534; margin-bottom: 4px; }
    .warranty-sub { font-size: 12px; color: #15803d; line-height: 1.5; }

    /* Notes */
    .notes-card { background: #f9fafb; border-radius: 14px; padding: 16px 20px; font-size: 13px; color: #4b5563; font-style: italic; line-height: 1.6; border-left: 4px solid #00a1e1; }

    /* Checklist */
    .checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .check-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #374151; }
    .check-dot { width: 18px; height: 18px; background: #dcfce7; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; }

    /* Footer */
    .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; }
    .footer-brand { font-size: 12px; font-weight: 700; color: #13347b; }
    .footer-meta { font-size: 11px; color: #9ca3af; text-align: right; }

    /* QR placeholder */
    .qr-block { display: flex; align-items: center; gap: 16px; }
    .qr-box { width: 64px; height: 64px; border: 2px solid #e5e7eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #9ca3af; text-align: center; background: white; padding: 4px; }

    @media print {
      body { background: white; }
      .no-print { display: none !important; }
      @page { margin: 0; size: A4; }
    }
  </style>
</head>
<body>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="header-top">
      <div class="logo">
        <div class="logo-mark">rQ</div>
        <div>
          <div class="logo-text">Reliance resQ</div>
          <div class="logo-sub">Home Appliance Services</div>
        </div>
      </div>
      <div class="header-right">
        <div class="report-label">Service Report</div>
        <div class="booking-id">Job #${report.bookingId}</div>
      </div>
    </div>
    <div class="header-badges">
      <span class="badge-green">✓ Service Completed</span>
      <span class="badge-date">${report.date} · ${report.time}</span>
    </div>
  </div>

  <div class="body">

    <!-- Service Info -->
    <div class="section">
      <div class="section-label">Service Details</div>
      <div class="info-card">
        <div class="service-name">${report.service}</div>
        <div class="info-row"><span class="info-icon">📅</span> ${report.date} &nbsp;·&nbsp; ${report.time}</div>
        <div class="info-row"><span class="info-icon">📍</span> ${report.address}</div>
      </div>
    </div>

    <!-- Technician -->
    <div class="section">
      <div class="section-label">Technician</div>
      <div class="tech-card">
        <div class="tech-avatar">${report.tech.name.charAt(0)}</div>
        <div>
          <div class="tech-name">${report.tech.name}</div>
          <div class="tech-meta">ID: ${report.tech.id} &nbsp;·&nbsp; ⭐ ${report.tech.rating} &nbsp;·&nbsp; Verified Expert</div>
        </div>
        <div class="tech-phone">${report.tech.phone}</div>
      </div>
    </div>

    <!-- Work Checklist -->
    <div class="section">
      <div class="section-label">Work Done</div>
      <div class="checklist">
        ${report.checklist.map(item => `
        <div class="check-item">
          <div class="check-dot">✓</div>
          <span>${item}</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- Cost Breakdown -->
    <div class="section">
      <div class="section-label">Cost Breakdown</div>
      <table class="cost-table">
        <thead>
          <tr>
            <th>Item / Description</th>
            <th class="center">Qty</th>
            <th class="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${report.parts.map(p => `
          <tr>
            <td>${p.name}</td>
            <td class="center">${p.qty}</td>
            <td class="right">₹${p.price * p.qty}</td>
          </tr>`).join('')}
          <tr>
            <td>Labour charges</td>
            <td class="center muted">—</td>
            <td class="right">₹${report.labour}</td>
          </tr>
          <tr>
            <td class="muted">GST (18%)</td>
            <td class="center muted">—</td>
            <td class="right muted">₹${report.tax}</td>
          </tr>
          <tr class="total-row">
            <td colspan="2">Total Paid</td>
            <td class="right">₹${total}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Service Warranty -->
    <div class="section">
      <div class="warranty-card">
        <div class="warranty-icon">🛡️</div>
        <div>
          <div class="warranty-title">30-Day Service Warranty</div>
          <div class="warranty-sub">
            If the same issue recurs within 30 days, we fix it free of charge.<br/>
            Warranty valid until: <strong>${report.warrantyExpiry}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Technician Notes -->
    <div class="section">
      <div class="section-label">Technician Notes</div>
      <div class="notes-card">"${report.notes}"</div>
    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="qr-block">
      <div class="qr-box">Verify<br/>online</div>
      <div>
        <div class="footer-brand">Reliance resQ</div>
        <div style="font-size:11px;color:#6b7280;margin-top:2px;">📞 1800-889-1700 &nbsp;·&nbsp; resqservices.in</div>
        <div style="font-size:11px;color:#9ca3af;margin-top:2px;">Generated on ${new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</div>
      </div>
    </div>
    <div class="footer-meta">
      <div style="font-weight:700;color:#374151;">Job Card: ${report.bookingId}</div>
      <div style="margin-top:2px;">Tech ID: ${report.tech.id}</div>
      <div style="margin-top:2px;color:#00a1e1;font-weight:700;">VERIFIED</div>
    </div>
  </div>
</div>

<script>
  window.onload = function() {
    setTimeout(function() { window.print(); }, 400);
  };
</script>
</body>
</html>`
}

export default function ServiceReport({ booking, onClose }) {
  const [downloading, setDownloading] = useState(false)

  const report = {
    bookingId: booking?.id || 'BK2026001',
    service: booking?.service || 'Split AC Jet Service',
    date: booking?.date || 'Fri, 2 Oct 2026',
    time: booking?.time || '10:00 AM – 12:00 PM',
    address: booking?.address || '12, Sunset Residency, Lokhandwala, Mumbai 400053',
    tech: {
      name: booking?.tech?.name || 'Rahul Sharma',
      id: 'TECH-2891',
      rating: booking?.tech?.rating || 4.9,
      phone: booking?.tech?.phone || '+91 98200 11223',
    },
    parts: [
      { name: 'Gas top-up (R32, 1 kg)', qty: 1, price: 250 },
      { name: 'Condenser cleaning chemical', qty: 1, price: 80 },
    ],
    checklist: [
      'Deep jet cleaning performed',
      'Gas pressure checked & topped',
      'Filter cleaned & reinstalled',
      'Drainage pipe cleared',
      'Thermostat calibrated',
      'Cooling output verified',
    ],
    labour: 269,
    tax: 49,
    warrantyDays: 30,
    warrantyExpiry: '1 Nov 2026',
    notes: 'AC cooling restored to factory levels. Filter cleaned. Drainage pipe cleared. No further issues observed.',
  }

  const partsTotal = report.parts.reduce((s, p) => s + p.price * p.qty, 0)
  const total = partsTotal + report.labour + report.tax

  function handleDownload() {
    setDownloading(true)
    const html = buildReportHTML(report, total, partsTotal)
    const win = window.open('', '_blank', 'width=800,height=900,scrollbars=yes')
    if (win) {
      win.document.write(html)
      win.document.close()
    }
    setTimeout(() => setDownloading(false), 800)
  }

  return (
    <div className="fixed inset-0 z-[500] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-navy to-sky px-6 py-5 rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Service Report</div>
              <div className="text-white text-xl font-extrabold">Job #{report.bookingId}</div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white text-2xl">×</button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-green-400 text-white text-xs font-bold px-3 py-1 rounded-full">✓ Service Completed</span>
            <span className="text-white/70 text-xs">{report.date}</span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Service info */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-1.5">
            <div className="font-bold text-gray-900">{report.service}</div>
            <div className="text-sm text-gray-500">📅 {report.date} · {report.time}</div>
            <div className="text-sm text-gray-500">📍 {report.address}</div>
          </div>

          {/* Technician */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Technician</div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                {report.tech.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{report.tech.name}</div>
                <div className="text-xs text-gray-400">ID: {report.tech.id} · ⭐ {report.tech.rating}</div>
              </div>
              <div className="text-xs text-sky font-semibold">{report.tech.phone}</div>
            </div>
          </div>

          {/* Work checklist */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Work Done</div>
            <div className="grid grid-cols-2 gap-2">
              {report.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cost Breakdown</div>
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs font-bold text-gray-500">Item</th>
                    <th className="text-center px-2 py-2.5 text-xs font-bold text-gray-500">Qty</th>
                    <th className="text-right px-4 py-2.5 text-xs font-bold text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.parts.map((p, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-gray-700">{p.name}</td>
                      <td className="px-2 py-3 text-center text-gray-500">{p.qty}</td>
                      <td className="px-4 py-3 text-right text-gray-800 font-medium">₹{p.price * p.qty}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-700">Labour charges</td>
                    <td className="px-2 py-3 text-center text-gray-400">—</td>
                    <td className="px-4 py-3 text-right text-gray-800 font-medium">₹{report.labour}</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500 text-xs">GST (18%)</td>
                    <td className="px-2 py-3 text-center text-gray-400 text-xs">—</td>
                    <td className="px-4 py-3 text-right text-gray-500 text-xs">₹{report.tax}</td>
                  </tr>
                  <tr className="bg-navy/5 font-bold">
                    <td colSpan={2} className="px-4 py-3 text-navy font-extrabold">Total Paid</td>
                    <td className="px-4 py-3 text-right text-navy font-extrabold text-base">₹{total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Service warranty */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <div className="font-bold text-green-800 text-sm">30-Day Service Warranty</div>
              <div className="text-xs text-green-600 mt-0.5">Valid until {report.warrantyExpiry} · Same issue = free revisit</div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Technician Notes</div>
            <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm text-gray-600 italic border-l-4 border-sky">"{report.notes}"</div>
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-4 bg-navy text-white font-bold rounded-2xl hover:bg-navy/90 transition flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            {downloading ? 'Opening report…' : 'Download PDF Report'}
          </button>
          <p className="text-center text-xs text-gray-400 -mt-2">Opens a print-ready report → Save as PDF</p>
        </div>
      </div>
    </div>
  )
}
