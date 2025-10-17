import { useEffect, useState } from 'react'
import WorkerForm from '../components/WorkerForm'

export default function Workers(){
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(()=>{ fetchWorkers() },[])

  async function fetchWorkers(){
    setLoading(true)
    const res = await fetch('/api/workers')
    const data = await res.json()
    setWorkers(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  function onSaved(){
    fetchWorkers()
    setEditing(null)
  }

  async function handleDelete(id){
    if(!confirm('Delete this worker?')) return
    const res = await fetch(`/api/workers/${id}`, { method: 'DELETE' })
    if(res.ok) fetchWorkers()
    else alert('Delete failed')
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Workers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Add / Edit Worker</h3>
          <WorkerForm onSaved={onSaved} editing={editing} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Existing Workers</h3>
          {loading ? <p>Loading...</p> : (
            <ul className="space-y-4">
              {workers.map(w => (
                <li key={w.id} className="border-b pb-2">
                  <div className="font-semibold">{w.full_name}</div>
                  <div className="text-sm text-gray-600">{w.email}</div>
                  <div className="text-sm text-gray-600">{w.phone}</div>
                  <div className="space-x-2 mt-2">
                    <button onClick={()=>setEditing(w)} className="text-sm px-2 py-1 bg-yellow-300 rounded">Edit</button>
                    <button onClick={()=>handleDelete(w.id)} className="text-sm px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
