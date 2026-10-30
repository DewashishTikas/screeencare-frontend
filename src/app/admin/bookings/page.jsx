'use client';

import { useState } from 'react';

const bookings = [
  {
    id: 'SP-1042',
    customer: 'Aditya Sen',
    location: 'Kharghar',
    device: 'Galaxy S24',
    protector: 'Tempered Glass',
    appointment: 'Today 11:00–12:00',
    technician: null,
    status: 'awaiting',
    amount: 398,
  },
  {
    id: 'SP-1041',
    customer: 'Sneha Reddy',
    location: 'Vashi',
    device: 'iPhone 15 Pro',
    protector: 'Privacy Film',
    appointment: 'Today 15:00–16:00',
    technician: 'Rahul Sharma',
    status: 'assigned',
    amount: 499,
  },
  {
    id: 'SP-1040',
    customer: 'Kabir Malhotra',
    location: 'Kharghar East',
    device: 'Pixel 8',
    protector: 'Matte Film',
    appointment: 'Yesterday, Completed',
    technician: 'Vikas Patel',
    status: 'completed',
    amount: 450,
  },
];

const statusConfig = {
  awaiting: {
    label: 'Awaiting assignment',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
  },
  assigned: {
    label: 'Assigned',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
}

/* ── icons (inline SVG to avoid external deps) ── */

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function FunnelIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
      />
    </svg>
  );
}

export default function BookingsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Booking management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Demo data — verify availability and assignment rules with the
            backend.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-[#4361EE] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#3a56d4] transition-colors">
          <ExportIcon />
          Export filtered list
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* search */}
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking ID or customer"
            className="h-9 w-72 rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#4361EE] focus:outline-none focus:ring-1 focus:ring-[#4361EE]"
          />
        </div>

        {/* status dropdown */}
        <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          All statuses
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        </button>

        {/* date dropdown */}
        <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          Today, Oct 28
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        </button>

        {/* more filters */}
        <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <FunnelIcon />
          More filters
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* table header bar */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Today&apos;s bookings
          </h2>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            12 records
          </span>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Booking</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Device &amp; protector</th>
                <th className="px-6 py-3">Appointment</th>
                <th className="px-6 py-3">Technician</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  {/* booking id */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <button className="font-medium text-[#4361EE] hover:underline">
                      {b.id}
                    </button>
                  </td>

                  {/* customer */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {b.customer}
                    </div>
                    <div className="text-xs text-gray-500">{b.location}</div>
                  </td>

                  {/* device */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-gray-900">{b.device}</div>
                    <div className="text-xs text-gray-500">{b.protector}</div>
                  </td>

                  {/* appointment */}
                  <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                    {b.appointment}
                  </td>

                  {/* technician */}
                  <td className="whitespace-nowrap px-6 py-4">
                    {b.technician ? (
                      <span className="text-gray-900">{b.technician}</span>
                    ) : (
                      <span className="font-medium text-red-600">
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* status */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>

                  {/* amount */}
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                    ₹{b.amount}
                  </td>

                  {/* action */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    {b.status === 'awaiting' ? (
                      <button className="rounded-lg bg-[#4361EE] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3a56d4] transition-colors">
                        Assign tech
                      </button>
                    ) : (
                      <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        View details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
