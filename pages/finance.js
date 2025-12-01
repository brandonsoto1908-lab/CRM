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

  async function handleDeleteInvoice(invoice) {
    if (!confirm(`¿Estás seguro de eliminar la factura #${invoice.invoice_number}?`)) {
      return
    }

    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Error al eliminar la factura')
      }

      // Actualizar la lista de facturas
      fetchInvoices()
    } catch (error) {
      alert('Error al eliminar la factura: ' + error.message)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Facturas</h2>
          <p className="text-gray-600 mt-1">Administra y genera facturas para tus clientes</p>
        </div>
        <button
          onClick={handleNewInvoice}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Factura
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h3 className="text-2xl font-bold text-gray-800">{editingInvoice ? 'Editar Factura' : 'Nueva Factura'}</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Factura #</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Cliente</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="py-4 px-6 text-right text-sm font-semibold text-gray-700">Total</th>
              <th className="py-4 px-6 text-right text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="border-t hover:bg-blue-50 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-900">{invoice.invoice_number}</td>
                <td className="py-4 px-6 text-gray-700">{invoice.clients?.name}</td>
                <td className="py-4 px-6 text-gray-600">
                  {invoice.issued_at ? 
                    new Date(invoice.issued_at).toLocaleDateString('es-ES') :
                    new Date(invoice.created_at).toLocaleDateString('es-ES')
                  }
                </td>
                <td className="py-4 px-6">
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
                <td className="py-4 px-6 text-right font-semibold text-gray-900">
                  ${invoice.total.toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditInvoice(invoice)}
                      className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <a 
                      href={`/api/invoices/${invoice.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-md transition-all font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF
                    </a>
                    <button
                      onClick={() => handleDeleteInvoice(invoice)}
                      className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
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
