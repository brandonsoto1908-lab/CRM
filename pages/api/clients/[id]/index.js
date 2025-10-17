import { supabaseServer as supabase } from '@/lib/supabaseServerClient'

export default async function handler(req, res) {
  const { id } = req.query

  try {
    if (req.method === 'GET') {
      // Get client with their specific service prices
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id, name, email,
          client_services (
            service_id,
            price,
            services (
              id, name
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return res.status(404).json({ error: 'Client not found' })

      // Reshape the data to make it easier to use
      const clientServices = data.client_services.map(cs => ({
        id: cs.service_id,
        service_id: cs.service_id,
        name: cs.services.name,
        price: cs.price
      }))

      return res.status(200).json({
        ...data,
        client_services: clientServices
      })
    }

    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error fetching client data' })
  }
}