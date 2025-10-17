import { useState, useEffect } from 'react'
import InvoiceForm from '../components/InvoiceForm'
import Link from 'next/link'

export default function Finance() {
  const [invoices, setInvoices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  async function fetchInvoices() {
    const res = await fetch('/api/invoices')
    const data = await res.json()
    setInvoices(Array.isArray(data) ? data : [])
  }

  function handleNewInvoice() {
    setEditingInvoice(null)
    setShowForm(true)
  }

  function handleEditInvoice(invoice) {
    setEditingInvoice(invoice)
    setShowForm(true)
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Finance</h2>
        <button
          onClick={handleNewInvoice}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Invoice
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded shadow mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{editingInvoice ? 'Edit Invoice' : 'New Invoice'}</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <InvoiceForm
            editing={editingInvoice}
            onSaved={() => {
              setShowForm(false)
              fetchInvoices()
            }}
          />
        </div>
      ) : null}

      <div className="bg-white shadow rounded">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Invoice #</th>
              <th className="py-3 px-4 text-left">Client</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="border-t">
                <td className="py-3 px-4">{invoice.invoice_number}</td>
                <td className="py-3 px-4">{invoice.clients?.name}</td>
                <td className="py-3 px-4">
                  {invoice.issued_at ? 
                    new Date(invoice.issued_at).toLocaleDateString() :
                    new Date(invoice.created_at).toLocaleDateString()
                  }
                </td>
                <td className="py-3 px-4">
                  <span className={`
                    inline-block px-2 py-1 rounded text-sm
                    ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'issued' ? 'bg-blue-100 text-blue-800' :
                      invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'}
                  `}>
                    {invoice.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  ${invoice.total.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEditInvoice(invoice)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    Edit
                  </button>
                  <a 
                    href={`/api/invoices/${invoice.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    PDF
                  </a>
                </td>
              </tr>
            ))}
            {!invoices.length && (
              <tr className="border-t">
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No invoices found. Click "New Invoice" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
