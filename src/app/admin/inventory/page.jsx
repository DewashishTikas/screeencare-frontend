'use client';

import { useState } from 'react';

const kpiCards = [
  { label: 'Available units', value: 126, color: 'text-gray-900' },
  { label: 'Reserved units', value: 14, color: 'text-gray-900' },
  { label: 'Low-stock SKUs', value: 2, color: 'text-red-600' },
];

const inventoryData = [
  {
    sku: 'GLASS-S24',
    protector: 'Tempered Glass',
    phone: 'Galaxy S24',
    onHand: 20,
    reserved: 3,
    available: 17,
    threshold: 5,
    lastUpdated: 'Today, 09:18',
    lowStock: false,
  },
  {
    sku: 'GLASS-IP15',
    protector: 'Tempered Glass',
    phone: 'iPhone 15',
    onHand: 10,
    reserved: 2,
    available: 8,
    threshold: 5,
    lastUpdated: 'Today, 09:12',
    lowStock: false,
  },
  {
    sku: 'PRIV-S24U',
    protector: 'Privacy Film',
    phone: 'Galaxy S24 Ultra',
    onHand: 3,
    reserved: 2,
    available: 1,
    threshold: 5,
    lastUpdated: 'Yesterday, 17:40',
    lowStock: true,
  },
];

const safeguardCards = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    title: 'Add stock',
    description: 'Record delivery reference and quantity.',
    bg: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.56 20h18.88a1 1 0 00.87-1.28l-8.6-14.86a1 1 0 00-1.72 0z" />
      </svg>
    ),
    title: 'Record damage',
    description: 'Reason required before reducing stock.',
    bg: 'bg-orange-50',
    borderColor: 'border-orange-100',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4361EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Correct inventory',
    description: 'Manual corrections require an audit note.',
    bg: 'bg-gray-50',
    borderColor: 'border-gray-100',
  },
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = inventoryData.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Available stock = stock on hand − reserved stock.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Stock history
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#4361EE] rounded-lg hover:bg-[#3a56d4] transition-colors">
            Adjust stock
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Protector Inventory Table */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 pb-4 gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Protector inventory</h2>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search SKU or model"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#4361EE]/30 focus:border-[#4361EE] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-200 bg-gray-50/60">
                <th className="text-left font-medium text-gray-500 px-5 py-3">SKU</th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">Protector</th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">Compatible phone</th>
                <th className="text-right font-medium text-gray-500 px-5 py-3">On hand</th>
                <th className="text-right font-medium text-gray-500 px-5 py-3">Reserved</th>
                <th className="text-right font-medium text-gray-500 px-5 py-3">Available</th>
                <th className="text-right font-medium text-gray-500 px-5 py-3">Threshold</th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">Last updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => (
                <tr key={item.sku} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`font-medium ${item.lowStock ? 'text-[#4361EE]' : 'text-gray-900'}`}>
                      {item.sku}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{item.protector}</td>
                  <td className="px-5 py-3.5 text-gray-700">{item.phone}</td>
                  <td className="px-5 py-3.5 text-right text-gray-900 font-medium">{item.onHand}</td>
                  <td className="px-5 py-3.5 text-right text-gray-700">{item.reserved}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`font-medium ${
                        item.available < item.threshold ? 'text-red-600' : 'text-gray-900'
                      }`}
                    >
                      {item.available}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-gray-700">{item.threshold}</td>
                  <td className="px-5 py-3.5 text-gray-500">{item.lastUpdated}</td>
                </tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-400">
                    No items match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjustment Safeguards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Adjustment safeguards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {safeguardCards.map((card) => (
            <button
              key={card.title}
              className={`${card.bg} border ${card.borderColor} rounded-xl p-5 text-left hover:shadow-sm transition-shadow group`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="shrink-0">{card.icon}</div>
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
              </div>
              <p className="text-sm text-gray-600 ml-9">{card.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
