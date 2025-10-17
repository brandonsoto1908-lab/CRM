import { useEffect, useState } from 'react'
import RouteForm from '../components/RouteForm'

export default function Routes(){
  const [routes, setRoutes] = useState([])
  const [workers, setWorkers] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    fetchRoutes()
    fetchWorkers()
    fetchClients()
  }, [])

  async function fetchRoutes(){
    setLoading(true)
    const res = await fetch('/api/routes')
    const data = await res.json()
    setRoutes(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  async function fetchWorkers(){
    const res = await fetch('/api/workers')
    const data = await res.json()
    setWorkers(Array.isArray(data) ? data : [])
  }

  async function fetchClients(){
    const res = await fetch('/api/clients')
    const data = await res.json()
    setClients(Array.isArray(data) ? data : [])
  }

  function onSaved(){
    fetchRoutes()
    setEditing(null)
  }

  async function handleDelete(id){
    if(!confirm('Delete this route?')) return
    const res = await fetch(`/api/routes/${id}`, { method: 'DELETE' })
    if(res.ok) fetchRoutes()
    else alert('Delete failed')
  }

  async function handleExportPDF(route){
    try {
      const { generateRoutePDF } = await import('../utils/pdf')
      await generateRoutePDF(route)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Routes</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Add / Edit Route</h3>
          <RouteForm 
            onSaved={onSaved} 
            editing={editing} 
            workersList={workers}
            clientsList={clients}
          />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Existing Routes</h3>
          {loading ? <p>Loading...</p> : (
            <ul className="space-y-4">
              {routes.map(route => (
                <li key={route.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{route.name || 'Untitled Route'}</div>
                      <div className="text-sm text-gray-600">
                        Worker: {route.workers?.full_name}
                      </div>
                      {route.notes && (
                        <div className="text-sm text-gray-500 mt-1">{route.notes}</div>
                      )}
                    </div>
                    <div className="space-x-2">
                      <button onClick={() => setEditing(route)} className="text-sm px-2 py-1 bg-yellow-300 rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(route.id)} className="text-sm px-2 py-1 bg-red-500 text-white rounded">
                        Delete
                      </button>
                      <button onClick={() => handleExportPDF(route)} className="text-sm px-2 py-1 bg-blue-500 text-white rounded">
                        Export PDF
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="font-medium text-sm">Clients in Route:</div>
                    <ul className="ml-4 mt-1">
                      {(route.route_items || []).map((item, idx) => (
                        <li key={item.id} className="text-sm">
                          {idx + 1}. {item.clients?.name} - {item.client_addresses?.address_text}
                          {item.specifications && (
                            <span className="text-gray-500"> ({item.specifications})</span>
                          )}
                        </li>
                      ))}
                    </ul>
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
