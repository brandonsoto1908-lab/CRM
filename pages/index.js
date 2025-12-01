import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  UsersIcon, 
  BriefcaseIcon, 
  TruckIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline'

export default function Home() {
  const [stats, setStats] = useState({
    clients: 0,
    workers: 0,
    services: 0,
    routes: 0,
    invoices: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [clients, workers, services, routes, invoices] = await Promise.all([
        fetch('/api/clients').then(r => r.json()),
        fetch('/api/workers').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch('/api/routes').then(r => r.json()),
        fetch('/api/invoices').then(r => r.json())
      ])

      setStats({
        clients: Array.isArray(clients) ? clients.length : 0,
        workers: Array.isArray(workers) ? workers.length : 0,
        services: Array.isArray(services) ? services.length : 0,
        routes: Array.isArray(routes) ? routes.length : 0,
        invoices: Array.isArray(invoices) ? invoices.length : 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const cards = [
    { 
      name: 'Clientes', 
      value: stats.clients, 
      href: '/clients', 
      icon: UsersIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      name: 'Trabajadores', 
      value: stats.workers, 
      href: '/workers', 
      icon: BriefcaseIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      name: 'Servicios', 
      value: stats.services, 
      href: '/services', 
      icon: DocumentTextIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      name: 'Rutas', 
      value: stats.routes, 
      href: '/routes', 
      icon: TruckIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    { 
      name: 'Facturas', 
      value: stats.invoices, 
      href: '/finance', 
      icon: CurrencyDollarIcon,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ]

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido de nuevo!</h1>
        <p className="text-gray-600">Aquí está un resumen de tu negocio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link 
              key={card.name} 
              href={card.href}
              className="group"
            >
              <div className={`${card.bgColor} rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ChartBarIcon className={`w-5 h-5 ${card.textColor} opacity-50`} />
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{card.name}</h3>
                <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-gray-700">
                  <span>Ver detalles</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/clients" 
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <UsersIcon className="w-6 h-6" />
            <span className="font-medium">Nuevo Cliente</span>
          </Link>
          <Link 
            href="/services" 
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <DocumentTextIcon className="w-6 h-6" />
            <span className="font-medium">Nuevo Servicio</span>
          </Link>
          <Link 
            href="/finance" 
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <CurrencyDollarIcon className="w-6 h-6" />
            <span className="font-medium">Nueva Factura</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
