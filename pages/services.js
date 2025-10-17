import { useEffect, useState } from 'react'
import ServiceForm from '../components/ServiceForm'

export default function Services(){
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(()=>{ fetchServices() }, [])

  async function fetchServices(){
    setLoading(true)
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      if (Array.isArray(data)) {
        setServices(data)
      } else {
        setServices([])
        if (data && data.error) {
          alert('Error loading services: ' + data.error)
        }
      }
    } catch (err) {
      setServices([])
      alert('Error loading services: ' + (err.message || err))
    }
    setLoading(false)
  }

  function onSaved(item){
    // refresh list
    fetchServices()
    setEditing(null)
  }

  async function handleDelete(id){
    if(!confirm('Delete this service?')) return
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
    if(res.ok) fetchServices()
    else alert('Delete failed')
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Add / Edit Service</h3>
          <ServiceForm onSaved={onSaved} editing={editing} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Existing Services</h3>
          {loading ? <p>Loading...</p> : (
            Array.isArray(services) && services.length > 0 ? (
              <ul className="space-y-2">
                {services.map(s => (
                  <li key={s.id} className="flex justify-between items-start border-b pb-2">
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-sm text-gray-600">{s.description}</div>
                      <div className="text-sm text-gray-800 font-bold">${s.price?.toFixed(2) ?? '0.00'}</div>
                    </div>
                    <div className="space-x-2">
                      <button onClick={()=>setEditing(s)} className="text-sm px-2 py-1 bg-yellow-300 rounded">Edit</button>
                      <button onClick={()=>handleDelete(s.id)} className="text-sm px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p>No services found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
