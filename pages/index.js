import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">STONE BY RIC — CRM</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/services" className="p-6 bg-white rounded shadow block">Services</Link>
          <Link href="/clients" className="p-6 bg-white rounded shadow block">Clients</Link>
          <Link href="/workers" className="p-6 bg-white rounded shadow block">Workers</Link>
          <Link href="/routes" className="p-6 bg-white rounded shadow block">Routes</Link>
          <Link href="/finance" className="p-6 bg-white rounded shadow block">Finance</Link>
        </div>
      </main>
    </div>
  )
}
