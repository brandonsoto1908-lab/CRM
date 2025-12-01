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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Client Management</h2>
            <p className="text-gray-600 mt-1">Manage your client information</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl shadow-lg">
            <div className="text-sm font-medium opacity-90">Total Clients</div>
            <div className="text-3xl font-bold">{clients.length}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{editing ? 'Edit Client' : 'New Client'}</h3>
          </div>
          <ClientForm onSaved={onSaved} editing={editing} servicesList={services} />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h3 className="text-xl font-bold text-gray-800">Client List</h3>
            <span className="text-sm text-gray-500">{clients.length} registered clients</span>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="font-medium">No registered clients</p>
              <p className="text-sm mt-1">Start by adding your first client</p>
            </div>
          ) : (
            <div className="space-y-4">
              {clients.map(c => (
                <div key={c.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all hover:border-blue-300 bg-gradient-to-r from-white to-blue-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-800">{c.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {c.email}
                        </div>
                      </div>
                    </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-semibold text-gray-700">Addresses:</span>
                    </div>
                    {(c.client_addresses || []).length > 0 ? (
                      <ul className="ml-6 space-y-1">
                        {c.client_addresses.map(a => (
                          <li key={a.id} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <div>
                              <span>{a.address_text}</span>
                              {a.notes && <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">({a.notes})</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="ml-6 text-sm text-gray-400">No registered addresses</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="font-semibold text-gray-700">Services:</span>
                    </div>
                    {(c.client_services || []).length > 0 ? (
                      <div className="ml-6 space-y-2">
                        {c.client_services.map((s,idx) => {
                          const svc = services.find(sl=>sl.id===s.service_id)
                          return (
                            <div key={idx} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">{svc?.name || 'Service'}</span>
                                {s.notes && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">{s.notes}</span>}
                              </div>
                              <span className="text-sm font-bold text-green-700">${s.price?.toFixed(2) ?? '0.00'}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="ml-6 text-sm text-gray-400">No assigned services</p>
                    )}
                  </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={()=>setEditing(c)} 
                        className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition-all font-medium flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={()=>handleDelete(c.id)} 
                        className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white rounded-lg transition-all font-medium flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
