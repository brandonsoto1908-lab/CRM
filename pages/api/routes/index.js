import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res){
  try{
    if(req.method === 'GET'){
      // List routes with worker and items
      const { data, error } = await supabase
        .from('routes')
        .select('id, name, notes, worker_id, created_at, workers(id, full_name), route_items(id, client_id, client_address_id, position, specifications, clients(name), client_addresses(address_text))')
        .order('created_at', { ascending: false })
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'POST'){
      const { name, notes, worker_id, items } = req.body
      if(!worker_id) return res.status(400).json({ error: 'Worker is required' })
      // Create route
      const { data: route, error: err1 } = await supabase.from('routes').insert([{ name, notes, worker_id }]).select().single()
      if(err1) throw err1
      // Add route_items
      let itemData = []
      if(items && items.length > 0){
        const { data: itemRes, error: err2 } = await supabase.from('route_items').insert(
          items.map((it, idx) => ({
            route_id: route.id,
            client_id: it.client_id,
            client_address_id: it.client_address_id,
            position: idx,
            specifications: it.specifications
          }))
        ).select()
        if(err2) throw err2
        itemData = itemRes
      }
      return res.status(201).json({ route, items: itemData })
    }

    res.setHeader('Allow', ['GET','POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}