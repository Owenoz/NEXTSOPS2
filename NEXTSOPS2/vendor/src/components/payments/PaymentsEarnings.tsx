'use client'

import { DollarSign, TrendingUp, Clock, CheckCircle, Download, Calendar } from 'lucide-react'

export default function PaymentsEarnings() {
  const earnings = {
    total: 12500000,
    pending: 2300000,
    available: 10200000,
    thisMonth: 3500000,
  }

  const transactions = [
    {
      id: 1,
      type: 'payout',
      amount: 5000000,
      status: 'completed',
      date: '2026-05-01',
      method: 'Bank Transfer',
      reference: 'PAY-001',
    },
    {
      id: 2,
      type: 'sale',
      amount: 1200000,
      status: 'pending',
      date: '2026-05-04',
      order: 'ORD-234',
      commission: 180000,
    },
    {
      id: 3,
      type: 'sale',
      amount: 2100000,
      status: 'completed',
      date: '2026-05-03',
      order: 'ORD-233',
      commission: 315000,
    },
    {
      id: 4,
      type: 'payout',
      amount: 3000000,
      status: 'completed',
      date: '2026-04-25',
      method: 'Mobile Money',
      reference: 'PAY-002',
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Payments & Earnings</h1>
          <p className="text-gray-600 mt-1">Track your earnings and request payouts</p>
        </div>
        <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download Statement
        </button>
      </div>

      {/* Earnings Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold mb-1">UGX {earnings.total.toLocaleString()}</div>
          <div className="text-green-100">Total Earnings</div>
        </div>

        <div className="bg-white rounded-xl border-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">UGX {earnings.pending.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Pending Clearance</div>
        </div>

        <div className="bg-white rounded-xl border-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">UGX {earnings.available.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Available for Payout</div>
        </div>

        <div className="bg-white rounded-xl border-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">UGX {earnings.thisMonth.toLocaleString()}</div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
      </div>

      {/* Request Payout */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to withdraw?</h3>
            <p className="text-gray-600">
              You have <strong>UGX {earnings.available.toLocaleString()}</strong> available for payout
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Minimum payout: UGX 100,000 • Processing time: 2-3 business days
            </p>
          </div>
          <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold whitespace-nowrap">
            Request Payout
          </button>
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-white rounded-xl border-2 p-6 mb-8">
        <h3 className="text-lg font-bold mb-4">Commission Structure</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Your Commission Rate</div>
            <div className="text-2xl font-bold text-primary-600">15%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Commission Paid</div>
            <div className="text-2xl font-bold">UGX 1,875,000</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Net Earnings</div>
            <div className="text-2xl font-bold text-green-600">UGX 10,625,000</div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border-2 p-6">
        <h2 className="text-xl font-bold mb-6">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Reference</th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Commission</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{transaction.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'payout'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {transaction.type === 'payout' ? 'Payout' : 'Sale'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">
                    {transaction.type === 'payout' ? transaction.reference : transaction.order}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {transaction.type === 'payout' ? '-' : '+'}UGX {transaction.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-red-600">
                    {transaction.commission ? `-UGX ${transaction.commission.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button className="px-4 py-2 border-2 rounded-lg hover:border-primary-500">Previous</button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">1</button>
          <button className="px-4 py-2 border-2 rounded-lg hover:border-primary-500">2</button>
          <button className="px-4 py-2 border-2 rounded-lg hover:border-primary-500">Next</button>
        </div>
      </div>
    </div>
  )
}
