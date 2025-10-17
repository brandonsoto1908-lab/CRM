import { useState, useEffect } from 'react'

export default function InvoiceForm({ onSaved, editing }) {
  const [client_id, setClientId] = useState(editing?.client_id || '')
  const [items, setItems] = useState(editing?.invoice_items || [])
  const [notes, setNotes] = useState(editing?.notes || '')
  const [saving, setSaving] = useState(false)
  const [services, setServices] = useState([])
  const [clients, setClients] = useState([])
  const [completedServices, setCompletedServices] = useState([])

  useEffect(() => {
    fetchClients()
    fetchCompletedServices()
    fetchServices() // Esto cargará la lista inicial de servicios
  }, [])

  // Actualizar servicios cuando cambie el cliente seleccionado
  useEffect(() => {
    fetchServices()
  }, [client_id])

  useEffect(() => {
    if (editing) {
      setClientId(editing.client_id)
      setItems(editing.invoice_items)
      setNotes(editing.notes)
    }
  }, [editing])

  async function fetchServices() {
    // Solo obtenemos los servicios si no hay cliente seleccionado
    if (!client_id) {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
    } else {
      // Si hay cliente seleccionado, obtenemos sus servicios con precios personalizados
      const res = await fetch(`/api/clients/${client_id}`)
      const data = await res.json()
      // Convertimos los client_services a un formato compatible
      const clientServices = data.client_services?.map(cs => ({
        ...cs,
        id: cs.service_id,
        name: services.find(s => s.id === cs.service_id)?.name || ''
      })) || []
      setServices(clientServices)
    }
  }

  async function fetchClients() {
    const res = await fetch('/api/clients')
    const data = await res.json()
    setClients(Array.isArray(data) ? data : [])
  }

  async function fetchCompletedServices() {
    const res = await fetch('/api/service-status')
    const data = await res.json()
    setCompletedServices(
      Array.isArray(data) 
        ? data.filter(s => s.status === 'completed') 
        : []
    )
  }

  const emptyItem = {
    service_id: '',
    description: '',
    quantity: 1,
    price: 0,
    amount: 0
  }

  function handleAddItem() {
    setItems([...items, { ...emptyItem }])
  }

  function handleRemoveItem(idx) {
    setItems(items.filter((_, i) => i !== idx))
  }

  function handleItemChange(idx, field, value) {
    setItems(items.map((item, i) => {
      if (i !== idx) return item
      
      let updatedItem = { ...item }
      
      if (field === 'service_id') {
        const service = services.find(s => s.id === value)
        updatedItem = {
          ...updatedItem,
          [field]: value,
          // Usar el precio específico del cliente que ya incluye el descuento
          price: service?.price || 0,
          description: service?.name || ''
        }
      } else {
        updatedItem = {
          ...updatedItem,
          [field]: value
        }
      }
      
      // Calcular el amount usando el precio con descuento
      updatedItem.amount = Number((parseFloat(updatedItem.price) || 0) * (parseInt(updatedItem.quantity) || 1)).toFixed(2)
      
      return updatedItem
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!client_id) {
      alert('Please select a client')
      return
    }
    if (!items.length) {
      alert('Please add at least one item')
      return
    }

    setSaving(true)
    try {
      const method = editing?.id ? 'PUT' : 'POST'
      const url = editing?.id ? `/api/invoices/${editing.id}` : '/api/invoices'
      
      // Limpiar y validar los items antes de enviar
      const cleanedItems = items.map(item => ({
        service_id: item.service_id,
        description: item.description,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0
      }))
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id,
          items: cleanedItems,
          notes
        })
      })
      
      if (!res.ok) throw new Error(await res.text())
      
      const data = await res.json()
      onSaved(data)
      
      // Reset form
      setClientId('')
      setItems([])
      setNotes('')
    } catch (err) {
      console.error('Error saving invoice:', err)
      alert('Error saving invoice: ' + (err.message || err))
    } finally {
      setSaving(false)
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Client</label>
        <select
          value={client_id}
          onChange={e => setClientId(e.target.value)}
          className="mt-1 block w-full rounded border-gray-300"
          required
        >
          <option value="">Select client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Items</label>
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2 mt-2">
            <select
              value={item.service_id}
              onChange={e => handleItemChange(idx, 'service_id', e.target.value)}
              className="block w-full rounded border-gray-300"
              required
            >
              <option value="">Select service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ₡{service.price}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.quantity}
              onChange={e => handleItemChange(idx, 'quantity', parseInt(e.target.value))}
              placeholder="Qty"
              className="block w-20 rounded border-gray-300"
              min="1"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveItem(idx)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
        >
          Add Item
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="mt-1 block w-full rounded border-gray-300"
          rows="3"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          disabled={saving}
        >
          {saving ? 'Saving...' : (editing ? 'Update Invoice' : 'Create Invoice')}
        </button>
        
        {editing && (
          <button
            type="button"
            onClick={() => window.open(`/api/invoices/${editing.id}/pdf`, '_blank')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Generate PDF
          </button>
        )}
      </div>
    </form>
  )
}