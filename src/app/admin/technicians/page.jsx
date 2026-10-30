'use client';

import { useState } from 'react';
import Link from 'next/link';

const kpiCards = [
  {
    title: 'Active today',
    value: 18,
    sub: '+3 since 9:00 AM',
    subColor: 'text-green-600',
    isLink: false,
  },
  {
    title: 'Available now',
    value: 7,
    sub: 'Across 4 service areas',
    subColor: 'text-gray-500',
    isLink: false,
  },
  {
    title: 'At capacity',
    value: 2,
    sub: 'Review new assignments',
    subColor: 'text-[#4361EE]',
    isLink: true,
  },
];

const technicians = [
  {
    id: 1,
    name: 'Rahul Sharma',
    initials: 'RS',
    status: 'Available',
    statusStyle: 'bg-green-100 text-green-700',
    location: 'Kharghar',
    jobs: '2 jobs today',
    rating: '4.9 average rating',
  },
  {
    id: 2,
    name: 'Vikas Patel',
    initials: 'VP',
    status: 'On job',
    statusStyle: 'bg-gray-700 text-white',
    location: 'Kharghar West',
    jobs: '4 jobs today',
    rating: '4.8 average rating',
  },
  {
    id: 3,
    name: 'Meera Iyer',
    initials: 'MI',
    status: 'Off duty',
    statusStyle: 'bg-white text-gray-500 border border-gray-300',
    location: 'Vashi',
    jobs: 'No current assignment',
    rating: '5.0 average rating',
  },
];

export default function TechniciansPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('Kharghar');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Operations{' '}
            <span className="mx-1 text-gray-400">/</span>{' '}
            Technicians
          </p>
          <h1 className="text-2xl font-semibold text-gray-900">
            Technician management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor authorized installers, service coverage, and current workload.
          </p>
        </div>
        <button className="bg-[#4361EE] hover:bg-[#3a56d4] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add technician
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p className="text-sm text-gray-500 mb-1">{card.title}</p>
            <p className="text-3xl font-semibold text-gray-900">{card.value}</p>
            {card.isLink ? (
              <button className={`text-xs mt-1 ${card.subColor} hover:underline font-medium`}>
                {card.sub}
              </button>
            ) : (
              <p className={`text-xs mt-1 ${card.subColor}`}>{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Technician  Section */}
      <div className="bg-white border border-gray-200 rounded-xl">
        {/*  Header */}
        <div className="p-5 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Technician </h2>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
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
              <input
                type="text"
                placeholder="Search technicians"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4361EE]/30 focus:border-[#4361EE] w-56"
              />
            </div>

            {/* Location Dropdown */}
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4361EE]/30 focus:border-[#4361EE] cursor-pointer"
              >
                <option>Kharghar</option>
                <option>Vashi</option>
                <option>Panvel</option>
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                  {tech.initials}
                </div>
                {/* Info */}
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-medium text-gray-900">
                      {tech.name}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${tech.statusStyle}`}
                    >
                      {tech.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {tech.location} · {tech.jobs} · {tech.rating}
                  </p>
                </div>
              </div>
              {/* Action */}
              <Link
                href="/technician"
                className="text-sm text-[#4361EE] hover:text-[#3a56d4] font-medium whitespace-nowrap no-underline"
              >
                View profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
