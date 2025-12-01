import { useState, useEffect } from 'react'

export default function WorkerForm({ onSaved, editing }){
  const [full_name, setFullName] = useState(editing?.full_name || '')
  const [email, setEmail] = useState(editing?.email || '')
  const [phone, setPhone] = useState(editing?.phone || '')
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    setFullName(editing?.full_name || '')
    setEmail(editing?.email || '')
    setPhone(editing?.phone || '')
  }, [editing])

  async function handleSubmit(e){
    e.preventDefault()
    setSaving(true)
    try{
      const method = editing?.id ? 'PUT' : 'POST'
      const url = editing?.id ? `/api/workers/${editing.id}` : '/api/workers'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, phone })
      })
      if(!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onSaved(data)
      setFullName('')
      setEmail('')
      setPhone('')
    }catch(err){
      alert('Error saving worker: ' + (err.message || err))
    }finally{ setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input value={full_name} onChange={e=>setFullName(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-md focus:shadow-lg focus:ring-2 focus:ring-blue-500 transition-all" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-md focus:shadow-lg focus:ring-2 focus:ring-blue-500 transition-all" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} className="mt-1 block w-full rounded border-gray-300 shadow-md focus:shadow-lg focus:ring-2 focus:ring-blue-500 transition-all" />
      </div>
      <div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}