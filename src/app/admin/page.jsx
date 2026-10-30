'use client';

import { useState, useEffect } from 'react';

// --- Data ---
const kpiCards = [
  {
    title: "Today's Bookings",
    value: '24',
    change: '+3 from yesterday',
    changeType: 'positive',
    accent: 'blue',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Revenue (MTD)',
    value: '₹47,200',
    change: '+12% vs last month',
    changeType: 'positive',
    accent: 'green',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Active Technicians',
    value: '18',
    change: '7 available now',
    changeType: 'neutral',
    accent: 'indigo',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Customer Rating',
    value: '4.8',
    change: 'from 142 reviews',
    changeType: 'neutral',
    accent: 'amber',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

const accentStyles = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-[#4361EE]/10',
    iconText: 'text-[#4361EE]',
    border: 'border-[#4361EE]/20',
  },
  green: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    border: 'border-emerald-200',
  },
  indigo: {
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
    border: 'border-indigo-200',
  },
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    border: 'border-amber-200',
  },
};

const bookingTrends = [
  { day: 'Mon', value: 18 },
  { day: 'Tue', value: 22 },
  { day: 'Wed', value: 28 },
  { day: 'Thu', value: 24 },
  { day: 'Fri', value: 31 },
  { day: 'Sat', value: 35 },
  { day: 'Sun', value: 12 },
];

const revenueByProduct = [
  { name: 'Tempered Glass', amount: '₹32,400', percent: 69, color: 'bg-[#4361EE]' },
  { name: 'Privacy Film', amount: '₹8,900', percent: 19, color: 'bg-indigo-400' },
  { name: 'Matte Film', amount: '₹5,900', percent: 12, color: 'bg-blue-300' },
];

const recentBookings = [
  { id: 'SP-1042', customer: 'Aditya Sen', device: 'Galaxy S24', status: 'Awaiting assignment', amount: '₹398' },
  { id: 'SP-1041', customer: 'Sneha Reddy', device: 'iPhone 15 Pro', status: 'Assigned', amount: '₹499' },
  { id: 'SP-1040', customer: 'Kabir Malhotra', device: 'Pixel 8', status: 'Completed', amount: '₹450' },
];

const quickActions = [
  {
    title: 'Assign technicians',
    description: '3 bookings awaiting',
    color: 'text-[#4361EE]',
    bg: 'bg-[#4361EE]/10',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    title: 'Low stock alert',
    description: '2 SKUs below threshold',
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    title: 'Open tickets',
    description: '8 support tickets',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
];

const statusStyles = {
  'Awaiting assignment': 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  Assigned: 'bg-blue-50 text-[#4361EE] ring-1 ring-[#4361EE]/20',
  Completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
};

// --- Component ---
export default function AdminOverviewPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so the transition is visible after paint
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const maxBooking = Math.max(...bookingTrends.map((b) => b.value));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
      
        <h1 className="text-2xl font-bold text-gray-900">Dashboard overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time snapshot of installations, revenue, and team performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpiCards.map((card) => {
          const style = accentStyles[card.accent];
          return (
            <div
              key={card.title}
              className={`rounded-xl border ${style.border} ${style.bg} p-5 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">{card.title}</span>
                <span className={`flex items-center justify-center w-9 h-9 rounded-lg ${style.iconBg} ${style.iconText}`}>
                  {card.icon}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className={`text-xs mt-1 ${card.changeType === 'positive' ? 'text-emerald-600' : 'text-gray-500'}`}>
                {card.changeType === 'positive' && (
                  <svg className="w-3.5 h-3.5 inline mr-0.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
                {card.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Booking trends</h2>
          <p className="text-xs text-gray-500 mb-5">Last 7 days</p>

          <div className="space-y-3">
            {bookingTrends.map((item) => (
              <div key={item.day} className="flex items-center gap-3">
                <span className="w-8 text-xs font-medium text-gray-500 text-right shrink-0">
                  {item.day}
                </span>
                <div className="flex-1 h-7 bg-gray-100 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-[#4361EE] rounded-md transition-all duration-700 ease-out flex items-center justify-end pr-2"
                    style={{
                      width: mounted ? `${(item.value / maxBooking) * 100}%` : '0%',
                    }}
                  >
                    <span className="text-[11px] font-semibold text-white">{item.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Product */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Revenue by product</h2>
          <p className="text-xs text-gray-500 mb-5">Month to date</p>

          <div className="space-y-5">
            {revenueByProduct.map((product) => (
              <div key={product.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{product.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{product.amount}</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${product.color} transition-all duration-700 ease-out`}
                    style={{
                      width: mounted ? `${product.percent}%` : '0%',
                    }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{product.percent}% of total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Recent bookings</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest installation requests</p>
          </div>
          <button className="text-sm font-medium text-[#4361EE] hover:text-[#3651d4] transition-colors">
            View all →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Booking</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Device</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-[#4361EE]">{booking.id}</td>
                  <td className="px-6 py-3.5 text-gray-700">{booking.customer}</td>
                  <td className="px-6 py-3.5 text-gray-600">{booking.device}</td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-medium text-gray-900">{booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:shadow-md hover:border-gray-300 group"
            >
              <span className={`flex items-center justify-center w-10 h-10 rounded-lg ${action.bg} ${action.color} shrink-0 transition-transform group-hover:scale-110`}>
                {action.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
