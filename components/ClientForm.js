import { useState, useEffect } from 'react'

export default function ClientForm({ onSaved, editing, servicesList }){
  const [name, setName] = useState(editing?.name || '')
  const [email, setEmail] = useState(editing?.email || '')
  const [addresses, setAddresses] = useState(editing?.client_addresses || [{ address_text: '', notes: '' }])
  const [selectedServices, setSelectedServices] = useState(editing?.client_services || [])
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    setName(editing?.name || '')
    setEmail(editing?.email || '')
    setAddresses(editing?.client_addresses?.length ? editing.client_addresses : [{ address_text: '', notes: '' }])
    setSelectedServices(editing?.client_services?.length ? editing.client_services : [])
  }, [editing])

  function handleAddressChange(idx, field, value){
    setAddresses(addr => addr.map((a,i) => i===idx ? { ...a, [field]: value } : a))
  }
  function addAddress(){
    setAddresses(addr => [...addr, { address_text: '', notes: '' }])
  }
  function removeAddress(idx){
    setAddresses(addr => addr.filter((_,i) => i!==idx))
  }

  function handleServiceChange(idx, field, value){
    setSelectedServices(svcs => svcs.map((s,i) => i===idx ? { ...s, [field]: value } : s))
  }
  function addService(){
    setSelectedServices(svcs => [...svcs, { service_id: '', price: 0, discount: 0 }])
  }
  function removeService(idx){
    setSelectedServices(svcs => svcs.filter((_,i) => i!==idx))
  }

  async function handleSubmit(e){
    e.preventDefault()
    setSaving(true)
    try{
      // Prepare services with price and discount
      const services = selectedServices.map(s => {
        const basePrice = servicesList.find(sl => sl.id === s.service_id)?.price || 0
        const discount = parseFloat(s.discount) || 0
        return {
          service_id: s.service_id,
          price: basePrice - discount,
          notes: discount > 0 ? `Discount: $${discount.toFixed(2)}` : ''
        }
      })
      const payload = {
        name,
        email,
        addresses,
        services
      }
      const method = editing?.id ? 'PUT' : 'POST'
      const url = editing?.id ? `/api/clients/${editing.id}` : '/api/clients'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if(!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onSaved(data)
      setName('')
      setEmail('')
      setAddresses([{ address_text: '', notes: '' }])
      setSelectedServices([])
    }catch(err){
      alert('Error saving client: ' + (err.message || err))
    }finally{ setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full rounded border-gray-300" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Addresses</label>
        {addresses.map((a,idx)=>(
          <div key={idx} className="flex gap-2 mb-2">
            <input value={a.address_text} onChange={e=>handleAddressChange(idx,'address_text',e.target.value)} placeholder="Address" className="block w-2/3 rounded border-gray-300" required />
            <input value={a.notes} onChange={e=>handleAddressChange(idx,'notes',e.target.value)} placeholder="Notes" className="block w-1/3 rounded border-gray-300" />
            <button type="button" onClick={()=>removeAddress(idx)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addAddress} className="px-2 py-1 bg-green-500 text-white rounded">Add Address</button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Services</label>
        {selectedServices.map((s,idx)=>(
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <select value={s.service_id} onChange={e=>handleServiceChange(idx,'service_id',e.target.value)} className="block w-1/3 rounded border-gray-300" required>
              <option value="">Select service</option>
              {servicesList.map(sl=>(
                <option key={sl.id} value={sl.id}>{sl.name}</option>
              ))}
            </select>
            <span className="block w-1/4">${servicesList.find(sl=>sl.id===s.service_id)?.price?.toFixed(2) ?? '0.00'}</span>
            <input type="number" step="0.01" min="0" value={s.discount || ''} onChange={e=>handleServiceChange(idx,'discount',e.target.value)} placeholder="Discount" className="block w-1/4 rounded border-gray-300" />
            <button type="button" onClick={()=>removeService(idx)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addService} className="px-2 py-1 bg-green-500 text-white rounded">Add Service</button>
      </div>
      <div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}