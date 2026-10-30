'use client'

import { useState } from 'react'
import Link from 'next/link'

const JOBS = [
  {
    id: 'SP-1042',
    status: 'in-progress',
    statusLabel: 'IN PROGRESS',
    slot: '11:00 AM - 12:00 PM',
    payout: '₹99',
    device: 'Samsung Galaxy S24',
    protector: 'Glass',
    address: 'Flat 402, Blossom Heights, Sector 12, Kharghar',
    customer: 'Aditya Sen',
    phone: '+91 98765 43210',
    type: 'active',
  },
  {
    id: 'SP-1045',
    status: 'assigned',
    statusLabel: 'ASSIGNED',
    slot: '02:00 PM - 03:00 PM',
    payout: '₹99',
    device: 'iPhone 15 Pro Max',
    protector: 'Privacy Glass',
    address: 'H-202, Royal Palms Garden, Sector 4, Kharghar',
    customer: 'Sneha Reddy',
    phone: '+91 98201 12345',
    type: 'active',
  },
  {
    id: 'SP-1049',
    status: 'assigned',
    statusLabel: 'ASSIGNED',
    slot: '04:30 PM - 05:30 PM',
    payout: '₹120',
    device: 'Pixel 8',
    protector: 'Matte Film',
    address: 'Flat 1204, City Villa, Sector 6, Kharghar East',
    customer: 'Kabir Malhotra',
    phone: '+91 98334 98765',
    type: 'active',
  },
  {
    id: 'SP-1052',
    status: 'upcoming',
    statusLabel: 'SCHEDULED',
    slot: 'Tomorrow, 10:00 AM - 11:00 AM',
    payout: '₹99',
    device: 'OnePlus 12',
    protector: 'Tempered Glass',
    address: 'B-301, Greenwood Estate, Vashi',
    customer: 'Pooja Nair',
    phone: '+91 99887 65432',
    type: 'upcoming',
  },
  {
    id: 'SP-1038',
    status: 'completed',
    statusLabel: 'COMPLETED',
    slot: 'Yesterday, 04:00 PM',
    payout: '₹99',
    device: 'Samsung Galaxy S23',
    protector: 'Glass',
    address: 'Seawoods Sector 40, Navi Mumbai',
    customer: 'Rohan Deshmukh',
    phone: '+91 98112 34567',
    type: 'completed',
  },
]

export default function TechnicianDashboard() {
  const [onDuty, setOnDuty] = useState(true)
  const [activeTab, setActiveTab] = useState('active') // 'active' | 'upcoming' | 'completed'
  const [navTab, setNavTab] = useState('jobs') // 'jobs' | 'earnings' | 'alerts'

  const filteredJobs = JOBS.filter((job) => job.type === activeTab)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* ── 1. Top Bar: Profile & Duty Toggle ── */}
      <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden shadow-xs ring-2 ring-blue-100">
            <span>RS</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-gray-400 block leading-tight">
              Welcome back,
            </span>
            <strong className="text-sm font-bold text-gray-900 block leading-tight mt-0.5">
              Rahul Sharma
            </strong>
          </div>
        </div>

        {/* Duty Status Switch */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">Duty</span>
          <button
            type="button"
            onClick={() => setOnDuty(!onDuty)}
            className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer border-none flex items-center ${
              onDuty ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
            aria-label="Toggle Duty Status"
          >
            <div
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                onDuty ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </header>

      {/* ── Main Scrollable Content ── */}
      <main className="flex-1 p-5 pb-8 overflow-y-auto">
        {navTab === 'jobs' && (
          <>
            {/* ── 2. Top Stats Row (Assigned, In Progress, Completed) ── */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Assigned */}
              <div className="bg-[#f0f4ff] rounded-xl p-3.5 text-center border border-blue-100/60 shadow-2xs">
                <span className="text-xs font-semibold text-gray-500 block mb-1">Assigned</span>
                <span className="text-2xl font-black text-[#2563EB]">3</span>
              </div>

              {/* In Progress */}
              <div className="bg-[#fff9eb] rounded-xl p-3.5 text-center border border-amber-100/80 shadow-2xs">
                <span className="text-xs font-semibold text-gray-500 block mb-1">In Progress</span>
                <span className="text-2xl font-black text-[#F59E0B]">1</span>
              </div>

              {/* Completed */}
              <div className="bg-[#ecfdf5] rounded-xl p-3.5 text-center border border-emerald-100/80 shadow-2xs">
                <span className="text-xs font-semibold text-gray-500 block mb-1">Completed</span>
                <span className="text-2xl font-black text-[#10B981]">4</span>
              </div>
            </div>

            {/* ── 3. Section Title & Date ── */}
            <div className="mb-4">
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Assigned Jobs
              </h1>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                Today: Wednesday, Oct 28
              </p>
            </div>

            {/* ── 4. Filter Pills ── */}
            <div className="flex bg-gray-100/90 p-1 rounded-xl gap-1 mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer border-none text-center ${
                  activeTab === 'active'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-800 bg-transparent'
                }`}
              >
                Active (3)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer border-none text-center ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-800 bg-transparent'
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer border-none text-center ${
                  activeTab === 'completed'
                    ? 'bg-white text-gray-900 shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-800 bg-transparent'
                }`}
              >
                Completed
              </button>
            </div>

            {/* ── 5. Job Cards ── */}
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="text-sm text-gray-400">No jobs found in this tab.</p>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const isInProgress = job.status === 'in-progress'

                  return (
                    <div
                      key={job.id}
                      className={`bg-white rounded-2xl p-4.5 transition-all shadow-xs ${
                        isInProgress
                          ? 'border-2 border-amber-400 shadow-amber-100/50'
                          : 'border border-gray-200/90'
                      }`}
                    >
                      {/* Top Job Header: Status Tag & ID */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isInProgress
                                ? 'bg-amber-500 animate-pulse'
                                : job.status === 'completed'
                                ? 'bg-emerald-500'
                                : 'bg-[#2563EB]'
                            }`}
                          />
                          <span
                            className={`text-xs font-black tracking-wide uppercase ${
                              isInProgress
                                ? 'text-amber-600'
                                : job.status === 'completed'
                                ? 'text-emerald-600'
                                : 'text-[#2563EB]'
                            }`}
                          >
                            {job.statusLabel}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-gray-600">
                          #{job.id}
                        </span>
                      </div>

                      {/* Slot & Payout */}
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-[11px] text-gray-400 font-medium block">
                            Appointment Slot
                          </span>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 mt-0.5">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{job.slot}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-gray-400 font-medium block">
                            Payout
                          </span>
                          <span className="text-base font-extrabold text-emerald-600">
                            {job.payout}
                          </span>
                        </div>
                      </div>

                      {/* Device & Protector */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-800 mb-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                          <rect x="5" y="2" width="14" height="20" rx="3" />
                          <line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                        <span>{job.device} · <span className="text-gray-500">{job.protector}</span></span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 text-xs text-gray-500 mb-4 leading-relaxed">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0 mt-0.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="line-clamp-2">{job.address}</span>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/technician/${job.id}`}
                        className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 no-underline transition-all shadow-xs ${
                          isInProgress
                            ? 'bg-[#F59E0B] hover:bg-[#d97706] text-white shadow-amber-200/50'
                            : job.status === 'completed'
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            : 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-blue-200/50'
                        }`}
                      >
                        <span>{isInProgress ? 'Resume Job Details' : 'View Job Details'}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}

        {/* ── Earnings Tab ── */}
        {navTab === 'earnings' && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="text-xl font-extrabold text-gray-900">Your Earnings</h2>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md">
              <span className="text-xs text-blue-200 font-medium">Today&apos;s Total Payout</span>
              <h3 className="text-3xl font-extrabold mt-1">₹396</h3>
              <p className="text-xs text-blue-200/90 mt-2">4 installations completed today</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-gray-900">This Week Breakdown</h4>
              <div className="flex justify-between text-xs py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Base Installations (18 jobs)</span>
                <span className="font-semibold text-gray-900">₹1,782</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Speed Incentives (&lt;45 min)</span>
                <span className="font-semibold text-emerald-600">+₹240</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 font-bold">
                <span className="text-gray-900">Weekly Payout Balance</span>
                <span className="text-emerald-600 text-sm">₹2,022</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Alerts Tab ── */}
        {navTab === 'alerts' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-extrabold text-gray-900">Operational Alerts</h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
              <span className="text-lg">⚡</span>
              <div>
                <strong className="text-xs font-bold text-amber-900 block">Upcoming Appointment Window</strong>
                <p className="text-xs text-amber-800 mt-1">
                  Job #SP-1042 appointment starts in 20 minutes at Kharghar.
                </p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex gap-3">
              <span className="text-lg">📦</span>
              <div>
                <strong className="text-xs font-bold text-blue-900 block">Inventory Replenishment Ready</strong>
                <p className="text-xs text-blue-800 mt-1">
                  Pick up 5x Galaxy S24 Tempered Glass units from the Kharghar Hub before 6:00 PM.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── 6. Fixed Bottom Navigation Bar ── */}
      <footer className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 px-6 py-2.5 flex items-center justify-around z-40 shadow-lg">
        {/* Jobs Tab */}
        <button
          type="button"
          onClick={() => setNavTab('jobs')}
          className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-0 transition-colors ${
            navTab === 'jobs' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span className="text-[11px] font-semibold">Jobs</span>
        </button>

        {/* Earnings Tab */}
        <button
          type="button"
          onClick={() => setNavTab('earnings')}
          className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-0 transition-colors ${
            navTab === 'earnings' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="text-[11px] font-semibold">Earnings</span>
        </button>

        {/* Alerts Tab */}
        <button
          type="button"
          onClick={() => setNavTab('alerts')}
          className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-0 transition-colors relative ${
            navTab === 'alerts' ? 'text-[#2563EB]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </div>
          <span className="text-[11px] font-semibold">Alerts</span>
        </button>
      </footer>
    </div>
  )
}

