'use client';

import React from 'react';

const phoneModels = [
  {
    name: 'Samsung Galaxy S24',
    modelId: 'SM-S921B',
    compatibleProtectors: 2,
    status: 'Supported',
  },
  {
    name: 'iPhone 15',
    modelId: 'iPhone15,4',
    compatibleProtectors: 2,
    status: 'Supported',
  },
  {
    name: 'Pixel 7a',
    modelId: 'Pixel-7A',
    compatibleProtectors: 0,
    status: 'Inactive',
  },
];

const catalogChecks = [
  {
    title: 'Compatibility',
    description: 'No incompatible product mappings found.',
    link: null,
  },
  {
    title: 'Pricing review',
    description: '2 changes awaiting backend approval.',
    link: 'Review changes',
  },
  {
    title: 'Inactive products',
    description: '3 items hidden from customer booking.',
    link: null,
  },
];

const protectorSKUs = [
  {
    sku: 'GLASS-S24',
    product: 'Tempered Glass Protector',
    compatibleModel: 'Galaxy S24',
    price: '₹299',
    installation: '₹99',
    status: 'Active',
  },
  {
    sku: 'PRIV-IP15',
    product: 'Privacy Film Protector',
    compatibleModel: 'iPhone 15',
    price: '₹349',
    installation: '₹99',
    status: 'Active',
  },
];

function PhoneIcon() {
  return (
    <div className="w-10 h-14 rounded-lg border-2 border-gray-300 bg-gray-50 flex items-center justify-center flex-shrink-0">
      <div className="w-4 h-1 rounded-full bg-gray-300" />
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status === 'Supported' || status === 'Active';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-gray-100 text-gray-500 border border-gray-200'
      }`}
    >
      {status}
    </span>
  );
}

export default function CatalogPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Phone &amp; protector catalog
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Publish compatible products only after back-office validation.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#4361EE] hover:bg-[#3a54d4] transition-colors shadow-sm">
          + Add product
        </button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1  gap-6">
        {/* Left column – Supported phone models */}
        <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Supported phone models
            </h2>
            <button className="text-sm font-medium text-[#4361EE] hover:underline">
              Add model
            </button>
          </div>

          <div className="space-y-3">
            {phoneModels.map((phone) => (
              <div
                key={phone.modelId}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50"
              >
                <PhoneIcon />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {phone.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Model ID: {phone.modelId} ·{' '}
                    {phone.compatibleProtectors > 0
                      ? `${phone.compatibleProtectors} compatible protectors`
                      : 'no bookable protector'}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={phone.status} />
                  <button className="text-sm font-medium text-[#4361EE] hover:underline">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

  
      </div>

      {/* Protector SKUs table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-5 py-4 border-b">
          <h2 className="text-base font-semibold text-gray-900">
            Protector SKUs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b bg-gray-50/60">
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Product
                </th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Compatible model
                </th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Product price
                </th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Installation
                </th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {protectorSKUs.map((item) => (
                <tr key={item.sku} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-sm text-gray-700">
                    {item.sku}
                  </td>
                  <td className="px-5 py-3.5 text-gray-900 font-medium">
                    {item.product}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {item.compatibleModel}
                  </td>
                  <td className="px-5 py-3.5 text-gray-900">{item.price}</td>
                  <td className="px-5 py-3.5 text-gray-900">
                    {item.installation}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={item.status} />
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
