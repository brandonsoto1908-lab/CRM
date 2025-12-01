import { useState, useEffect } from 'react'

export default function ServiceForm({ onSaved, editing }){
  const [name, setName] = useState(editing?.name || '')
  const [description, setDescription] = useState(editing?.description || '')
  const [price, setPrice] = useState(editing?.price || '')
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    setName(editing?.name || '')
    setDescription(editing?.description || '')
    setPrice(editing?.price || '')
  }, [editing])

  async function handleSubmit(e){
    e.preventDefault()
    setSaving(true)
    try{
      const method = editing?.id ? 'PUT' : 'POST'
      const url = editing?.id ? `/api/services/${editing.id}` : '/api/services'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price: price ? parseFloat(price) : 0 })
      })
      if(!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onSaved(data)
      setName('')
      setDescription('')
      setPrice('')
    }catch(err){
      alert('Error saving service: ' + (err.message || err))
    }finally{ setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-md focus:shadow-lg focus:ring-2 focus:ring-blue-500 transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-md focus:shadow-lg focus:ring-2 focus:ring-blue-500 transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" step="0.01" min="0" value={price} onChange={e=>setPrice(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-md focus:shadow-lg focus:ring-2 focus:ring-blue-500 transition-all" />
      </div>
      <div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}
