import { useEffect, useState } from 'react'
import ClientForm from '../components/ClientForm'

export default function Clients(){
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(()=>{
    fetchClients()
    fetchServices()
  },[])

  async function fetchClients(){
    setLoading(true)
    const res = await fetch('/api/clients')
    const data = await res.json()
    setClients(Array.isArray(data) ? data : [])
    setLoading(false)
  }
  async function fetchServices(){
    const res = await fetch('/api/services')
    const data = await res.json()
    setServices(Array.isArray(data) ? data : [])
  }

  function onSaved(){
    fetchClients()
    setEditing(null)
  }

  async function handleDelete(id){
    if(!confirm('Delete this client?')) return
    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    if(res.ok) fetchClients()
    else alert('Delete failed')
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Clients</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Add / Edit Client</h3>
          <ClientForm onSaved={onSaved} editing={editing} servicesList={services} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Existing Clients</h3>
          {loading ? <p>Loading...</p> : (
            <ul className="space-y-4">
              {clients.map(c => (
                <li key={c.id} className="border-b pb-2">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-600">{c.email}</div>
                  <div className="mt-1">
                    <span className="font-medium">Addresses:</span>
                    <ul className="ml-4">
                      {(c.client_addresses || []).map(a => (
                        <li key={a.id}>{a.address_text} {a.notes && <span className="text-xs text-gray-500">({a.notes})</span>}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-1">
                    <span className="font-medium">Services:</span>
                    <ul className="ml-4">
                      {(c.client_services || []).map((s,idx) => {
                        const svc = services.find(sl=>sl.id===s.service_id)
                        return (
                          <li key={idx}>
                            {svc?.name || 'Service'} — ${s.price?.toFixed(2) ?? '0.00'} {s.notes && <span className="text-xs text-green-700">({s.notes})</span>}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className="space-x-2 mt-2">
                    <button onClick={()=>setEditing(c)} className="text-sm px-2 py-1 bg-yellow-300 rounded">Edit</button>
                    <button onClick={()=>handleDelete(c.id)} className="text-sm px-2 py-1 bg-red-500 text-white rounded">Delete</button>
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
