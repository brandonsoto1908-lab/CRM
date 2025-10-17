import { supabaseServer as supabase } from '@/lib/supabaseServerClient'

export default async function handler(req, res) {
  try {
    if(req.method === 'GET'){
      const { data, error } = await supabase
        .from('service_status')
        .select(`
          id, status, completed_at, notes,
          route_items (
            id, specifications,
            clients (id, name, email),
            client_addresses (address_text),
            routes (id, name, worker_id, workers(full_name))
          )
        `)
        .order('created_at', { ascending: false })

      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'POST'){
      const { route_item_id, status, notes } = req.body
      if(!route_item_id || !status) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const { data, error } = await supabase
        .from('service_status')
        .insert([{
          route_item_id,
          status,
          notes,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        }])
        .select()
        .single()

      if(error) throw error
      return res.status(201).json(data)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch(err){
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}