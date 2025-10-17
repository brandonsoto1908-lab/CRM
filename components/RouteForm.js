import { useState, useEffect } from 'react'

export default function RouteForm({ onSaved, editing, workersList, clientsList }){
  const [name, setName] = useState(editing?.name || '')
  const [notes, setNotes] = useState(editing?.notes || '')
  const [workerId, setWorkerId] = useState(editing?.worker_id || '')
  const [routeItems, setRouteItems] = useState(editing?.route_items || [])
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    setName(editing?.name || '')
    setNotes(editing?.notes || '')
    setWorkerId(editing?.worker_id || '')
    setRouteItems(editing?.route_items?.length ? editing.route_items : [])
  }, [editing])

  function handleItemChange(idx, field, value){
    setRouteItems(items => items.map((it,i) => {
      if(i !== idx) return it
      if(field === 'client_id'){
        // Reset address when client changes
        const addresses = clientsList.find(c => c.id === value)?.client_addresses || []
        return { 
          ...it, 
          [field]: value,
          client_address_id: addresses[0]?.id || '',
          client: clientsList.find(c => c.id === value)
        }
      }
      return { ...it, [field]: value }
    }))
  }

  function addRouteItem(){
    setRouteItems(items => [...items, {
      client_id: '',
      client_address_id: '',
      specifications: ''
    }])
  }

  function removeRouteItem(idx){
    setRouteItems(items => items.filter((_,i) => i!==idx))
  }

  async function handleSubmit(e){
    e.preventDefault()
    if(!workerId) {
      alert('Please select a worker')
      return
    }
    if(!routeItems.length) {
      alert('Please add at least one client to the route')
      return
    }
    setSaving(true)
    try{
      const method = editing?.id ? 'PUT' : 'POST'
      const url = editing?.id ? `/api/routes/${editing.id}` : '/api/routes'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          notes,
          worker_id: workerId,
          items: routeItems
        })
      })
      if(!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onSaved(data)
      setName('')
      setNotes('')
      setWorkerId('')
      setRouteItems([])
    }catch(err){
      alert('Error saving route: ' + (err.message || err))
    }finally{
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Route Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="mt-1 block w-full rounded border-gray-300" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Worker</label>
        <select value={workerId} onChange={e=>setWorkerId(e.target.value)} className="mt-1 block w-full rounded border-gray-300" required>
          <option value="">Select worker</option>
          {workersList.map(w => (
            <option key={w.id} value={w.id}>{w.full_name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Route Items</label>
        {routeItems.map((item,idx)=>(
          <div key={idx} className="flex flex-col gap-2 p-2 mb-2 border rounded">
            <div className="flex gap-2">
              <select 
                value={item.client_id} 
                onChange={e=>handleItemChange(idx,'client_id',e.target.value)}
                className="block w-1/2 rounded border-gray-300"
                required
              >
                <option value="">Select client</option>
                {clientsList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select 
                value={item.client_address_id}
                onChange={e=>handleItemChange(idx,'client_address_id',e.target.value)}
                className="block w-1/2 rounded border-gray-300"
                required
              >
                <option value="">Select address</option>
                {clientsList
                  .find(c => c.id === item.client_id)
                  ?.client_addresses?.map(a => (
                    <option key={a.id} value={a.id}>{a.address_text}</option>
                  ))
                }
              </select>
            </div>
            <div>
              <input 
                value={item.specifications || ''}
                onChange={e=>handleItemChange(idx,'specifications',e.target.value)}
                placeholder="Specifications"
                className="block w-full rounded border-gray-300"
              />
            </div>
            <div>
              <button type="button" onClick={()=>removeRouteItem(idx)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addRouteItem} className="px-2 py-1 bg-green-500 text-white rounded">
          Add Client to Route
        </button>
      </div>
      <div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={saving}>
          {saving ? 'Saving...' : 'Save Route'}
        </button>
      </div>
    </form>
  )
}